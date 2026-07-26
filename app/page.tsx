import { Card } from "@/components/ui/card";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";

export default function HomePage() {
  return (
    <>
      <Hero
        description="Official website content is being prepared. Organization-approved copy and imagery will be added in a future phase."
        eyebrow="Website foundation"
        title="North East Texas Young Republicans"
      />
      <Section
        description="This area is reserved for approved organization content."
        title="Content coming soon"
      >
        <Card>
          <p className="text-pretty text-slate-600">
            Placeholder content only. No public-facing claims or program details
            have been added.
          </p>
        </Card>
      </Section>
    </>
  );
}
