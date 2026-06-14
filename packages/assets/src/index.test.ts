import { mkdir, mkdtemp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { optimizeAssets } from "./index.js";

describe("assets", () => {
  it("converts raster sources to optimized webp with a manifest", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "studio-assets-test-"));
    const sourceDir = path.join(root, "sources");
    const outputDir = path.join(root, "webp");
    const manifestPath = path.join(root, "manifest.json");
    await mkdir(sourceDir, { recursive: true });
    await sharp({
      create: {
        width: 32,
        height: 24,
        channels: 4,
        background: "#00d5ff",
      },
    })
      .png()
      .toFile(path.join(sourceDir, "Hero Mockup.png"));

    const manifest = await optimizeAssets({
      sourceDir,
      outputDir,
      manifestPath,
      quality: 80,
      maxWidth: 64,
    });

    expect(manifest.assets).toHaveLength(1);
    expect(manifest.assets[0]?.outputPath.endsWith("hero-mockup.webp")).toBe(true);
    expect(manifest.assets[0]?.checksum).toHaveLength(64);
  });
});
