import { createEntity } from "@guilherme-studio/schemas";
import { describe, expect, it } from "vitest";
import { evaluatePrdCoverage } from "./coverage.js";

describe("PRD coverage", () => {
  it("separates implemented schema capacity from missing canonical intake data", () => {
    const report = evaluatePrdCoverage([
      createEntity({ kind: "task", title: "Current task" }),
      createEntity({
        kind: "evidence",
        title: "Verification evidence",
        data: { evidence_type: "command" },
      }),
      createEntity({ kind: "product", title: "Product" }),
      createEntity({ kind: "repository", title: "Repository" }),
    ]);

    expect(report.summary.missing_capability).toBe(0);
    expect(report.summary.needs_intake).toBeGreaterThan(0);
    expect(
      report.intake_required.some(
        (entry) => entry.prd_id === "prd-09-finance-contracts-obligations",
      ),
    ).toBe(true);
  });
});
