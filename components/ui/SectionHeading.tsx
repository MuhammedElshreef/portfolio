import Reveal from "./Reveal";

export default function SectionHeading({ index, title }: { index: string; title: string }) {
  return (
    <Reveal className="mb-12 flex items-baseline gap-4">
      <span className="font-mono text-sm text-blue">{index}</span>
      <h2 className="text-display text-5xl text-ink sm:text-7xl">{title}</h2>
      <span className="mt-auto hidden h-px flex-1 bg-hairline sm:block" />
    </Reveal>
  );
}
