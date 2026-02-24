export const metadata = {
  title: "Privacy Policy · ÆMail",
  description: "Privacy Policy for ÆMail secure email platform.",
}

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 900, margin: "auto", padding: "60px 20px" }}>
      <h1>ÆMail Privacy Policy</h1>
      <p><strong>Last Updated:</strong> January 2, 2026</p>

      <p>
        ÆMail is a privacy-first email service with optional AI assistance.
        We do not sell user data, run behavioral advertising, or track users across the web.
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li>Account information (email address and authentication credentials)</li>
        <li>Subscription and billing data (processed securely by Stripe)</li>
        <li>Technical logs necessary for security, fraud prevention, and reliability</li>
      </ul>

      <h2>2. Email Content & AI Processing</h2>
      <p>
        Email content is stored solely to provide the core email service.
        AI features analyze content only when explicitly requested by the user.
        AI interactions are not used to train public models.
      </p>

      <h2>3. Data Sharing</h2>
      <p>
        We share information only with infrastructure providers required to operate
        the service (such as hosting and payment processing providers).
        We do not sell, rent, or trade personal data.
      </p>

      <h2>4. Data Retention</h2>
      <p>
        Account data is retained while your account remains active.
        You may request deletion of your account and associated data at any time.
      </p>

      <h2>5. Your Rights</h2>
      <p>
        You may request access, correction, export, or deletion of your data
        by contacting us directly.
      </p>

      <h2>6. Security</h2>
      <p>
        We use industry-standard encryption in transit (TLS) and implement
        access controls to protect user information.
      </p>

      <h2>7. Contact</h2>
      <p>
        Email: endless1@aeinbox.com<br />
        Owner: Archway Power, LLC
      </p>
    </main>
  )
}