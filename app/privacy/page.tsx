import type { Metadata } from "next";

import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Privacy",
  description:
    "Learn how the NETYR website handles analytics, contact inquiries, event information, and external payment links.",
  path: "/privacy/",
});

export default function PrivacyPage() {
  return (
    <>
      <Hero
        compact
        description="A straightforward overview of information handled by this website and the services it uses."
        eyebrow="Privacy"
        title="How website information is handled"
      />
      <Section
        description="NETYR limits website data collection to what supports site operation, basic audience measurement, and visitor-requested services."
        eyebrow="Website activity"
        title="Analytics and technical information"
        tone="white"
      >
        <div className="max-w-3xl space-y-5 text-base leading-7 text-slate-700">
          <p>
            The website uses Google Analytics to understand general activity
            such as page views, device and browser categories, approximate
            location, and interactions with important links. Google Analytics
            may use cookies or similar technologies. NETYR does not send names,
            email addresses, phone numbers, contact messages, or payment
            information to analytics.
          </p>
          <p>
            GitHub Pages and related network providers may process standard
            technical logs needed to deliver and protect the website. NETYR does
            not receive a visitor-level copy of those hosting logs through the
            website repository.
          </p>
        </div>
      </Section>
      <Section
        description="Information is shared with an external service only when a visitor chooses to use that service."
        eyebrow="Visitor choices"
        title="Contact, events, and payments"
      >
        <div className="max-w-3xl space-y-5 text-base leading-7 text-slate-700">
          <p>
            Contact inquiries are submitted through a NETYR-managed Google Apps
            Script form and recorded in a restricted Google Sheet. NETYR
            receives the information a visitor voluntarily submits so the
            organization can respond.
          </p>
          <p>
            Public event information is supplied from a NETYR-managed Google
            Calendar. Community Partner recognition is supplied from a
            restricted NETYR workbook after server-side filtering; the public
            feed contains only a display name and recognition category.
          </p>
          <p>
            Membership dues and other approved payments are completed through
            Cheddar Up. The NETYR website does not directly collect, store, or
            process card information. Google and Cheddar Up handle information
            under their own terms and privacy practices.
          </p>
          <p>
            Questions about this page may be submitted through the{" "}
            <a
              className="text-brand-blue font-semibold underline decoration-2 underline-offset-4"
              href="/contact/#contact-form"
            >
              NETYR contact form
            </a>
            .
          </p>
        </div>
      </Section>
    </>
  );
}
