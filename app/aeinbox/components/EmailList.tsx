"use client"

import EmailRow from "./EmailRow"

type Props = {
  emails: any[]
  onSelect: (email: any) => void
}

export default function EmailList({ emails, onSelect }: Props) {
  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-semibold mb-4">Inbox</h2>

      <div className="space-y-2">
        {emails.map((email) => (
          <EmailRow
            key={email.id}
            email={email}
            onClick={() => onSelect(email)}
          />
        ))}
      </div>
    </div>
  )
}
