import Link from "next/link";
import Background from "@/components/Scene/Background";

export default function NotFound() {
  return (
    <>
      <Background />
      <main className="relative flex min-h-svh flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-sm uppercase tracking-widest text-ink-muted">
          404 — page not found
        </p>
        <h1 className="text-display mt-6 text-[clamp(3.2rem,11vw,9rem)] text-ink">
          Lost the <span className="normal-case italic text-blue">plot.</span>
        </h1>
        <p className="mt-8 max-w-md text-lg text-ink-muted">
          This page doesn&apos;t exist — maybe it never did.
        </p>
        <Link
          href="/"
          className="mt-10 rounded-full bg-blue px-8 py-4 font-mono text-sm text-paper transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-bright hover:shadow-[0_12px_28px_-10px_rgba(37,99,235,0.6)]"
        >
          ← Back home
        </Link>
      </main>
    </>
  );
}
