/**
 * © 2026 Aaron Schenk
 *
 * Immutable artifact schema for governed storage and execution.
 * Part of a capability-bound autonomous agent governance system.
 */

export type ArtifactType =
  | "builder-agent"
  | "agent-blueprint"
  | "schema"
  | "tool"
  | "runtime-module";

export type ArtifactAuditStatus =
  | "unverified"
  | "verified"
  | "flagged";

export interface ArtifactFile {
  path: string;
  hash: string; // SHA-256
  sizeBytes: number;
}

export interface StoreArtifact {
  id: string; // UUID
  type: ArtifactType;

  name: string;
  description?: string;
  version: string;

  files: ArtifactFile[];

  manifest: Record<string, any>;

  hash: string; // hash of full artifact (manifest + files)

  auditStatus: ArtifactAuditStatus;

  createdBy: string; // user_id
  createdAt: string; // ISO timestamp

  requiresApproval: boolean;
}

