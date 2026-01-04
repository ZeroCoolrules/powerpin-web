'use client'

export default function MyClientView({ data }: { data: any }) {
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
