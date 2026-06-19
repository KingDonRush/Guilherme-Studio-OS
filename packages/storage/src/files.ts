import { constants as fsConstants } from "node:fs";
import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import {
  assertNoSecrets,
  entityId,
  entitySlug,
  KIND_DIRECTORY,
  LegacyEntitySchema,
  type StudioEntity,
  TypedEntitySchema,
} from "@guilherme-studio/schemas";
import YAML from "yaml";

export interface StudioFile {
  absolutePath: string;
  relativePath: string;
  entity: StudioEntity;
}

export interface LegacyStudioFile {
  absolutePath: string;
  relativePath: string;
  entity: ReturnType<typeof LegacyEntitySchema.parse>;
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export function entityRelativePath(entity: StudioEntity): string {
  const dir = KIND_DIRECTORY[entity.kind];
  return path.posix.join(dir, `${entitySlug(entity)}.${entityId(entity)}.yaml`);
}

export async function scanStudioFiles(
  root: string,
  readByPath: (absolutePath: string) => Promise<StudioEntity>,
): Promise<StudioFile[]> {
  const files: StudioFile[] = [];
  for (const dir of [...new Set(Object.values(KIND_DIRECTORY))]) {
    const absoluteDir = path.join(root, dir);
    if (!(await fileExists(absoluteDir))) {
      continue;
    }
    await walkCanonicalYaml(root, absoluteDir, readByPath, files);
  }
  return files.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}

async function walkCanonicalYaml(
  root: string,
  dir: string,
  readByPath: (absolutePath: string) => Promise<StudioEntity>,
  out: StudioFile[],
): Promise<void> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const absolutePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkCanonicalYaml(root, absolutePath, readByPath, out);
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith(".yaml")) {
      continue;
    }
    out.push({
      absolutePath,
      relativePath: path.relative(root, absolutePath),
      entity: await readByPath(absolutePath),
    });
  }
}

export class LegacyEntityStore {
  readonly root: string;

  constructor(root: string) {
    this.root = root;
  }

  async scan(): Promise<LegacyStudioFile[]> {
    const files: LegacyStudioFile[] = [];
    for (const dir of [...new Set(Object.values(KIND_DIRECTORY))]) {
      const absoluteDir = path.join(this.root, dir);
      if (!(await fileExists(absoluteDir))) {
        continue;
      }
      await this.walkYaml(absoluteDir, files);
    }
    return files.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
  }

  private async walkYaml(dir: string, out: LegacyStudioFile[]): Promise<void> {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const absolutePath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await this.walkYaml(absolutePath, out);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith(".yaml")) {
        continue;
      }
      const parsed = YAML.parse(await readFile(absolutePath, "utf8"));
      const legacy = LegacyEntitySchema.safeParse(parsed);
      if (!legacy.success) {
        continue;
      }
      assertNoSecrets(legacy.data);
      out.push({
        absolutePath,
        relativePath: path.relative(this.root, absolutePath),
        entity: legacy.data,
      });
    }
  }
}

export async function scanCanonicalFilesLenient(root: string): Promise<StudioFile[]> {
  const files: StudioFile[] = [];
  const walk = async (dir: string): Promise<void> => {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const absolutePath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(absolutePath);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith(".yaml")) {
        continue;
      }
      const parsed = TypedEntitySchema.safeParse(YAML.parse(await readFile(absolutePath, "utf8")));
      if (parsed.success) {
        files.push({
          absolutePath,
          relativePath: path.relative(root, absolutePath),
          entity: parsed.data,
        });
      }
    }
  };

  for (const dir of [...new Set(Object.values(KIND_DIRECTORY))]) {
    const absoluteDir = path.join(root, dir);
    if (await fileExists(absoluteDir)) {
      await walk(absoluteDir);
    }
  }
  return files;
}
