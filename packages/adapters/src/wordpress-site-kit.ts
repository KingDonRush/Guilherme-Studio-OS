import { createHash } from "node:crypto";
import { access, readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import type { StudioContext } from "@guilherme-studio/core";

export interface WordPressSiteKitAsset {
  sourcePath: string;
  runtimePath: string;
  wpPath: string;
  title: string;
  alt: string;
  checksum: string;
  bytes: number;
}

export interface WordPressSiteKitResult {
  apiVersion: "studio.guilherme.dev/wordpress-site-kit-v1";
  site: "mina-forma";
  dryRun: boolean;
  capsulePath: string;
  canonicalAssetPath: string;
  runtimeAssetPath: string;
  cssPath: string;
  manifestPath?: string;
  colors: Array<{ slug: string; title: string; color: string }>;
  typography: Array<{ slug: string; title: string; fontFamily: string; weight: string }>;
  iconPolicy: {
    primary: string;
    custom: string;
  };
  assets: WordPressSiteKitAsset[];
  elementorKit: {
    mode: "dry-run" | "applied";
    output?: string;
  };
  mediaLibrary: {
    mode: "dry-run" | "imported" | "skipped";
    imported?: unknown;
  };
  warnings: string[];
}

export interface WordPressSiteKitOptions {
  site: "mina-forma";
  capsulePath?: string;
  themePath?: string;
  importMedia?: boolean;
  dryRun?: boolean;
}

export interface WordPressSiteKitPlan {
  capsulePath: string;
  canonicalAssetPath: string;
  runtimeAssetPath: string;
  cssPath: string;
  colors: WordPressSiteKitResult["colors"];
  typography: WordPressSiteKitResult["typography"];
  iconPolicy: WordPressSiteKitResult["iconPolicy"];
  assets: WordPressSiteKitAsset[];
  warnings: string[];
}

export const MINA_FORMA_COLORS = [
  { slug: "mf-ink", title: "Mina Ink", color: "#151513" },
  { slug: "mf-paper", title: "Mina Warm Paper", color: "#F4EFE5" },
  { slug: "mf-surface", title: "Mina Surface", color: "#FBF8F0" },
  { slug: "mf-line", title: "Mina Fine Line", color: "#D8D0C4" },
  { slug: "mf-muted", title: "Mina Muted Text", color: "#5F625D" },
  { slug: "mf-cyan", title: "Mina Technical Cyan", color: "#14D8D2" },
  { slug: "mf-clay", title: "Mina Clay Accent", color: "#D96E32" },
  { slug: "mf-violet", title: "Mina Violet Accent", color: "#6654D9" },
  { slug: "mf-dark", title: "Mina Dark Section", color: "#23211E" },
  { slug: "mf-success", title: "Mina Success", color: "#2F9B75" },
];

export const MINA_FORMA_TYPOGRAPHY = [
  {
    slug: "mf-display",
    title: "Mina Display",
    fontFamily: "Archivo Black",
    weight: "400",
  },
  {
    slug: "mf-heading",
    title: "Mina Section Heading",
    fontFamily: "Space Grotesk",
    weight: "700",
  },
  {
    slug: "mf-body",
    title: "Mina Body",
    fontFamily: "Hind",
    weight: "500",
  },
  {
    slug: "mf-card-title",
    title: "Mina Card Title",
    fontFamily: "Space Grotesk",
    weight: "700",
  },
  {
    slug: "mf-small",
    title: "Mina Small Copy",
    fontFamily: "Hind",
    weight: "500",
  },
  {
    slug: "mf-label",
    title: "Mina Labels",
    fontFamily: "Space Grotesk",
    weight: "700",
  },
];

const ICON_POLICY = {
  primary: "Use Elementor and Font Awesome native icons first.",
  custom: "Use approved Mina Forma SVG/WebP assets only when native icons do not match.",
};

export async function createWordPressSiteKitPlan(
  context: StudioContext,
  options: WordPressSiteKitOptions,
): Promise<WordPressSiteKitPlan> {
  if (options.site !== "mina-forma") {
    throw new Error(`Unsupported WordPress site kit: ${options.site}.`);
  }
  const capsulePath = options.capsulePath ?? "portfolio/sites/multipaginados/mina-forma";
  const themePath = options.themePath ?? "wordpress/wp-content/themes/guilherme-portfolio";
  const absoluteCapsulePath = assertInsideStudioRoot(context, capsulePath, "Capsule path");
  const absoluteThemePath = assertInsideStudioRoot(context, themePath, "Theme path");
  const canonicalAssetPath = path.join(absoluteCapsulePath, "assets", "wordpress");
  const runtimeAssetPath = path.join(absoluteThemePath, "assets", "images", "mina-forma");
  const cssPath = path.join(absoluteThemePath, "assets", "css", "mina-forma-kit.css");
  const warnings: string[] = [];

  if (!(await pathExists(canonicalAssetPath))) {
    const message = `Canonical asset path does not exist: ${path.relative(
      context.paths.root,
      canonicalAssetPath,
    )}`;
    if (!options.dryRun) {
      throw new Error(message);
    }
    warnings.push(message);
  }

  return {
    capsulePath: path.relative(context.paths.root, absoluteCapsulePath),
    canonicalAssetPath: path.relative(context.paths.root, canonicalAssetPath),
    runtimeAssetPath: path.relative(context.paths.root, runtimeAssetPath),
    cssPath: path.relative(context.paths.root, cssPath),
    colors: MINA_FORMA_COLORS,
    typography: MINA_FORMA_TYPOGRAPHY,
    iconPolicy: ICON_POLICY,
    assets: await scanSiteKitAssets({
      context,
      canonicalAssetPath,
      runtimeAssetPath,
      themePath: absoluteThemePath,
    }),
    warnings,
  };
}

export function buildMediaImportEvalPhp(assets: WordPressSiteKitAsset[]): string {
  const encoded = Buffer.from(JSON.stringify(assets), "utf8").toString("base64");
  return `
$assets = json_decode(base64_decode('${encoded}'), true);
if (!is_array($assets)) {
    WP_CLI::error('Invalid Mina Forma media payload.');
}
if (defined('WP_CLI') && WP_CLI && !get_current_user_id()) {
    $administrators = get_users(array('role' => 'administrator', 'number' => 1, 'fields' => 'ids'));
    if (!empty($administrators[0])) {
        wp_set_current_user(absint($administrators[0]));
    }
}
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
$results = array();
foreach ($assets as $asset) {
    $existing = get_posts(array(
        'post_type' => 'attachment',
        'post_status' => 'inherit',
        'posts_per_page' => 1,
        'fields' => 'ids',
        'meta_key' => '_studio_asset_source',
        'meta_value' => $asset['sourcePath'],
    ));
    if (!empty($existing[0])) {
        $id = absint($existing[0]);
        $results[] = array(
            'id' => $id,
            'status' => 'existing',
            'sourcePath' => $asset['sourcePath'],
            'url' => wp_get_attachment_url($id),
        );
        continue;
    }
    $source = ABSPATH . $asset['wpPath'];
    if (!is_file($source)) {
        $results[] = array(
            'status' => 'missing_source',
            'sourcePath' => $asset['sourcePath'],
            'wpPath' => $asset['wpPath'],
        );
        continue;
    }
    $uploads = wp_upload_dir();
    if (!empty($uploads['error'])) {
        WP_CLI::error($uploads['error']);
    }
    $filename = wp_unique_filename($uploads['path'], basename($source));
    $destination = trailingslashit($uploads['path']) . $filename;
    if (!copy($source, $destination)) {
        $results[] = array(
            'status' => 'copy_failed',
            'sourcePath' => $asset['sourcePath'],
            'wpPath' => $asset['wpPath'],
        );
        continue;
    }
    $filetype = wp_check_filetype($filename, null);
    $id = wp_insert_attachment(array(
        'post_mime_type' => $filetype['type'],
        'post_title' => $asset['title'],
        'post_name' => sanitize_title($asset['title']),
        'post_content' => '',
        'post_excerpt' => $asset['alt'],
        'post_status' => 'inherit',
    ), $destination);
    if (is_wp_error($id)) {
        @unlink($destination);
        $results[] = array(
            'status' => 'insert_failed',
            'sourcePath' => $asset['sourcePath'],
            'error' => $id->get_error_message(),
        );
        continue;
    }
    $metadata = wp_generate_attachment_metadata($id, $destination);
    wp_update_attachment_metadata($id, $metadata);
    update_post_meta($id, '_wp_attachment_image_alt', $asset['alt']);
    update_post_meta($id, '_studio_asset_source', $asset['sourcePath']);
    update_post_meta($id, '_studio_asset_checksum', $asset['checksum']);
    update_post_meta($id, '_studio_asset_site', 'mina-forma');
    $results[] = array(
        'id' => $id,
        'status' => 'imported',
        'sourcePath' => $asset['sourcePath'],
        'url' => wp_get_attachment_url($id),
    );
}
WP_CLI::line(wp_json_encode(array(
    'apiVersion' => 'studio.guilherme.dev/wordpress-media-import-v1',
    'site' => 'mina-forma',
    'assets' => $results,
)));
`;
}

function assertInsideStudioRoot(context: StudioContext, inputPath: string, label: string): string {
  const absolutePath = path.resolve(context.paths.root, inputPath);
  const root = path.resolve(context.paths.root);
  if (absolutePath !== root && !absolutePath.startsWith(`${root}${path.sep}`)) {
    throw new Error(`${label} must stay inside the Studio root.`);
  }
  return absolutePath;
}

async function pathExists(inputPath: string): Promise<boolean> {
  try {
    await access(inputPath);
    return true;
  } catch {
    return false;
  }
}

async function scanSiteKitAssets(input: {
  context: StudioContext;
  canonicalAssetPath: string;
  runtimeAssetPath: string;
  themePath: string;
}): Promise<WordPressSiteKitAsset[]> {
  if (!(await pathExists(input.canonicalAssetPath))) {
    return [];
  }
  const files = (await walkFiles(input.canonicalAssetPath, input.canonicalAssetPath)).filter(
    (file) => [".webp", ".svg"].includes(path.extname(file).toLowerCase()),
  );
  const assets: WordPressSiteKitAsset[] = [];
  for (const relativePath of files) {
    const sourcePath = path.join(input.canonicalAssetPath, relativePath);
    const runtimePath = path.join(input.runtimeAssetPath, relativePath);
    const stats = await stat(sourcePath);
    const title = titleFromAsset(relativePath);
    assets.push({
      sourcePath: path.relative(input.context.paths.root, sourcePath),
      runtimePath: path.relative(input.context.paths.root, runtimePath),
      wpPath: path.posix.join(
        "wp-content/themes",
        path.basename(input.themePath),
        "assets/images/mina-forma",
        ...relativePath.split(path.sep),
      ),
      title,
      alt: altFromAsset(relativePath, title),
      checksum: await checksumFile(sourcePath),
      bytes: stats.size,
    });
  }
  return assets;
}

async function walkFiles(dir: string, root: string, out: string[] = []): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkFiles(absolute, root, out);
      continue;
    }
    if (entry.isFile()) {
      out.push(path.relative(root, absolute));
    }
  }
  return out.sort((a, b) => a.localeCompare(b));
}

