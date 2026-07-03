"use client";

import { useEffect, useState } from "react";
import { contact, nav } from "@/lib/content";

const LOGO = "m.alsayed";

function TypingLogo() {
  const [text, setText] = useState(LOGO);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let i = LOGO.length;
    let deleting = true;
    let timer = 0;

    const step = () => {
      i += deleting ? -1 : 1;
      setText(LOGO.slice(0, i));
      if (deleting && i === 0) {
        deleting = false;
        timer = window.setTimeout(step, 800); // pause empty
      } else if (!deleting && i === LOGO.length) {
        deleting = true;
        timer = window.setTimeout(step, 3200); // linger on the full name
      } else {
        timer = window.setTimeout(step, deleting ? 55 : 130);
      }
    };
    timer = window.setTimeout(step, 3200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <a
      href="#top"
      className="font-mono text-sm tracking-tight text-ink hover:text-blue transition-colors"
    >
      <span className="inline-block min-w-[10ch]">
        {text}
        <span className="animate-[blink_1.1s_steps(2)_infinite] text-blue">_</span>
      </span>
    </a>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-paper/80 backdrop-blur-md border-b border-hairline"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <TypingLogo />
        <ul className="hidden items-center gap-7 sm:flex">
          {nav.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-mono text-xs uppercase tracking-widest text-ink-muted transition-colors hover:text-blue"
              >
                {link.title}
              </a>
            </li>
          ))}
          <li>
            <a
              href={contact.cv.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-widest text-blue transition-opacity hover:opacity-70"
            >
              CV ↗
            </a>
          </li>
        </ul>
        <div className="flex items-center gap-6 sm:hidden">
          <a
            href={contact.cv.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs uppercase tracking-widest text-blue"
          >
            CV ↗
          </a>
          <a href="#contact" className="font-mono text-xs uppercase tracking-widest text-ink-muted">
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
}
