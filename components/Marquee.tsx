import { marquee } from "@/lib/content";

// Slow editorial ribbon between the hero and the content. Two identical
// tracks + translateX(-50%) loop seamlessly; reduced motion freezes it via
// the global animation kill-switch.
export default function Marquee() {
  return (
    <div className="overflow-hidden border-y border-hairline py-4 sm:py-5">
      <div className="flex w-max animate-[marquee_40s_linear_infinite]">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
            {marquee.map((item) => (
              <li
                key={item}
                className="flex items-center whitespace-nowrap font-mono text-xs uppercase tracking-[0.2em] text-ink-muted"
              >
                {item}
                <span aria-hidden className="mx-8 text-blue">
                  ✦
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
