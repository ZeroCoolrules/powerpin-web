import { GatewayCommand } from "./types"

export const COMMANDS: GatewayCommand[] = [
  {
    name: "list_artifacts",
    description: "View available artifacts",
    scope: "read",
    requiresApproval: false,
    sandboxed: false
  },
  {
    name: "propose_agent",
    description: "Submit a new agent proposal",
    scope: "write",
    requiresApproval: true,
    sandboxed: true
  },
  {
    name: "run_builder",
    description: "Execute builder in sandbox",
    scope: "execute",
    requiresApproval: true,
    sandboxed: true
  }
]
