export async function runAI(mode: string, content: string) {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode, content }),
  })
  return res.json()
}