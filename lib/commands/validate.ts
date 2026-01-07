import { COMMANDS } from "./registry"

export function validateCommand(session, commandName: string) {
  if (!session.allowed_commands.includes(commandName)) {
    throw new Error("Command not permitted for this session")
  }

  const command = COMMANDS.find(c => c.name === commandName)
  if (!command) {
    throw new Error("Unknown command")
  }

  return command
}
