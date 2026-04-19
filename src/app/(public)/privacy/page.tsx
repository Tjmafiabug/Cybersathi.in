import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy — CyberSathi",
  description: "How CyberSathi collects, uses, and protects your data.",
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mb-8 text-sm text-muted-foreground">Last updated: April 2026</p>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h2>What we collect</h2>
        <ul>
          <li>
            <strong>Newsletter subscribers</strong> — email address and
            subscription date. We use this only to send the weekly digest.
          </li>
          <li>
            <strong>Analytics</strong> — anonymised page-view data via Vercel
            Analytics. No cookies are set. No personal data is stored.
          </li>
          <li>
            <strong>Server logs</strong> — standard HTTP request logs retained
            for 30 days for security and debugging purposes.
          </li>
        </ul>

        <h2>What we never do</h2>
        <ul>
          <li>Sell or share your email with third parties.</li>
          <li>Track you across other websites.</li>
          <li>Display behavioural advertising.</li>
        </ul>

        <h2>Newsletter</h2>
        <p>
          Subscribing to the newsletter is entirely voluntary. You can
          unsubscribe at any time via the link in every email. We use{" "}
          <a href="https://resend.com" target="_blank" rel="noopener noreferrer">
            Resend
          </a>{" "}
          to deliver emails. Your email address is stored in our database and
          Resend&apos;s sending infrastructure.
        </p>

        <h2>Cookies</h2>
        <p>
          We set a single functional cookie to remember your dark/light mode
          preference. No tracking or advertising cookies are used.
        </p>

        <h2>Your rights</h2>
        <p>
          You can request deletion of your data at any time by emailing{" "}
          <a href="mailto:hello@cybersathi.in">hello@cybersathi.in</a>. We will
          action the request within 7 days.
        </p>

        <h2>Contact</h2>
        <p>
          Privacy questions: <a href="mailto:hello@cybersathi.in">hello@cybersathi.in</a>
        </p>
      </div>
    </div>
  )
}
