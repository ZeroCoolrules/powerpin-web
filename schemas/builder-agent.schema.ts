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

export type BuilderCapability =
  | "ui.generate"
  | "api.generate"
  | "db.read"
  | "db.write"
  | "file.read"
  | "file.write"
  | "execute.sandbox"
  | "execute.edge";

export type BuilderTrustTier =
  | "sandbox"
  | "restricted"
  | "approved"
  | "system";

export interface BuilderAgentBlueprint {
  id: string; // UUID
  name: string;
  description: string;

  trustTier: BuilderTrustTier;

  capabilities: BuilderCapability[];

  runtime: {
    environment: "sandbox" | "edge";
    maxExecutionMs: number;
    networkAccess: boolean;
    filesystemAccess: boolean;
  };

  constraints: {
    allowedPaths?: string[];
    deniedPaths?: string[];
    maxFileWrites?: number;
  };

  provenance: {
    createdBy: string; // user_id
    createdAt: string; // ISO
    sourceArtifactId?: string;
  };

  audit: {
    requiresApproval: boolean;
    approvalId?: string;
    hash: string;
  };
}
