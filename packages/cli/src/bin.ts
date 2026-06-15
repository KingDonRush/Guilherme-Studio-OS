#!/usr/bin/env node
import { classifyStudioError } from "@guilherme-studio/core";
import { createResultEnvelope } from "@guilherme-studio/schemas";
import { createProgram, exitCodeForEnvelope } from "./index.js";

try {
  await createProgram().parseAsync();
} catch (error) {
  const classified = classifyStudioError(error);
  const result = createResultEnvelope({
    status: classified.status,
    error: {
      code: classified.code,
      message: classified.message,
      details: {},
    },
  });
  if (process.argv.includes("--json")) {
    console.error(JSON.stringify(result, null, 2));
  } else {
    console.error(classified.message);
  }
  process.exitCode = exitCodeForEnvelope(result);
}
