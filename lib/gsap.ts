import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Imported by client components only. Register once, in the browser.
if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
