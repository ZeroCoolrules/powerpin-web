export const metadata = {
  title: "Security & Responsible Disclosure · ÆMail",
}

export default function SecurityPage() {
  return (
    <main style={{ maxWidth: 900, margin: "auto", padding: "60px 20px" }}>
      <h1>Responsible Disclosure</h1>

      <p>
        ÆMail values the security of our users and systems.
        If you discover a security vulnerability, please report it responsibly.
      </p>

      <h2>Security Reporting</h2>
      <p>
        Email: <strong>endless1@inboxae.com</strong>
      </p>

      <h2>Please Include:</h2>
      <ul>
        <li>-Description of the issue</li>
        <li>-Steps to reproduce</li>
        <li>-Potential impact</li>
      </ul>

      <p>
        We appreciate responsible disclosure and will not pursue legal action
        against good-faith security research.
      </p>
    </main>
  )
}
