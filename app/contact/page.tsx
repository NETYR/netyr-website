import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { contactConfig, isAppsScriptContactFormUrl } from "@/data/contact";
import { socialLinks } from "@/data/social-links";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Contact the North East Texas Young Republicans about membership, events, volunteering, sponsorship, media, and other questions.",
  path: "/contact/",
});

export default function ContactPage() {
  const hasEmbeddedForm = isAppsScriptContactFormUrl(
    contactConfig.contactFormEmbedUrl,
  );

  return (
    <>
      <Hero
        compact
        description="Have a question, want to attend an upcoming event, or interested in getting involved? Send us a message and a member of our team will follow up."
        eyebrow="Contact"
        title="Connect with NETYR"
      />
      <Section
        description="We welcome questions about membership, events, volunteering, sponsorship, media, and chapter activities."
        eyebrow="Reach out"
        title="We would be glad to hear from you"
        tone="white"
      >
        <Card className="max-w-3xl">
          <h3 className="text-brand-navy text-xl font-bold uppercase">
            Email NETYR
          </h3>
          <p className="mt-3 leading-7 text-slate-600">
            Send a message to{" "}
            <a
              className="text-brand-blue font-bold underline underline-offset-4"
              data-analytics-context="contact_page"
              data-analytics-event="contact_email_click"
              data-analytics-label="president@netyr.org"
              href={`mailto:${contactConfig.publicEmail}`}
            >
              {contactConfig.publicEmail}
            </a>
            .
          </p>
          <Button
            className="mt-5"
            data-analytics-context="contact_page"
            data-analytics-event="contact_email_click"
            data-analytics-label="compose_email"
            href={`mailto:${contactConfig.publicEmail}`}
            variant="secondary"
          >
            Compose an email
          </Button>
        </Card>
      </Section>
      <Section
        description="Keep up with chapter news, events, and opportunities to get involved."
        eyebrow="Social"
        title="Follow NETYR"
      >
        <Card className="max-w-3xl">
          <SocialLinks links={socialLinks} />
        </Card>
      </Section>
      {hasEmbeddedForm ? (
        <Section
          description="Complete the secure form below and the NETYR team will follow up."
          eyebrow="Message us"
          title="Send a message"
        >
          <div className="mx-auto max-w-4xl overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm">
            <ContactFormEmbed src={contactConfig.contactFormEmbedUrl} />
          </div>
          <a
            aria-label="Open the contact form in a new window (opens in a new tab)"
            className="text-brand-blue focus-visible:outline-brand-blue mx-auto mt-5 flex min-h-11 w-fit items-center gap-2 rounded-sm font-bold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"
            href={contactConfig.contactFormEmbedUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Open the contact form in a new window
            <svg
              aria-hidden="true"
              className="size-4"
              fill="none"
              viewBox="0 0 16 16"
            >
              <path
                d="M6 3h7v7M13 3 7.5 8.5M12 9v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          </a>
        </Section>
      ) : null}
    </>
  );
}
import { ContactFormEmbed } from "@/components/contact/contact-form-embed";
import { SocialLinks } from "@/components/social/social-links";
