import type { CSSProperties } from "react";

export type TerminalLabels = {
  prompt: string;
  command: string;
  type: string;
  stack: string;
  status: string;
  live: string;
  private: string;
};

export type TerminalProject = { slug: string; title: string; kind?: string; techs: string[]; live: boolean };

// The tab's file extension follows the project's main framework
function extension(techs: string[]) {
  const t = (techs[0] ?? "").toLowerCase();
  if (t.startsWith("laravel") || t.startsWith("php")) return "php";
  if (t.startsWith("react")) return "tsx";
  if (t.startsWith("vue") || t.startsWith("nuxt")) return "vue";
  if (t.startsWith("astro")) return "astro";
  if (t.startsWith("node")) return "js";
  return "ts";
}

/*
  A project as a terminal: an editor tab with the file name sticks up from the top edge,
  a prompt opens the project, the name prints as the output and the details follow as
  key and value lines, ending on a blinking cursor. The card and the detail view share it,
  so the card can grow into the detail view. Purely presentational.
*/
export default function Terminal({
  project: p,
  index,
  labels,
  maxTechs,
  big = false,
}: {
  project: TerminalProject;
  index: number;
  labels: TerminalLabels;
  maxTechs?: number;
  big?: boolean;
}) {
  const num = String(index + 1).padStart(2, "0");
  const cmd = `${labels.command} ${p.slug}`;
  const techs = maxTechs ? p.techs.slice(0, maxTechs) : p.techs;
  return (
    <span className={`term${big ? " term-big" : ""}`}>
      <span className="term-in">
        <span className="term-tab">
          <i aria-hidden="true" />
          <span className="term-file">
            {p.slug}.{extension(p.techs)}
          </span>
          <em>{num}</em>
        </span>
        <span className="term-body">
          <span className="term-line">
            <b>{labels.prompt}</b>{" "}
            <span className="term-typed" style={{ "--n": cmd.length, "--w": `${cmd.length}ch` } as CSSProperties}>
              {cmd}
            </span>
          </span>
          <span className="term-title">{p.title}</span>
          <span className="term-kv">
            {p.kind ? (
              <>
                <span>{labels.type}</span>
                <span>{p.kind.toLowerCase()}</span>
              </>
            ) : null}
            <span>{labels.stack}</span>
            <span>{techs.join(", ").toLowerCase()}</span>
            <span>{labels.status}</span>
            <span className={p.live ? "term-ok" : undefined}>{p.live ? `● ${labels.live}` : `○ ${labels.private}`}</span>
          </span>
          <span className="term-line term-last">
            <b>{labels.prompt}</b>
            <span className="term-cur" aria-hidden="true" />
          </span>
          <span className="term-num" aria-hidden="true">
            {num}
          </span>
        </span>
      </span>
    </span>
  );
}
