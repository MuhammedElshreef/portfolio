export default function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-hairline px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-ink-muted transition-colors duration-300 group-hover:border-blue/40">
      {children}
    </span>
  );
}
