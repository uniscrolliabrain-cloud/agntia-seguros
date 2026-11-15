import { z } from "zod";
import { ServiceError, isoInstantSchema, opaqueIdSchema } from "@agntia/contracts";

/**
 * C26 — Operator handoff.
 * proposed → offered → acknowledged → working → completed | returned.
 * An emitted event is not a receipt: `completed` is unreachable without an ACK.
 * A duplicate notice to the same recipient is a conflict, not a second send.
 */
export const handoffStateSchema = z.enum(["proposed", "offered", "acknowledged", "working", "completed", "returned"]);

export const handoffSchema = z.strictObject({
  handoffRef: opaqueIdSchema,
  noticeRef: opaqueIdSchema,
  recipient: z.string().min(2).max(120),
  state: handoffStateSchema,
  ackRef: opaqueIdSchema.nullable(),
  evidenceRefs: z.array(opaqueIdSchema).max(50),
});

export type Handoff = z.infer<typeof handoffSchema>;

export const handoffEventSchema = z.enum(["offer", "acknowledge", "start", "complete", "return"]);

const TRANSITIONS: Record<string, { readonly from: readonly string[]; readonly to: string }> = {
  offer: { from: ["proposed"], to: "offered" },
  acknowledge: { from: ["offered"], to: "acknowledged" },
  start: { from: ["acknowledged"], to: "working" },
  complete: { from: ["working"], to: "completed" },
  return: { from: ["offered", "acknowledged", "working"], to: "returned" },
};

export function transitionHandoff(input: unknown, event: unknown, ackRef: string | null = null): Handoff {
  const handoff = handoffSchema.parse(input);
  const parsedEvent = handoffEventSchema.parse(event);
  const transition = TRANSITIONS[parsedEvent];
  if (!transition) {
    throw new ServiceError("UNPROCESSABLE", "unknown handoff event");
  }
  if (!transition.from.includes(handoff.state)) {
    throw new ServiceError("CONFLICT", "illegal handoff transition", {
      details: { from: handoff.state, event: parsedEvent },
    });
  }
  if (parsedEvent === "start" || parsedEvent === "complete") {
    if (handoff.ackRef === null) {
      throw new ServiceError("CONFLICT", "handoff has no acknowledgement", {
        details: { reason: "HANDOFF_NOT_ACKNOWLEDGED" },
      });
    }
  }
  const nextAckRef = parsedEvent === "acknowledge" ? ackRef : handoff.ackRef;
  if (parsedEvent === "acknowledge" && nextAckRef === null) {
    throw new ServiceError("UNPROCESSABLE", "acknowledgement requires a receipt reference");
  }
  return { ...handoff, state: handoffStateSchema.parse(transition.to), ackRef: nextAckRef };
}

export function assertNoDuplicateNotice(
  existing: readonly { readonly noticeRef: string; readonly recipient: string }[],
  candidate: { readonly noticeRef: string; readonly recipient: string },
): void {
  const duplicate = existing.some(
    (item) => item.noticeRef === candidate.noticeRef && item.recipient === candidate.recipient,
  );
  if (duplicate) {
    throw new ServiceError("CONFLICT", "notice already handed off to this recipient", {
      details: { reason: "DUPLICATE_NOTICE", noticeRef: candidate.noticeRef },
    });
  }
}

/**
 * C28 — Deadlines.
 * A deadline needs jurisdiction, a rule and a proven trigger. Changing the
 * trigger forces a new revision instead of silently moving the date.
 */
export const deadlineTriggerSchema = z.strictObject({
  date: isoInstantSchema,
  proofRef: opaqueIdSchema.nullable(),
});

export const deadlineProposalSchema = z.strictObject({
  deadlineRef: opaqueIdSchema,
  jurisdiction: z.string().length(2),
  ruleRef: opaqueIdSchema,
  trigger: deadlineTriggerSchema,
  previousTriggerHash: opaqueIdSchema.nullable(),
});

export function proposeDeadline(input: unknown): {
  readonly deadlineRef: string;
  readonly state: "collecting_facts" | "prepared";
  readonly calendarEntry: null | { readonly ruleRef: string; readonly basedOn: string };
  readonly revisionRequired: boolean;
} {
  const parsed = deadlineProposalSchema.parse(input);
  const proven = parsed.trigger.proofRef !== null;
  return {
    deadlineRef: parsed.deadlineRef,
    state: proven ? "prepared" : "collecting_facts",
    calendarEntry: proven ? { ruleRef: parsed.ruleRef, basedOn: parsed.trigger.date } : null,
    revisionRequired: parsed.previousTriggerHash !== null,
  };
}

/**
 * C29 — Renewal and changes.
 * A voice request is a proposal. It never binds, cancels or re-prices coverage.
 */