function titleFromAsset(relativePath: string): string {
  const name = path.parse(relativePath).name;
  const cleaned = name
    .replace(/^(mf|mina|sbp)-/i, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
  if (relativePath.includes("batch-4-sbp")) {
    return `Mina Forma SBP ${cleaned}`;
  }
  if (relativePath.includes("aurora-cafe")) {
    return `Mina Forma Aurora Cafe ${cleaned.replace(/^Aurora Cafe /, "")}`;
  }
  return `Mina Forma ${cleaned}`;
}

function altFromAsset(relativePath: string, title: string): string {
  if (relativePath.includes("batch-4-sbp")) {
    return `${title} visual for the Mina Forma project planning quote flow.`;
  }
  if (relativePath.includes("batch-2-projects") || relativePath.includes("aurora-cafe")) {
    return `${title} interior image for the Mina Forma case-study demo.`;
  }
  if (relativePath.includes("batch-3-materials")) {
    return `${title} material or deliverable image for the Mina Forma institutional demo.`;
  }
  if (relativePath.includes("batch-5-lineart")) {
    return `${title} line-art support image for the Mina Forma institutional demo.`;
  }
  return `${title} visual asset for the Mina Forma institutional WordPress demo.`;
}

async function checksumFile(filePath: string): Promise<string> {
  return createHash("sha256")
    .update(await readFile(filePath))
    .digest("hex");
}
