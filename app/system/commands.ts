export type TrustClass = "observer" | "user" | "builder" | "admin"

export type CommandSpec = {
  name: string
  description: string
}

const COMMANDS: Record<TrustClass, CommandSpec[]> = {
  observer: [
    { name: "help", description: "List available commands" },
    { name: "status", description: "Check gateway status" },
    { name: "commands", description: "Alias for help" },
    { name: "whoami", description: "Show your identity and trust level" },
    { name: "exit", description: "Close gateway session" }
  ],

  user: [
    { name: "help", description: "List available commands" },
    { name: "status", description: "Check gateway status" },
    { name: "commands", description: "Alias for help" },
    { name: "inspect", description: "Inspect artifact metadata" },
    { name: "whoami", description: "Show your identity and trust level" },
    { name: "exit", description: "Close gateway session" }
  ],

  builder: [
    { name: "help", description: "List available commands" },
    { name: "status", description: "Check gateway status" },
    { name: "commands", description: "Alias for help" },
    { name: "inspect", description: "Inspect artifact metadata" },
    { name: "deploy", description: "Deploy artifact build" },
    { name: "whoami", description: "Show your identity and trust level" },
    { name: "exit", description: "Close gateway session" }
  ],

  admin: [
    { name: "help", description: "List available commands" },
    { name: "status", description: "Check gateway status" },
    { name: "commands", description: "Alias for help" },
    { name: "inspect", description: "Inspect artifact metadata" },
    { name: "deploy", description: "Deploy artifact build" },
    { name: "whoami", description: "Show your identity and trust level" },
    { name: "exit", description: "Close gateway session" }
  ]
}

export function getCommandsForTrust(trust: TrustClass): CommandSpec[] {
  return COMMANDS[trust] ?? []
}

export function isCommandAllowed(
  trust: TrustClass,
  command: string
): boolean {
  const normalized = command.trim().toLowerCase()
  return COMMANDS[trust]?.some(c => c.name === normalized) ?? false
}
