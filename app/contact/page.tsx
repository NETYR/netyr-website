import type { Metadata } from "next";

import { ContactFormEmbed } from "@/components/contact/contact-form-embed";
import { EmptyState } from "@/components/ui/empty-state";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { contactConfig, isAppsScriptContactFormUrl } from "@/data/contact";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Contact NETYR | North East Texas Young Republicans",
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
      {hasEmbeddedForm ? (
        <Section
          className="scroll-mt-28 py-10 sm:py-12 lg:py-16"
          id="contact-form"
          tone="white"
        >
          <div className="mx-auto max-w-4xl overflow-hidden rounded-sm border border-slate-200 bg-white shadow-[0_12px_36px_-24px_rgba(7,26,51,0.35)]">
            <ContactFormEmbed src={contactConfig.contactFormEmbedUrl} />
          </div>
        </Section>
      ) : (
        <Section
          description="Please check back shortly. The contact form is being restored."
          eyebrow="Contact form"
          title="The contact form is temporarily unavailable"
          tone="white"
        >
          <EmptyState
            description="The NETYR team is working to restore this connection."
            title="Please try again soon"
          />
        </Section>
      )}
    </>
  );
}
