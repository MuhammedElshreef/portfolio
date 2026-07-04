"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Tripoli",
});

// Renders only after mount — the server can't know the visitor-facing minute.
export default function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTime(formatter.format(new Date()));
    update();
    const id = setInterval(update, 10_000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;
  return (
    <p className="mt-6 font-mono text-xs uppercase tracking-widest text-ink-muted">
      — It&apos;s {time} for me in Tripoli right now
    </p>
  );
}
