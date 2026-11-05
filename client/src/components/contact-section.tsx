import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, Download, Github, Linkedin, Phone } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { factsData, personalInfo } from "@/data";

const contactLinks = [
  { label: "GitHub", value: "github.com/marcogeorgez", href: personalInfo.github, icon: Github, external: true },
  { label: "LinkedIn", value: "linkedin.com/in/marcogeorgez", href: personalInfo.linkedin, icon: Linkedin, external: true },
  { label: "CV", value: "Print-ready PDF", href: personalInfo.cvUrl, icon: Download, external: false },
  { label: "Phone", value: personalInfo.phone, href: `tel:${personalInfo.phone.replace(/\s/g, "")}`, icon: Phone, external: false },
];

export function ContactSection() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const copyEmail = async () => {
    if (!navigator.clipboard) {
      window.location.href = `mailto:${personalInfo.email}`;
      return;
    }
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setCopied(true);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${personalInfo.email}`;
    }
  };

  return (
    <section id="contact" className="section-pad border-t border-line" aria-labelledby="contact-heading">
      <div className="wrap">
        <div className="grid gap-14 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20">
          <Reveal>
            <span className="eyebrow">06 / Contact</span>
            <h2 id="contact-heading" className="display-1 mt-5 max-w-[11ch] text-balance">
              Let&apos;s ship something.
            </h2>
            <p className="lede mt-6 max-w-[34rem] text-pretty">
              I&apos;m open to senior .NET and full-stack roles, and to focused contract work. Tell me what you are building, what is breaking, or what you want automated.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a href={`mailto:${personalInfo.email}`} className="btn btn-solid" data-cursor-label="Email">
                Email me
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <button type="button" onClick={copyEmail} className="btn btn-ghost" aria-live="polite">
                {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                {copied ? "Copied" : "Copy email"}
              </button>
              <a href={personalInfo.cvUrl} className="btn btn-ghost" data-cursor-label="CV">
                <Download className="h-4 w-4" aria-hidden="true" />
                Download CV
              </a>
            </div>

            <a href={`mailto:${personalInfo.email}`} className="mt-10 inline-block max-w-full break-all font-display text-[clamp(1.35rem,3.6vw,2.9rem)] font-medium leading-none tracking-[-0.045em] text-white link-underline">
              {personalInfo.email}
            </a>

            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              {personalInfo.location} · Usually replies within one business day
            </p>
          </Reveal>

          <Reveal delay={120}>
            <dl className="border-t border-line">
              {factsData.map((fact) => (
                <div key={fact.label} className="grid grid-cols-[6rem_minmax(0,1fr)] gap-4 border-b border-line py-4">
                  <dt className="eyebrow pt-0.5">{fact.label}</dt>
                  <dd className="text-[14px] leading-[1.6] text-soft">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <ul className="mt-10 border-t border-line">
              {contactLinks.map(({ label, value, href, icon: Icon, external }) => (
                <li key={label} className="border-b border-line">
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="group flex items-center justify-between gap-4 py-4"
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-muted transition-colors group-hover:text-white" aria-hidden="true" />
                      <span className="flex flex-col">
                        <span className="text-[14px] text-white">{label}</span>
                        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{value}</span>
                      </span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-start gap-3 border border-line bg-panel/60 p-4">
              <span className="relative mt-1.5 flex h-1.5 w-1.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white">Available for new opportunities</p>
                <p className="mt-2 text-[13px] leading-[1.6] text-muted">
                  Full-time senior engineering or a scoped build. Based in Cairo, working remotely with teams in Europe and the US.
                </p>
              </div>
            </div>

            <p className="sr-only" aria-live="polite">
              {copied ? "Email address copied to clipboard." : ""}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
