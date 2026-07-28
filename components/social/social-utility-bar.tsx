import { SocialLinks } from "@/components/social/social-links";
import { Container } from "@/components/ui/container";
import { socialLinks } from "@/data/social-links";

export function SocialUtilityBar() {
  if (socialLinks.length === 0) return null;

  return (
    <div className="border-b border-slate-200 bg-slate-50">
      <Container className="flex min-h-11 items-center justify-center gap-2 sm:justify-end">
        <span className="text-brand-navy text-xs font-bold tracking-[0.12em] uppercase">
          Follow NETYR
        </span>
        <SocialLinks iconOnly links={socialLinks} />
      </Container>
    </div>
  );
}
