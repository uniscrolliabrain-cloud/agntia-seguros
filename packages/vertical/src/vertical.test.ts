import { describe, expect, it } from "vitest";
import { runVertical } from "./index";

describe("C40 vertical in process", () => {
  const result = runVertical();

  it("walks the documented chain in order", () => {
    expect(result.steps).toEqual([
      "c09:authorization_pending",
      "c11:prepared",
      "c12:stale-marked",
      "c13:accepted",
      "c15:identified",
      "c14:prepared",
      "c18:not_assessed",
      "c17:quote_000001",
      "c20:illustrative_only",
      "c23:deadline-armed",
      "c24:data_only",
      "c26:completed",
      "c33:accepted",
    ]);
  });

  it("produces no external effect and deduplicates the intent", () => {
    expect(result.effects).toEqual([]);
    expect(result.replayBlocked).toBe(true);
  });

  it("keeps the handoff and report states honest", () => {
    expect(result.handoffState).toBe("completed");
    expect(result.reportState).toBe("accepted");
    expect(result.estimate).toEqual({ amount: "4940000", currency: "EUR" });
  });
});
