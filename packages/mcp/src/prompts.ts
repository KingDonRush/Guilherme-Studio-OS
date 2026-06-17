import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerStudioMcpPrompts(server: McpServer): void {
  server.prompt(
    "implementation_diagnosis",
    "Diagnose implementation mismatch using governed Studio context.",
    { subject_id: z.string().optional(), feedback: z.string() },
    ({ subject_id, feedback }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: [
              "Diagnose this implementation mismatch without mutating files first.",
              subject_id ? `Subject: ${subject_id}` : "Subject: not provided",
              `Feedback: ${feedback}`,
              "Use studio_get_entity, studio_inspect_repository and studio_register_evidence as needed.",
              "Separate observation, inference, decision and required evidence.",
            ].join("\n"),
          },
        },
      ],
    }),
  );
}
