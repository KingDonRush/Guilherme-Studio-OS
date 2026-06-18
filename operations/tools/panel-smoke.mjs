#!/usr/bin/env node
import { constants as fsConstants } from "node:fs";
import { access, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright-core";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(dirname, "../..");
const host = "127.0.0.1";

main().catch((error) => {
  console.error(
    JSON.stringify(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
});

async function main() {
  const panelDist = path.join(repoRoot, "apps/panel/dist");
  const localApiEntry = path.join(repoRoot, "packages/local-api/dist/index.js");
  await assertPath(panelDist, "Built panel not found. Run npm run build first.");
  await assertPath(localApiEntry, "Built local API not found. Run npm run build first.");

  const port = await findOpenPort();
  const root = await createSmokeRoot(port);
  const screenshotDir = path.join(repoRoot, "runtime/panel-smoke");
  const screenshotPath = path.join(screenshotDir, "panel-smoke.png");
  await mkdir(screenshotDir, { recursive: true });

  const { createLocalApi } = await import(pathToFileURL(localApiEntry).href);
  const { app } = await createLocalApi({ root, panelDist });
  const consoleErrors = [];
  let browser;

  try {
    await app.listen({ host, port });
    browser = await chromium.launch({
      executablePath: process.env.STUDIO_PANEL_CHROME ?? "/usr/bin/google-chrome",
      headless: true,
      args: ["--no-sandbox", "--disable-gpu"],
    });

    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });
    page.on("pageerror", (error) => {
      consoleErrors.push(error.message);
    });

    const baseUrl = `http://${host}:${port}`;
    const checks = [];

    await page.goto(`${baseUrl}/#/`, { waitUntil: "networkidle", timeout: 45_000 });
    checks.push(await waitForText(page, "Receita, obrigações e envio externo"));
    checks.push(await waitForText(page, "Lacunas de intake canônico"));
    await assertNoHorizontalOverflow(page);

    await page.goto(`${baseUrl}/#/agents`, { waitUntil: "networkidle", timeout: 45_000 });
    checks.push(await waitForText(page, "Guilherme Studio OS"));
    checks.push(await waitForText(page, "Agent harness loop"));
    checks.push(await waitForText(page, "Projeção rev"));
    await assertNoHorizontalOverflow(page);

    await page.goto(`${baseUrl}/#/crm`, { waitUntil: "networkidle", timeout: 45_000 });
    checks.push(await waitForText(page, "Registrar prospect"));
    await page.getByLabel("Nome do prospect").fill("Panel smoke prospect");
    await page.getByLabel("Contexto inicial").fill("Smoke test for governed panel mutation.");
    await page.getByRole("button", { name: /Revisar comando/i }).click();
    checks.push(await waitForText(page, "Payload exato"));
    checks.push(await waitForText(page, "entity.create"));
    await page.getByRole("button", { name: /Executar payload revisado/i }).click();
    checks.push(await waitForText(page, "Executado via command runtime"));
    checks.push(await waitForText(page, "Panel smoke prospect"));
    await assertNoHorizontalOverflow(page);

    await page.goto(`${baseUrl}/#/career`, { waitUntil: "networkidle", timeout: 45_000 });
    checks.push(await waitForText(page, "Preparar candidatura LinkedIn"));
    checks.push(await waitForText(page, "URL LinkedIn"));
    await assertNoHorizontalOverflow(page);

    await page.goto(`${baseUrl}/#/delivery`, { waitUntil: "networkidle", timeout: 45_000 });
    checks.push(await waitForText(page, "Registrar projeto WordPress"));
    checks.push(await waitForText(page, "Registrar repo do projeto"));
    await assertNoHorizontalOverflow(page);

    await page.goto(`${baseUrl}/#/products`, { waitUntil: "networkidle", timeout: 45_000 });
    checks.push(await waitForText(page, "Registrar produto"));
    checks.push(await waitForText(page, "Preparar release"));
    await assertNoHorizontalOverflow(page);

    await page.goto(`${baseUrl}/#/portfolio`, { waitUntil: "networkidle", timeout: 45_000 });
    checks.push(await waitForText(page, "Preparar conteúdo"));
    await assertNoHorizontalOverflow(page);

    await page.goto(`${baseUrl}/#/finance`, { waitUntil: "networkidle", timeout: 45_000 });
    checks.push(await waitForText(page, "Criar invoice para contrato"));
    checks.push(await waitForText(page, "Contrato"));
    await assertNoHorizontalOverflow(page);

    await page.goto(`${baseUrl}/#/control`, { waitUntil: "networkidle", timeout: 45_000 });
    checks.push(await waitForText(page, "Acceptance"));
    checks.push(await waitForText(page, "Ações preparadas"));
    await assertNoHorizontalOverflow(page);

    await page.screenshot({ fullPage: true, path: screenshotPath });

    if (consoleErrors.length > 0) {
      throw new Error(`Panel console errors: ${consoleErrors.join(" | ")}`);
    }

    console.log(
      JSON.stringify(
        {
          ok: true,
          url: baseUrl,
          checks,
          screenshot: screenshotPath,
        },
        null,
        2,
      ),
    );
  } finally {
    await browser?.close();
    await app.close();
    if (process.env.STUDIO_PANEL_SMOKE_KEEP !== "1") {
      await rm(root, { force: true, recursive: true });
    }
  }
}

async function createSmokeRoot(port) {
  const root = await mkdtemp(path.join(os.tmpdir(), "studio-panel-smoke-"));
  await writeFile(
    path.join(root, "studio.config.yaml"),
    [
      "api_version: studio.guilherme.dev/config-v1",
      "root_name: Panel smoke",
      "operator_id: per_20260614_guilherme-silva",
      "canonical_roots:",
      "  - data",
      "  - clients",
      "  - products",
      "  - portfolio",
      "  - marketing",
      "  - sales",
      "  - career",
      "  - operations",
      "  - docs/studio-os",
      "runtime_path: runtime",
      "panel:",
      `  host: ${host}`,
      `  port: ${port}`,
      "adapters: {}",
      "",
    ].join("\n"),
  );
  return root;
}

async function assertPath(targetPath, message) {
  try {
    await access(targetPath, fsConstants.R_OK);
  } catch {
    throw new Error(`${message} Missing path: ${targetPath}`);
  }
}

async function findOpenPort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.once("error", reject);
    server.listen(0, host, () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : undefined;
      server.close(() => {
        if (typeof port === "number") {
          resolve(port);
          return;
        }
        reject(new Error("Could not allocate a local port."));
      });
    });
  });
}

async function waitForText(page, text) {
  await page.getByText(text, { exact: false }).first().waitFor({ timeout: 15_000 });
  return text;
}

async function assertNoHorizontalOverflow(page) {
  const layout = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  if (layout.scrollWidth > layout.clientWidth + 1) {
    throw new Error(
      `Panel has horizontal overflow: ${layout.scrollWidth}px over ${layout.clientWidth}px.`,
    );
  }
}
