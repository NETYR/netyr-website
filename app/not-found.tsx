import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFoundPage() {
  return (
    <section className="bg-brand-navy flex min-h-[65vh] items-center py-20 text-white">
      <Container className="text-center">
        <p className="text-sm font-bold tracking-[0.2em] text-blue-300 uppercase">
          Error 404
        </p>
        <h1 className="mt-4 text-5xl font-black uppercase sm:text-7xl">
          Page not found
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-300">
          The requested page may have moved, or the address may be incomplete.
        </p>
        <Button className="mt-8" href="/">
          Return home
        </Button>
      </Container>
    </section>
  );
}
