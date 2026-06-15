import { createEntity } from "@guilherme-studio/schemas";
import { describe, expect, it } from "vitest";
import { EconomicNextActionResolver } from "./economics.js";

describe("economic next actions", () => {
  it("protects receivables and urgent obligations without hiding blocks", () => {
    const actions = new EconomicNextActionResolver().rank(
      [
        createEntity({
          kind: "invoice",
          title: "Pending international invoice",
          data: { amount_minor: 350_000, currency: "USD", due_at: "2026-06-13T12:00:00.000Z" },
        }),
        createEntity({
          kind: "task",
          title: "Blocked portfolio polish",
          status: "blocked",
          data: { priority: "high", effort_hours: 12 },
        }),
      ],
      new Date("2026-06-14T12:00:00.000Z"),
    );

    expect(actions[0]).toMatchObject({
      kind: "invoice",
      reasons: expect.arrayContaining(["receivable", "overdue"]),
    });
    expect(actions[1]?.blocked).toBe(true);
  });
});
