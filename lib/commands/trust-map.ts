export const TRUST_COMMAND_MAP = {
  observer: ["list_artifacts"],
  user: ["list_artifacts"],
  builder: ["list_artifacts", "propose_agent"],
  admin: ["list_artifacts", "propose_agent", "run_builder"]
}
