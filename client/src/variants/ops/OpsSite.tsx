import { useEffect } from "react";
import "./ops.css";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Work } from "./Work";
import { About } from "./About";
import { Experience } from "./Experience";
import { Stack } from "./Stack";
import { Play } from "./Play";
import { Contact } from "./Contact";
import { Footer } from "./Footer";

export default function OpsSite() {
  useEffect(() => {
    document.documentElement.dataset.variant = "ops";
    document.documentElement.style.colorScheme = "dark";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#0a0e13");
  }, []);

  return (
    <div className="ops">
      <Header />
      <main id="main">
        <Hero />
        <Work />
        <About />
        <Experience />
        <Stack />
        <Play />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
