import Background from "@/components/Scene/Background";
import Nav from "@/components/Nav";
import Preloader from "@/components/Preloader";
import ScrollToTop from "@/components/ScrollToTop";
import SmoothScroll from "@/components/SmoothScroll";
import Hero from "@/components/Sections/Hero";
import About from "@/components/Sections/About";
import Experience from "@/components/Sections/Experience";
import Projects from "@/components/Sections/Projects";
import Skills from "@/components/Sections/Skills";
import Contact from "@/components/Sections/Contact";

export default function Home() {
  return (
    <SmoothScroll>
      <Preloader />
      <Background />
      <Nav />
      <ScrollToTop />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
