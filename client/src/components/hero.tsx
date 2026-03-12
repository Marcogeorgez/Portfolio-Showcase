import { motion } from "framer-motion";
import { ArrowRight, Code2, Server, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-pattern z-0" />
      <div className="glow-orb bg-primary w-[500px] h-[500px] top-[-100px] right-[-100px] sm:hidden md:inline" />
      <div className="glow-orb bg-indigo-600 w-[400px] h-[400px] bottom-[-100px] left-[-100px]" />
      <div className="absolute inset-0 bg-background/80 z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-6">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-muted-foreground">Available for new opportunities</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
            Hi, I'm Marco George
            <br />
            <span className="text-gradient-primary">Full-Stack Engineer</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-lg md:text-2xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            Specializing in <strong className="text-foreground font-semibold">.NET and Blazor</strong>, with
            <strong className="text-foreground font-semibold"> deep expertise in AI Workflow Automation</strong>. I craft scalable, intelligent applications that solve real problems for international clients.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-wrap items-center gap-4">
            <Button asChild size="lg" className="rounded-full px-8 h-14 text-base border border-primary/40 hover:border-primary hover:-translate-y-0.5 transition-all">
              <a href="#projects">
                View My Work <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 h-14 text-base border-primary/30 hover:border-primary hover:bg-primary/5 hover:-translate-y-0.5 transition-all">
              <a href="#experience">View Experience</a>
            </Button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} className="mt-20 flex items-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-primary" /> <span>Frontend</span>
            </div>
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-primary" /> <span>Backend</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> <span>AI Automation</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
