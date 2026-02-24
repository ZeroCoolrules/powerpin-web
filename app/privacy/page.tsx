export const metadata = {
  title: "Privacy Policy · ÆMail",
}

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 900, margin: "auto", padding: "60px 20px" }}>
      <h1>ÆMail Privacy Policy</h1>
      <p><strong>Last Updated:</strong> January 2, 2026</p>

      <p>
        ÆMail is a privacy-first email service with an optional AI assistant.
        We do not sell data, run ads, or track users across the web.
      </p>

      <h2>Information We Collect</h2>
      <ul>
        <li>Account information (email address, login credentials)</li>
        <li>Subscription and billing data (processed by Stripe)</li>
        <li>Basic technical logs for security and reliability</li>
      </ul>

      <h2>Email Content & AI</h2>
      <p>
        Email content is stored only to provide the service.
        AI features analyze content <strong>only when you request it</strong>
        and are not used for training.
      </p>

      <h2>Data Sharing</h2>
      <p>
        We share data only with infrastructure providers required to operate
        the service and with payment processors. We do not sell or rent data.
      </p>

      <h2>Your Rights</h2>
      <p>
        You may request access, correction, or deletion of your data at any time.
      </p>

      <h2>Contact</h2>
      <p>
        Email: endless1@aeinbox.com<br />
        Owner: Archway Power, LLC
      </p>
    </main>
  )
}
