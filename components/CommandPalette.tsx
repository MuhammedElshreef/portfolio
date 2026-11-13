"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { store } from "@/lib/store";

export type PaletteLabels = {
  label: string;
  placeholder: string;
  empty: string;
  groups: { sections: string; projects: string; actions: string };
  sectionKind: string;
  hints: string[];
  copyEmail: string;
  copied: string;
  copyFailed: string;
  downloadCv: string;
  openGithub: string;
  openLinkedin: string;
  emailKind: string;
  cvKind: string;
  linkKind: string;
};

type Item = {
  key: string;
  group: string;
  title: string;
  kind: string;
  /** Links go where they point; section links are picked up by the page's smooth scrolling */
  href?: string;
  external?: boolean;
  run?: () => void;
};

const setBackdropInert = (on: boolean) => {
  document.querySelector<HTMLElement>("main")?.toggleAttribute("inert", on);
  document.getElementById("nav")?.toggleAttribute("inert", on);
};

/*
  The command palette: a search box that jumps to a section, opens a project, copies the
  email or opens the CV and GitHub. Opened by the header button (#palette-open) or
  Ctrl/Cmd K, driven by the arrow keys and Enter, closed by Escape or a click outside.
*/
export default function CommandPalette({
  sections,
  projects,
  email,
  cvUrl,
  githubUrl,
  linkedinUrl,
  labels,
}: {
  sections: { title: string; href: string }[];
  projects: { title: string; kind?: string }[];
  email: string;
  cvUrl: string;
  githubUrl: string;
  linkedinUrl?: string;
  labels: PaletteLabels;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(false);

  // A message clears itself after a moment
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const items = useMemo<Item[]>(
    () => [
      ...sections.map((s) => ({ key: s.href, group: labels.groups.sections, title: s.title, kind: labels.sectionKind, href: s.href })),
      ...projects.map((p, i) => ({
        key: `project-${i}`,
        group: labels.groups.projects,
        title: p.title,
        kind: (p.kind ?? "").toLowerCase(),
        run: () => store.openDetail?.(i),
      })),
      {
        key: "email",
        group: labels.groups.actions,
        title: labels.copyEmail,
        kind: labels.emailKind,
        run: () => {
          if (!navigator.clipboard) setToast(labels.copyFailed);
          else navigator.clipboard.writeText(email).then(() => setToast(labels.copied), () => setToast(labels.copyFailed));
        },
      },
      { key: "cv", group: labels.groups.actions, title: labels.downloadCv, kind: labels.cvKind, href: cvUrl, external: true },
      { key: "github", group: labels.groups.actions, title: labels.openGithub, kind: labels.linkKind, href: githubUrl, external: true },
      ...(linkedinUrl
        ? [{ key: "linkedin", group: labels.groups.actions, title: labels.openLinkedin, kind: labels.linkKind, href: linkedinUrl, external: true }]
        : []),
    ],
    [sections, projects, email, cvUrl, githubUrl, linkedinUrl, labels],
  );

  const shown = useMemo(() => {
    const term = query.trim().toLowerCase();
    return term ? items.filter((it) => `${it.title} ${it.kind} ${it.group}`.toLowerCase().includes(term)) : items;
  }, [items, query]);
  const cur = Math.min(active, Math.max(0, shown.length - 1));

  // The header button and the shortcut
  useEffect(() => {
    const show = () => {
      if (store.introActive || store.detailOpen) return;
      setQuery("");
      setActive(0);
      setOpen(true);
    };
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== "k") return;
      e.preventDefault();
      if (openRef.current) setOpen(false);
      else show();
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest?.("#palette-open")) show();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  // While open: hold the page behind still and out of reach, and put the cursor in the box
  useEffect(() => {
    openRef.current = open;
    if (!open) return;
    document.documentElement.classList.add("modal-open");
    setBackdropInert(true);
    inputRef.current?.focus({ preventScroll: true });
    return () => {
      // A project picked from the list opens the detail view, which holds the page itself
      if (store.detailOpen) return;
      document.documentElement.classList.remove("modal-open");
      setBackdropInert(false);
      document.getElementById("palette-open")?.focus({ preventScroll: true });
    };
  }, [open]);

  // Keep the highlighted row in view
  useEffect(() => {
    if (open) listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [open, cur, query]);

  const pick = (it: Item) => {
    setOpen(false);
    it.run?.();
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (shown.length) setActive((cur + (e.key === "ArrowDown" ? 1 : shown.length - 1)) % shown.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      listRef.current?.querySelector<HTMLElement>(`[data-i="${cur}"]`)?.click();
    } else if (e.key === "Escape") {
      e.stopPropagation();
      setOpen(false);
    } else if (e.key === "Tab") {
      // Everything is reachable with the arrows, so Tab stays in the box
      e.preventDefault();
    }
  };

  return (
    <>
      {open ? (
        <div
          className="pal"
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="pal-box" role="dialog" aria-modal="true" aria-label={labels.label}>
            <label className="pal-in">
              <b aria-hidden="true">&gt;</b>
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls="pal-list"
                aria-autocomplete="list"
                aria-activedescendant={shown.length ? `pal-item-${cur}` : undefined}
                aria-label={labels.placeholder}
                placeholder={labels.placeholder}
                autoComplete="off"
                spellCheck={false}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKey}
              />
            </label>
            <div className="pal-list" id="pal-list" role="listbox" aria-label={labels.label} ref={listRef}>
              {shown.length ? (
                shown.map((it, i) => {
                  const shared = {
                    id: `pal-item-${i}`,
                    "data-i": i,
                    role: "option",
                    "aria-selected": i === cur,
                    className: `pal-i${i === cur ? " on" : ""}`,
                    tabIndex: -1,
                    onClick: () => pick(it),
                    onPointerMove: () => {
                      if (active !== i) setActive(i);
                    },
                  } as const;
                  const body = (
                    <>
                      {it.title}
                      <span>{it.kind}</span>
                    </>
                  );
                  return (
                    <div role="presentation" key={it.key}>
                      {i === 0 || shown[i - 1].group !== it.group ? (
                        <p className="pal-g" role="presentation">
                          {it.group}
                        </p>
                      ) : null}
                      {it.href ? (
                        it.external ? (
                          <a {...shared} href={it.href} target="_blank" rel="noopener">
                            {body}
                          </a>
                        ) : (
                          <a {...shared} href={it.href} data-scroll="">
                            {body}
                          </a>
                        )
                      ) : (
                        <button {...shared} type="button">
                          {body}
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="pal-none">{labels.empty}</p>
              )}
            </div>
            <div className="pal-foot" aria-hidden="true">
              {labels.hints.map((h) => (
                <span key={h}>{h}</span>
              ))}
            </div>
          </div>
        </div>
      ) : null}
      <p className={`pal-toast${toast ? " on" : ""}`} role="status">
        {toast}
      </p>
    </>
  );
}
