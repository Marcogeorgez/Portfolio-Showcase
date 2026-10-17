import { motion } from "framer-motion";
import { ArrowDown, Download, Github, Linkedin, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedNumber, TypedHeading } from "@/components/section-header";
import { heroPhrases, personalInfo, statsData } from "@/data";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-24 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-dot-pattern z-0" />
      <div className="glow-orb bg-primary w-125 h-125 -top-25 -right-25 sm:hidden md:inline" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-16 items-center">
          {/* Left: intro */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              <span className="text-sm font-medium text-muted-foreground">{personalInfo.availability}</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-5xl md:text-7xl font-bold leading-tight mb-4 text-balance">
              Hi, I'm Marco George.
              <br />
              <TypedHeading phrases={heroPhrases} className="text-gradient-primary" />
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
              I build <strong className="text-foreground font-semibold">production web platforms</strong> for real businesses with .NET and Blazor, and ship{" "}
              <strong className="text-foreground font-semibold">AI workflow automations</strong> that quietly save teams hours every week.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="rounded-full px-8 h-14 text-base border border-primary/40 hover:border-primary hover:-translate-y-0.5 transition-all">
                <a href="#projects">
                  View My Work <ArrowDown className="ml-2 w-5 h-5" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8 h-14 text-base border-primary/30 hover:border-primary hover:bg-primary/5 hover:-translate-y-0.5 transition-all">
                <a href={personalInfo.cvUrl}>
                  <Download className="mr-2 w-5 h-5" /> Download CV
                </a>
              </Button>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }} className="mt-10 flex items-center gap-3">
              {[
                { icon: Github, href: personalInfo.github, label: "GitHub" },
                { icon: Linkedin, href: personalInfo.linkedin, label: "LinkedIn" },
                { icon: Mail, href: `mailto:${personalInfo.email}`, label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="w-11 h-11 rounded-full glass-panel flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:-translate-y-0.5 transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
              <span className="ml-2 text-sm text-muted-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> Let's build something
              </span>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }} className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/5 pt-8">
              {statsData.map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl md:text-4xl font-bold text-gradient-primary">
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: terminal panel */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }} className="relative hidden lg:block">
            <div className="relative rounded-2xl glass-panel overflow-hidden terminal-glow font-mono text-sm">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <span className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-3 text-xs text-muted-foreground">marco@portfolio: ~</span>
              </div>
              <div className="p-6 space-y-3 leading-relaxed">
                <p>
                  <span className="text-primary">marco@portfolio</span>
                  <span className="text-muted-foreground">:~$</span> <span className="text-foreground">whoami</span>
                </p>
                <p className="text-muted-foreground">Full-stack engineer, .NET & Blazor</p>
                <p>
                  <span className="text-primary">marco@portfolio</span>
                  <span className="text-muted-foreground">:~$</span> <span className="text-foreground">cat stack.txt</span>
                </p>
                <p className="text-muted-foreground">
                  [".NET", "Blazor", "React", <span className="text-primary">"AI agents"</span>, "PostgreSQL"]
                </p>
                <p>
                  <span className="text-primary">marco@portfolio</span>
                  <span className="text-muted-foreground">:~$</span> <span className="text-foreground">./deploy --production</span>
                </p>
                <p className="text-muted-foreground">
                  <span className="text-green-400">✓</span> 6 platforms shipped&nbsp;&nbsp;<span className="text-green-400">✓</span> 10+ AI pipelines in prod
                </p>
                <p>
                  <span className="text-primary">marco@portfolio</span>
                  <span className="text-muted-foreground">:~$</span> <span className="inline-block w-2 h-4 align-middle bg-primary/80 animate-pulse" />
                </p>
              </div>
            </div>

            {/* Floating tech chips */}
            {[
              { label: "Blazor", className: "-top-5 -right-3", delay: "0s" },
              { label: "AI Automations", className: "bottom-6 -right-6", delay: "1.2s" },
              { label: "SignalR", className: "bottom-16 -left-8", delay: "2.1s" },
            ].map((chip) => (
              <motion.div
                key={chip.label}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: parseFloat(chip.delay) }}
                className={`absolute ${chip.className} px-3 py-1.5 rounded-full glass-panel text-xs font-medium text-muted-foreground border border-primary/20`}
              >
                {chip.label}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
