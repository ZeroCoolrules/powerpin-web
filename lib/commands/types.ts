export type CommandScope = "read" | "write" | "execute"

export type GatewayCommand = {
  name: string
  description: string
  scope: CommandScope
  requiresApproval: boolean
  sandboxed: boolean
}
