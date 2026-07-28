import type { Metadata } from "next";

import { ContactFormEmbed } from "@/components/contact/contact-form-embed";
import { EmptyState } from "@/components/ui/empty-state";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { contactConfig, isAppsScriptContactFormUrl } from "@/data/contact";
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
          description={`Email ${contactConfig.publicEmail} while the contact form is being refreshed.`}
          eyebrow="Contact"
          title="The contact form is temporarily unavailable"
          tone="white"
        >
          <EmptyState
            description={`Send your inquiry to ${contactConfig.publicEmail}, and a member of the NETYR team will follow up.`}
            title="Contact NETYR by email"
          />
        </Section>
      )}
      <Section
        description="Prefer email? Use the public organization address for membership, event, sponsorship, media, or general questions."
        eyebrow="Email"
        title="Another way to reach NETYR"
      >
        <a
          className="text-brand-blue focus-visible:outline-brand-blue inline-flex min-h-11 items-center rounded-sm font-semibold underline decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"
          href={`mailto:${contactConfig.publicEmail}`}
        >
          {contactConfig.publicEmail}
        </a>
      </Section>
    </>
  );
}
