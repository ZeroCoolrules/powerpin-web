export type TrustClass = "observer" | "user" | "builder" | "admin"

export type CommandSpec = {
  name: string
  description: string
}

const COMMANDS: Record<TrustClass, CommandSpec[]> = {
  observer: [
    { name: "help", description: "List available commands" },
    { name: "status", description: "Check gateway status" }
  ],

  user: [
    { name: "help", description: "List available commands" },
    { name: "status", description: "Check gateway status" },
    { name: "inspect", description: "Inspect artifact metadata" }
  ],

  builder: [
    { name: "help", description: "List available commands" },
    { name: "status", description: "Check gateway status" },
    { name: "inspect", description: "Inspect artifact metadata" },
    { name: "deploy", description: "Deploy artifact build" }
  ],

  admin: [
    { name: "*", description: "All commands" }
  ]
}

export function getCommandsForTrust(trust: TrustClass): CommandSpec[] {
  return COMMANDS[trust] ?? []
}

export function isCommandAllowed(
  trust: TrustClass,
  command: string
): boolean {
  if (trust === "admin") return true
  return COMMANDS[trust]?.some(c => c.name === command) ?? false
}
