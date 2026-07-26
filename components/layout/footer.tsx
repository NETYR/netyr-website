import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <Container className="py-8">
        <p className="text-sm text-slate-600">
          © {new Date().getFullYear()} {siteConfig.name}. Content placeholder.
        </p>
      </Container>
    </footer>
  );
}
