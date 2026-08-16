"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { contact, nav } from "@/lib/content";
import { scrollControl } from "./SmoothScroll";
import ThemeToggle from "./ui/ThemeToggle";

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

const menuLine = {
  hidden: { y: "110%" },
  show: (i: number) => ({
    y: "0%",
    transition: { duration: 0.7, delay: 0.25 + i * 0.07, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

function MobileMenu({ open, close }: { open: boolean; close: () => void }) {
  useEffect(() => {
    if (!open) return;
    scrollControl.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      scrollControl.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const onLinkClick = () => {
    // Resume scrolling before the anchor navigation kicks in
    scrollControl.start();
    close();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-90 flex flex-col bg-blue px-6 py-6"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-between">
            <p className="font-mono text-sm uppercase tracking-widest text-cream/70">Menu</p>
            <button
              onClick={close}
              aria-label="Close menu"
              className="flex h-11 w-11 items-center justify-center font-mono text-2xl text-cream"
            >
              ×
            </button>
          </div>

          <motion.nav
            className="flex flex-1 flex-col justify-center gap-2"
            initial="hidden"
            animate="show"
            exit="hidden"
          >
            {nav.links.map((link, i) => (
              <div key={link.href} className="overflow-hidden">
                <motion.a
                  variants={menuLine}
                  custom={i}
                  href={link.href}
                  onClick={onLinkClick}
                  className="text-display flex items-baseline gap-4 py-1 text-5xl text-cream active:text-cream/70"
                >
                  <span className="font-mono text-sm font-normal text-cream/60">
                    0{i + 1}
                  </span>
                  {link.title}
                </motion.a>
              </div>
            ))}
          </motion.nav>

          <motion.div
            className="flex items-center justify-between border-t border-cream/20 pt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.65, duration: 0.5 } }}
            exit={{ opacity: 0 }}
          >
            <a
              href={contact.cv.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-widest text-cream"
            >
              CV ↗
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="font-mono text-xs uppercase tracking-widest text-cream"
            >
              Email ↗
            </a>
            {contact.socials.map((social) => (
              <a
                key={social.url}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase tracking-widest text-cream"
              >
                {social.title} ↗
              </a>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-paper/80 backdrop-blur-md border-b border-hairline"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <TypingLogo />
          <div className="flex items-center gap-2 sm:gap-5">
            <ul className="hidden items-center gap-7 sm:flex">
              {nav.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="link-draw pb-0.5 font-mono text-xs uppercase tracking-widest text-ink-muted transition-colors hover:text-blue"
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
                  className="link-draw pb-0.5 font-mono text-xs uppercase tracking-widest text-blue"
                >
                  CV ↗
                </a>
              </li>
            </ul>
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="group flex h-11 w-11 flex-col items-end justify-center gap-1.5 sm:hidden"
            >
              <span className="block h-px w-6 bg-ink transition-all duration-300 group-active:w-4" />
              <span className="block h-px w-4 bg-ink transition-all duration-300 group-active:w-6" />
            </button>
          </div>
        </nav>
      </header>
      <MobileMenu open={menuOpen} close={() => setMenuOpen(false)} />
    </>
  );
}