export function proposeRenewal(input: unknown): {
  readonly renewalRef: string;
  readonly state: "needs_review";
  readonly effect: "none";
  readonly requiresAuthorizedOperator: true;
} {
  const parsed = z
    .strictObject({
      renewalRef: opaqueIdSchema,
      policyRef: opaqueIdSchema,
      requestedChannel: z.enum(["voice", "ui", "api"]),
      changes: z.array(z.string().min(1).max(120)).max(20),
    })
    .parse(input);
  return {
    renewalRef: parsed.renewalRef,
    state: "needs_review",
    effect: "none",
    requiresAuthorizedOperator: true,
  };
}

/**
 * C30 — Complaint and appeal.
 * Legal risk escalates to a competent professional and evidence is preserved.
 */
export function prepareDispute(input: unknown): {
  readonly disputeRef: string;
  readonly state: "prepared" | "needs_professional_review";
  readonly escalated: boolean;
  readonly evidenceRefs: readonly string[];
} {
  const parsed = z
    .strictObject({
      disputeRef: opaqueIdSchema,
      facts: z.array(z.string().min(1).max(500)).max(50),
      evidenceRefs: z.array(opaqueIdSchema).max(50),
      legalRisk: z.enum(["low", "medium", "high"]),
    })
    .parse(input);
  const escalated = parsed.legalRisk === "high";
  return {
    disputeRef: parsed.disputeRef,
    state: escalated ? "needs_professional_review" : "prepared",
    escalated,
    evidenceRefs: parsed.evidenceRefs,
  };
}

/**
 * C31 — AI agent risk.
 * A cyber incident does not prove an exclusion and does not prove coverage. It
 * stays `unknown` until the policy is reviewed.
 */
export function assessAgentRiskIncident(input: unknown): {
  readonly incidentRef: string;
  readonly coverage: "unknown" | "requires_policy_review";
  readonly excluded: false;
  readonly covered: false;
} {
  const parsed = z
    .strictObject({
      incidentRef: opaqueIdSchema,
      modelDependency: z.string().min(2).max(160),
      policyRef: opaqueIdSchema.nullable(),
      controlEvidenceRefs: z.array(opaqueIdSchema).max(20),
    })
    .parse(input);
  return {
    incidentRef: parsed.incidentRef,
    coverage: parsed.policyRef === null ? "unknown" : "requires_policy_review",
    excluded: false,
    covered: false,
  };
}

/**
 * C32 — Sector privacy and retention.
 * Exports are scoped to one insured; restore reapplies suppressions instead of
 * resurrecting deleted or restricted data.
 */
export const privacyRecordSchema = z.strictObject({
  recordRef: opaqueIdSchema,
  subjectRef: opaqueIdSchema,
  sensitiveClass: z.enum(["none", "personal", "health", "financial"]),
  suppressed: z.boolean(),
});

export function planPrivacyExport(input: unknown, subjectRef: string): {
  readonly included: readonly string[];
  readonly excluded: readonly string[];
} {
  const records = z.array(privacyRecordSchema).parse(input);
  const included: string[] = [];
  const excluded: string[] = [];
  for (const record of records) {
    if (record.subjectRef === subjectRef && !record.suppressed) {
      included.push(record.recordRef);
    } else {
      excluded.push(record.recordRef);
    }
  }
  return { included, excluded };
}

export function planRestore(input: unknown, suppressedRefs: readonly string[]): {
  readonly restored: readonly string[];
  readonly stillSuppressed: readonly string[];
} {
  const records = z.array(privacyRecordSchema).parse(input);
  const suppressed = new Set(suppressedRefs);
  const restored: string[] = [];
  const stillSuppressed: string[] = [];
  for (const record of records) {
    if (record.suppressed || suppressed.has(record.recordRef)) {
      stillSuppressed.push(record.recordRef);
    } else {
      restored.push(record.recordRef);
    }
  }
  return { restored, stillSuppressed };
}

/**
 * C33 — Reports and snapshots.
 * Numbers come from sources with observation times. Data observed after the
 * cutoff forces a new revision; a report is never silently accepted.
 */
export function buildReportSnapshot(input: unknown): {
  readonly reportRef: string;
  readonly state: "accepted" | "needs_revision";
  readonly lateFacts: readonly string[];
  readonly inventedValues: readonly string[];
} {
  const parsed = z
    .strictObject({
      reportRef: opaqueIdSchema,
      cutoff: isoInstantSchema,
      facts: z.array(
        z.strictObject({
          factRef: opaqueIdSchema,
          observedAt: isoInstantSchema,
          valueRef: opaqueIdSchema.nullable(),
        }),
      ),
    })
    .parse(input);
  const cutoff = Date.parse(parsed.cutoff);
  const lateFacts = parsed.facts
    .filter((fact) => Date.parse(fact.observedAt) > cutoff)
    .map((fact) => fact.factRef);
  const inventedValues = parsed.facts.filter((fact) => fact.valueRef === null).map((fact) => fact.factRef);
  return {
    reportRef: parsed.reportRef,
    state: lateFacts.length > 0 || inventedValues.length > 0 ? "needs_revision" : "accepted",
    lateFacts,
    inventedValues,
  };
}
