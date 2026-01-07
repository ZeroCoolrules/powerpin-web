import { TRUST_COMMAND_MAP } from "./trust-map"

export function getCommandsForTrust(trustClass: string) {
  return TRUST_COMMAND_MAP[trustClass] ?? []
}
