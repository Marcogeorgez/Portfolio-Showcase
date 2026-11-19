import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, Download, Github, Linkedin, Mail } from "lucide-react";
import { factsData, personalInfo } from "@/data";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  const copyEmail = async () => {
    if (!navigator.clipboard) {
      window.location.href = `mailto:${personalInfo.email}`;
      return;
    }
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setCopied(true);
      window.dispatchEvent(new CustomEvent("show-toast", { detail: "Email copied" }));
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${personalInfo.email}`;
    }
  };

  return (
    <section id="contact" className="ops-section" aria-labelledby="contact-heading">
      <div className="ops-wrap">
        <p className="ops-label">
          <span>07</span>
          <span>Dispatch</span>
        </p>

        <div className="ops-dispatch">
          <div className="ops-dispatch-main">
            <h2 id="contact-heading">Bring me the hard part.</h2>
            <p>
              I am open to senior .NET and full-stack roles, and to focused contract work. Tell me what you are building, what is breaking, or what you want automated.
            </p>

            <a href={`mailto:${personalInfo.email}`} className="ops-dispatch-email">
              {personalInfo.email}
            </a>

            <div className="ops-dispatch-actions">
              <a href={`mailto:${personalInfo.email}`} className="ops-btn">
                Email me
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
              <button type="button" className="ops-btn ops-btn-quiet" onClick={copyEmail} aria-live="polite">
                {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
                {copied ? "Copied" : "Copy email"}
              </button>
              <a href={personalInfo.cvUrl} className="ops-btn ops-btn-quiet">
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                CV
              </a>
            </div>
          </div>

          <div className="ops-dispatch-side">
            <h3>Details</h3>
            <dl className="ops-dispatch-facts">
              {factsData.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>

            <h3 className="mt-5">Channels</h3>
            <div className="ops-dispatch-links">
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">
                <span className="inline-flex items-center gap-2">
                  <Github className="h-3.5 w-3.5" aria-hidden="true" /> GitHub
                </span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
                <span className="inline-flex items-center gap-2">
                  <Linkedin className="h-3.5 w-3.5" aria-hidden="true" /> LinkedIn
                </span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
              <a href={`mailto:${personalInfo.email}`}>
                <span className="inline-flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" /> Email
                </span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
