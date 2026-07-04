"use client";

import { useEffect, useState } from "react";
import Magnetic from "./ui/Magnetic";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Magnetic className="fixed bottom-6 right-6 z-50" strength={0.35}>
      <a
        href="#top"
        aria-label="Scroll back to top"
        className={`flex h-12 w-12 items-center justify-center rounded-full border border-hairline bg-paper-raised font-mono text-lg text-ink shadow-lg transition-all duration-500 hover:border-blue hover:text-blue ${
          visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        ↑
      </a>
    </Magnetic>
  );
}
