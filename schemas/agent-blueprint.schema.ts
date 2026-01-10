/**
 * © 2026 Aaron Schenk
 *
 * This file is part of a capability-bound autonomous agent governance system.
 * Use, reproduction, or distribution without authorization is prohibited.
 *
 * Associated with a provisional patent application covering:
 * - Capability-bound agent schemas
 * - Trust-tier enforcement
 * - Approval-gated execution
 * - Immutable artifact storage
 */

// /schemas/agent-blueprint.schema.ts

export type TrustClass =
  | "public"
  | "restricted"
  | "verified"
  | "governed"
  | "core";

export interface AgentBlueprint {
  id: string;                 // deterministic slug
  name: string;
  version: string;

  description: string;
  owner: string;              // builder identity (wallet / user_id)

  trust_class: TrustClass;
  approval_required: boolean;

  capabilities: string[];     // declarative, not code
  allowed_tools: string[];

  data_access: {
    reads: string[];
    writes: string[];
  };

  risk_profile: {
    level: "low" | "medium" | "high";
    notes?: string;
  };

  lifecycle: {
    expires?: string;
    renewable: boolean;
  };
}
