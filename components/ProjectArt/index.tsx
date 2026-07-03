import type { JSX } from "react";

// Hand-drawn line-art, one drawing per project domain. All share a 240x160
// stage, stroke-only, blue primary / taupe secondary. Every element carries
// pathLength=1 + class "draw" so the card hover can replay a draw-in.

const BLUE = "#2563eb";
const TAUPE = "#8a7a6a";

const frame = {
  viewBox: "0 0 240 160",
  fill: "none",
  strokeWidth: 2.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Svg({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg {...frame} role="img" aria-label={label} className="project-art h-full w-full">
      {children}
    </svg>
  );
}

const d = { pathLength: 1, className: "draw" };

function LibyanaHub() {
  return (
    <Svg label="E-learning platform illustration">
      {/* Mortarboard */}
      <path {...d} d="M120 30 178 55 120 80 62 55Z" stroke={BLUE} />
      <path {...d} d="M88 68v22c0 8 14 15 32 15s32-7 32-15V68" stroke={TAUPE} />
      <path {...d} d="M178 55v28" stroke={BLUE} />
      <circle {...d} cx="178" cy="89" r="3.5" stroke={BLUE} />
      {/* Play node */}
      <circle {...d} cx="120" cy="128" r="16" stroke={BLUE} />
      <path {...d} d="M115 121l12 7-12 7Z" stroke={TAUPE} />
    </Svg>
  );
}

function LibyanaHubCollab() {
  return (
    <Svg label="Healthcare records illustration">
      {/* Patient record card */}
      <rect {...d} x="52" y="30" width="88" height="62" rx="6" stroke={TAUPE} />
      <path {...d} d="M64 48h40M64 62h52M64 76h32" stroke={TAUPE} />
      {/* Medical cross */}
      <path {...d} d="M172 34v20M162 44h20" stroke={BLUE} />
      {/* ECG line */}
      <path {...d} d="M28 126h48l12-22 14 40 12-28 10 10h88" stroke={BLUE} />
    </Svg>
  );
}

function Orders() {
  return (
    <Svg label="Invoice management illustration">
      {/* Invoice sheet with folded corner */}
      <path {...d} d="M58 24h56l20 20v92H58Z" stroke={TAUPE} />
      <path {...d} d="M114 24v20h20" stroke={TAUPE} />
      <path {...d} d="M72 62h48M72 78h48M72 94h32" stroke={TAUPE} />
      {/* Rising bars + trend */}
      <path {...d} d="M158 136v-22M176 136v-38M194 136v-54" stroke={BLUE} />
      <path {...d} d="M152 102l52-44m0 0h-14m14 0v14" stroke={BLUE} />
    </Svg>
  );
}

function Elzwetina() {
  return (
    <Svg label="Industrial solutions illustration">
      {/* Hard hat */}
      <path {...d} d="M78 96a42 42 0 0 1 84 0" stroke={BLUE} />
      <path {...d} d="M64 96h112" stroke={BLUE} />
      <path {...d} d="M120 54v-12" stroke={BLUE} />
      {/* Hex grid */}
      <path {...d} d="M104 118l8-14h16l8 14-8 14h-16Z" stroke={TAUPE} />
      <path {...d} d="M144 118l8-14h16l8 14-8 14h-16Z" stroke={TAUPE} />
      <path {...d} d="M64 118l8-14h16l8 14-8 14H72Z" stroke={TAUPE} />
    </Svg>
  );
}

function Kbtech() {
  return (
    <Svg label="Tech services illustration">
      {/* Terminal window */}
      <rect {...d} x="42" y="34" width="128" height="92" rx="8" stroke={TAUPE} />
      <path {...d} d="M42 56h128" stroke={TAUPE} />
      <circle {...d} cx="56" cy="45" r="2.5" stroke={TAUPE} />
      <circle {...d} cx="68" cy="45" r="2.5" stroke={TAUPE} />
      <path {...d} d="M58 76l14 12-14 12M84 104h28" stroke={BLUE} />
      {/* Code brackets */}
      <path {...d} d="M192 66l-14 24 14 24M206 66l14 24-14 24" stroke={BLUE} />
    </Svg>
  );
}

function Weather() {
  return (
    <Svg label="Weather app illustration">
      {/* Sun */}
      <circle {...d} cx="86" cy="56" r="18" stroke={BLUE} />
      <path
        {...d}
        d="M86 26v-8M86 94v-6M116 56h8M48 56h8M108 34l6-6M58 84l6-6M108 78l6 6M58 28l6 6"
        stroke={BLUE}
      />
      {/* Cloud */}
      <path {...d} d="M124 84a20 20 0 0 1 38-6 16 16 0 0 1 8 30h-58a14 14 0 0 1 12-24Z" stroke={TAUPE} />
      {/* Rain under the cloud */}
      <path {...d} d="M128 110l-3 7M144 110l-3 7M160 110l-3 7" stroke={BLUE} />
      {/* Temperature curve */}
      <path {...d} d="M32 136c36-18 60 8 92-10 24-13 46-8 84-2" stroke={BLUE} />
    </Svg>
  );
}

function LibyaRoots() {
  return (
    <Svg label="Tourism landmarks illustration">
      {/* Roman arch */}
      <path {...d} d="M136 128V72a28 28 0 0 1 56 0v56" stroke={TAUPE} />
      <path {...d} d="M130 128h68" stroke={TAUPE} />
      <path {...d} d="M148 128V78m32 50V78" stroke={TAUPE} />
      {/* Map pin */}
      <path {...d} d="M76 128s-28-26-28-48a28 28 0 0 1 56 0c0 22-28 48-28 48Z" stroke={BLUE} />
      <circle {...d} cx="76" cy="78" r="10" stroke={BLUE} />
      {/* Route — plain dashes, no draw-in (pathLength would rescale the dash units) */}
      <path
        d="M88 134c10 6 20 5 30-2"
        stroke={BLUE}
        strokeDasharray="6 7"
        className="opacity-80"
      />
    </Svg>
  );
}

function NewsBot() {
  return (
    <Svg label="News bot illustration">
      {/* Paper plane */}
      <path {...d} d="M56 84l128-44-32 92-30-30Z" stroke={BLUE} />
      <path {...d} d="M184 40l-62 62" stroke={BLUE} />
      <path {...d} d="M122 102v26l15-11" stroke={BLUE} />
      {/* RSS waves */}
      <path {...d} d="M42 128a24 24 0 0 1 24 24" stroke={TAUPE} />
      <path {...d} d="M42 112a40 40 0 0 1 40 40" stroke={TAUPE} />
      <circle {...d} cx="46" cy="148" r="3" stroke={TAUPE} />
    </Svg>
  );
}

function ZadAlmuslim() {
  return (
    <Svg label="Islamic resources illustration">
      {/* Crescent */}
      <path {...d} d="M132 30a52 52 0 1 0 26 98 44 44 0 1 1-26-98Z" stroke={BLUE} />
      {/* Five-pointed star */}
      <path
        {...d}
        d="M166 60l2.8 8.1 8.6 0.2-6.8 5.2 2.5 8.2-7.1-4.9-7.1 4.9 2.5-8.2-6.8-5.2 8.6-0.2Z"
        stroke={TAUPE}
      />
      {/* Radio waves */}
      <path {...d} d="M186 118a18 18 0 0 1 18 18" stroke={TAUPE} />
      <path {...d} d="M186 104a32 32 0 0 1 32 32" stroke={TAUPE} />
    </Svg>
  );
}

function EasyBank() {
  return (
    <Svg label="Banking landing page illustration">
      {/* Card */}
      <rect {...d} x="44" y="46" width="104" height="68" rx="8" stroke={BLUE} />
      <path {...d} d="M44 64h104" stroke={BLUE} />
      <rect {...d} x="56" y="76" width="20" height="14" rx="3" stroke={TAUPE} />
      <path {...d} d="M56 102h36" stroke={TAUPE} />
      {/* Growth line */}
      <path {...d} d="M160 122l20-24 14 10 22-32m0 0h-14m14 0v14" stroke={BLUE} />
    </Svg>
  );
}

function MovieApp() {
  return (
    <Svg label="Movie app illustration">
      {/* Film frame */}
      <rect {...d} x="58" y="36" width="124" height="88" rx="6" stroke={TAUPE} />
      <path {...d} d="M78 36v88M162 36v88" stroke={TAUPE} />
      <path {...d} d="M58 58h20M58 80h20M58 102h20M162 58h20M162 80h20M162 102h20" stroke={TAUPE} />
      {/* Play */}
      <path {...d} d="M110 62l30 18-30 18Z" stroke={BLUE} />
    </Svg>
  );
}

export const projectArt: Record<string, () => JSX.Element> = {
  libyanahub: LibyanaHub,
  "libyanahub-collab": LibyanaHubCollab,
  orders: Orders,
  elzwetina: Elzwetina,
  kbtech: Kbtech,
  weather: Weather,
  "libya-roots": LibyaRoots,
  "news-bot": NewsBot,
  "zad-almuslim": ZadAlmuslim,
  "easy-bank": EasyBank,
  "movie-app": MovieApp,
};
