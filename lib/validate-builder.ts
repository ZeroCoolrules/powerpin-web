import crypto from "crypto";
import { BuilderAgentBlueprint } from "@/schemas/builder-agent.schema";

export function validateBuilderAgent(
  agent: BuilderAgentBlueprint
): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];

  if (!agent.id) errors.push("Missing id");
  if (!agent.name) errors.push("Missing name");
  if (!agent.trustTier) errors.push("Missing trustTier");

  if (agent.runtime.maxExecutionMs > 10000) {
    errors.push("Execution time exceeds limit");
  }

  if (
    agent.trustTier === "sandbox" &&
    agent.capabilities.includes("execute.edge")
  ) {
    errors.push("Sandbox tier cannot execute");
  }

  return {
    valid: errors.length === 0,
    errors: errors.length ? errors : undefined,
  };
}

export function hashBuilder(agent: BuilderAgentBlueprint): string {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(agent))
    .digest("hex");
}
