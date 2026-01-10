import GatewayAgent from "@/app/components/GatewayAgent"

export default function GatewayPage({
  params
}: {
  params: { artifact_id: string }
}) {
  return (
    <div>
      <h1>Gateway</h1>
      <GatewayAgent artifactId={params.artifact_id} />
    </div>
  )
}
