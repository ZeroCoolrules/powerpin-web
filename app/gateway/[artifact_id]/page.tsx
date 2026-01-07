import GatewayAgent from '@/app/components/GatewayAgent'
import { createClient } from '@supabase/supabase-js'

export default async function GatewayPage({
  params
}: {
  params: { artifact_id: string }
}) {
  const artifactId = params.artifact_id

  // TEMP: hardcode session id to prove wiring
  // (we will replace this with /api/gateway/session next)
  const gatewaySessionId = 'TEST_SESSION_ID'

  return (
    <div>
      <h1>Gateway</h1>

      <GatewayAgent
        artifactId={artifactId}
        gatewaySessionId={gatewaySessionId}
      />
    </div>
  )
}
