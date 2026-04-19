import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Use — CyberSathi",
  description: "Terms and conditions for using CyberSathi.in.",
}

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Terms of Use</h1>
      <p className="mb-8 text-sm text-muted-foreground">Last updated: April 2026</p>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h2>Acceptance</h2>
        <p>
          By accessing CyberSathi.in you agree to these terms. If you do not
          agree, please do not use the site.
        </p>

        <h2>Content</h2>
        <p>
          CyberSathi publishes educational content about cyber crime and online
          safety. Content is provided for informational purposes only and does
          not constitute legal, financial, or professional security advice.
          AI-assisted articles are clearly labelled and reviewed by human
          editors.
        </p>

        <h2>Third-party content</h2>
        <p>
          News summaries link to original sources. We do not claim ownership of
          third-party journalism. Video embeds are served from YouTube and
          subject to YouTube&apos;s terms of service.
        </p>

        <h2>Prohibited use</h2>
        <p>You must not use this site to:</p>
        <ul>
          <li>Scrape content for commercial redistribution without permission.</li>
          <li>Attempt to compromise the site&apos;s security or infrastructure.</li>
          <li>Post spam or unsolicited communications.</li>
        </ul>

        <h2>Disclaimer</h2>
        <p>
          CyberSathi is provided &quot;as is&quot;. We make no warranties regarding
          accuracy, completeness, or fitness for a particular purpose. We are
          not liable for any losses arising from reliance on the content.
        </p>

        <h2>Changes</h2>
        <p>
          We may update these terms at any time. Continued use of the site after
          changes constitutes acceptance.
        </p>

        <h2>Contact</h2>
        <p>
          Legal queries: <a href="mailto:hello@cybersathi.in">hello@cybersathi.in</a>
        </p>
      </div>
    </div>
  )
}
