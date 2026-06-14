import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { slugify } from "@guilherme-studio/schemas";
import sharp from "sharp";

export const SOURCE_ASSET_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".bmp",
  ".tif",
  ".tiff",
]);

export interface AssetOptimizeOptions {
  sourceDir: string;
  outputDir: string;
  manifestPath: string;
  quality?: number;
  maxWidth?: number;
  dryRun?: boolean;
}

export interface OptimizedAsset {
  sourcePath: string;
  outputPath: string;
  width: number;
  height: number;
  bytes: number;
  checksum: string;
}

export interface AssetManifest {
  apiVersion: "studio.guilherme.dev/assets-v1";
  generatedAt: string;
  quality: number;
  maxWidth: number;
  assets: OptimizedAsset[];
}

async function walkSources(dir: string, files: string[] = []): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkSources(absolute, files);
      continue;
    }
    if (entry.isFile() && SOURCE_ASSET_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      files.push(absolute);
    }
  }
  return files.sort((a, b) => a.localeCompare(b));
}

function outputName(sourcePath: string): string {
  const parsed = path.parse(sourcePath);
  return `${slugify(parsed.name)}.webp`;
}

async function checksum(filePath: string): Promise<string> {
  return createHash("sha256")
    .update(await readFile(filePath))
    .digest("hex");
}

export async function optimizeAssets(options: AssetOptimizeOptions): Promise<AssetManifest> {
  const quality = options.quality ?? 82;
  const maxWidth = options.maxWidth ?? 2400;
  const sourceRoot = path.resolve(options.sourceDir);
  const outputRoot = path.resolve(options.outputDir);
  const manifestPath = path.resolve(options.manifestPath);
  const sources = await walkSources(sourceRoot);
  const assets: OptimizedAsset[] = [];

  for (const sourcePath of sources) {
    const relativeDir = path.relative(sourceRoot, path.dirname(sourcePath));
    const outputDir = path.join(outputRoot, relativeDir);
    const outputPath = path.join(outputDir, outputName(sourcePath));
    if (!options.dryRun) {
      await mkdir(outputDir, { recursive: true });
      const image = sharp(sourcePath, { animated: false }).rotate();
      const metadata = await image.metadata();
      const shouldResize = metadata.width !== undefined && metadata.width > maxWidth;
      const pipeline = shouldResize
        ? image.resize({ width: maxWidth, withoutEnlargement: true })
        : image;
      await pipeline.webp({ quality, effort: 6 }).toFile(outputPath);
    }
    const metadata = options.dryRun
      ? await sharp(sourcePath, { animated: false }).metadata()
      : await sharp(outputPath).metadata();
    assets.push({
      sourcePath: path.relative(process.cwd(), sourcePath),
      outputPath: path.relative(process.cwd(), outputPath),
      width: metadata.width ?? 0,
      height: metadata.height ?? 0,
      bytes: options.dryRun ? 0 : (await readFile(outputPath)).byteLength,
      checksum: options.dryRun ? "dry-run" : await checksum(outputPath),
    });
  }

  const manifest: AssetManifest = {
    apiVersion: "studio.guilherme.dev/assets-v1",
    generatedAt: new Date().toISOString(),
    quality,
    maxWidth,
    assets,
  };

  if (!options.dryRun) {
    await mkdir(path.dirname(manifestPath), { recursive: true });
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, { mode: 0o644 });
  }

  return manifest;
}
