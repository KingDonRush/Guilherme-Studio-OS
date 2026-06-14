#!/usr/bin/env node
import { createProgram } from "./index.js";

try {
  await createProgram().parseAsync();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
}
