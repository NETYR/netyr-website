import type { Metadata } from "next";

import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { contactConfig, isAppsScriptContactFormUrl } from "@/data/contact";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "Learn how the North East Texas Young Republicans website handles information and external services.",
  path: "/privacy/",
});

export default function PrivacyPage() {
  const hasContactForm = isAppsScriptContactFormUrl(
    contactConfig.contactFormEmbedUrl,
  );

  return (
    <>
      <Hero
        compact
        description="This statement explains how information is handled when you visit the NETYR website or contact the organization."
        eyebrow="Privacy"
        title="A straightforward privacy statement"
      />
      <Section tone="white">
        <div className="max-w-3xl space-y-10">
          <PrivacySection title="Website use">
            <p>
              NETYR does not offer website accounts, use advertising trackers,
              or set organization-managed cookies. Website analytics are not
              currently in use.
            </p>
          </PrivacySection>
          <PrivacySection title="Website hosting">
            <p>
              The hosting provider may process ordinary technical request
              information needed to deliver and secure the site, such as IP
              address, requested URL, browser information, and timestamps. NETYR
              has not implemented separate website analytics.
            </p>
          </PrivacySection>
          <PrivacySection title="External links and Cheddar Up">
            <p>
              Membership and dues buttons open NETYR&apos;s official Cheddar Up
              collection in a new browser tab. Cheddar Up processes registration
              and payment information under its own privacy practices; the NETYR
              website does not receive or store card details. Other external
              links are governed by the destination provider&apos;s privacy
              practices.
            </p>
          </PrivacySection>
          <PrivacySection title="Contact forms">
            {hasContactForm ? (
              <p>
                NETYR uses a custom contact form hosted through Google Apps
                Script on Google-controlled domains. Contact information
                voluntarily submitted through the form is stored in Google
                Sheets so NETYR can review and respond to the inquiry. Google
                may process technical information under its own terms.
              </p>
            ) : (
              <p>
                NETYR may enable a custom contact form hosted through Google
                Apps Script on Google-controlled domains. When enabled,
                information voluntarily submitted through the form will be
                stored in Google Sheets, and Google may process technical
                information under its own terms. Until then, visitors may
                contact NETYR by email.
              </p>
            )}
          </PrivacySection>
          <PrivacySection title="Questions">
            <p>
              Questions about this statement may be sent to{" "}
              <a
                className="text-brand-blue font-bold underline underline-offset-4"
                href={`mailto:${contactConfig.publicEmail}?subject=Website%20privacy%20question`}
              >
                {contactConfig.publicEmail}
              </a>
              . A formal retention schedule has not yet been adopted.
            </p>
          </PrivacySection>
        </div>
      </Section>
    </>
  );
}

function PrivacySection({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section>
      <h2 className="text-brand-navy text-2xl font-bold uppercase">{title}</h2>
      <div className="mt-3 leading-7 text-slate-600">{children}</div>
    </section>
  );
}
