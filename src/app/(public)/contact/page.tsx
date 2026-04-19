import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact — CyberSathi",
  description: "Get in touch with the CyberSathi team.",
}

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Contact</h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          We welcome corrections, tips, and partnership enquiries. The best way
          to reach us is by email:
        </p>

        <p>
          <strong>
            <a href="mailto:hello@cybersathi.in">hello@cybersathi.in</a>
          </strong>
        </p>

        <h2>Report a scam</h2>
        <p>
          If you have been targeted by a cyber-crime, please report it to the
          Indian government&apos;s official portal:{" "}
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
          >
            cybercrime.gov.in
          </a>{" "}
          or call the National Cyber Helpline:{" "}
          <strong>1930</strong>.
        </p>

        <h2>Media & partnerships</h2>
        <p>
          For media enquiries, sponsored content, or content partnerships please
          email{" "}
          <a href="mailto:partnerships@cybersathi.in">
            partnerships@cybersathi.in
          </a>
          .
        </p>
      </div>
    </div>
  )
}
