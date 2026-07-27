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
  const hasAnalytics = Boolean(
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim(),
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
            {hasAnalytics ? (
              <p>
                NETYR uses Google Analytics to understand which public pages are
                visited and how visitors use important website links. This
                information helps the organization improve its website and
                public communications. NETYR does not use this website analytics
                setup for advertising.
              </p>
            ) : (
              <p>
                NETYR does not offer website accounts or use advertising
                trackers. Website analytics are not active in this build.
              </p>
            )}
          </PrivacySection>
          <PrivacySection title="Website hosting">
            <p>
              The hosting provider may process ordinary technical request
              information needed to deliver and secure the site, such as IP
              address, requested URL, browser information, and timestamps. NETYR
              may also process ordinary website interactions through Google
              Analytics when analytics is active.
            </p>
          </PrivacySection>
          {hasAnalytics ? (
            <PrivacySection title="Analytics information">
              <p>
                Google Analytics may receive the page viewed, approximate
                location, device and browser information, referring page, and
                interactions such as clicks on membership, event, contact,
                sponsor, news, and social links. Google Analytics may use
                first-party cookies or similar browser storage. Advertising
                storage, advertising personalization, and Google advertising
                signals are disabled in this site&apos;s configuration.
              </p>
              <p className="mt-3">
                Names, email addresses, phone numbers, contact messages, and
                other contact-form field values are not sent to Google
                Analytics.
              </p>
            </PrivacySection>
          ) : null}
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
                may process technical information under its own terms. Contact
                form contents are handled separately from website analytics.
              </p>
            ) : (
              <p>
                NETYR may enable a custom contact form hosted through Google
                Apps Script on Google-controlled domains. When enabled,
                information voluntarily submitted through the form will be
                stored in Google Sheets, and Google may process technical
                information under its own terms. Contact form contents are not
                sent to website analytics. Until then, visitors may contact
                NETYR by email.
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
