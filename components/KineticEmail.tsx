"use client";

import { useEffect, useRef } from "react";
import { kinetic } from "@/lib/kinetic";
import { fontsReady } from "@/lib/store";

/** The giant email line: fitted to the column width, its weight swells near the pointer */
export default function KineticEmail({ email }: { email: string }) {
  const lineRef = useRef<HTMLParagraphElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mailLine = lineRef.current,
      mailText = textRef.current;
    if (!mailLine || !mailText) return;
    let alive = true;
    const mailChars = Array.from(mailText.querySelectorAll<HTMLElement>(".ch"));
    function fitMail() {
      if (!mailLine || !mailText) return;
      mailChars.forEach((c) => c.style.setProperty("--g", "800"));
      mailLine.style.fontSize = "100px";
      const w = mailText.getBoundingClientRect().width || 1;
      mailLine.style.fontSize = Math.min((100 * mailLine.clientWidth * 0.98) / w, 150) + "px";
      mailChars.forEach((c) => c.style.removeProperty("--g"));
    }
    fontsReady().then(() => {
      if (alive) fitMail();
    });
    let rfit = 0;
    const onResize = () => {
      clearTimeout(rfit);
      rfit = window.setTimeout(fitMail, 150);
    };
    addEventListener("resize", onResize);
    const offKinetic = kinetic(mailChars, mailLine, { g0: 480, g1: 800, radius: 170 });
    return () => {
      alive = false;
      clearTimeout(rfit);
      removeEventListener("resize", onResize);
      offKinetic();
      mailLine.style.fontSize = "";
    };
  }, []);

  return (
    <p className="contact-mail" id="contact-mail" data-rise="" ref={lineRef}>
      <span className="mail-text" id="mail-text" ref={textRef}>
        {[...email].map((c, i) => (
          <span className="ch" aria-hidden="true" key={i}>
            {c}
          </span>
        ))}
        <span className="sr-only">{email}</span>
      </span>
    </p>
  );
}
