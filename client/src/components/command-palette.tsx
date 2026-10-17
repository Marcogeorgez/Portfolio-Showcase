import { useCallback, useEffect, useState } from "react";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Check, Copy, Download, ExternalLink, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { personalInfo } from "@/data";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const openEvent = () => setOpen(true);
    document.addEventListener("keydown", down);
    window.addEventListener("open-command-palette", openEvent);
    return () => {
      document.removeEventListener("keydown", down);
      window.removeEventListener("open-command-palette", openEvent);
    };
  }, []);

  const close = useCallback(() => setOpen(false), []);

  const scrollTo = useCallback((id: string) => {
    close();
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }));
  }, [close]);

  const copyEmail = useCallback(() => {
    close();
    void navigator.clipboard
      .writeText(personalInfo.email)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      })
      .catch(() => {
        window.location.href = `mailto:${personalInfo.email}`;
      });
  }, [close]);

  // Mount only when open: cmdk crashes when its Command primitive renders without the dialog overlay.
  return open ? (
    <CommandDialog open={open} onOpenChange={setOpen} title="Command palette" description="Jump straight to it" className="sm:max-w-[560px]">
      <Command className="bg-popover py-3 gap-1.5 [&_[cmdk-group-items]]:gap-2! [&_[cmdk-item]]:py-2.5! [&_[cmdk-item]]:px-3!">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList className="px-3 pb-2 max-h-80">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => scrollTo("about")}>
            <MapPin className="w-4 h-4" /> About
          </CommandItem>
          <CommandItem onSelect={() => scrollTo("experience")}>
            <MapPin className="w-4 h-4" /> Experience
          </CommandItem>
          <CommandItem onSelect={() => scrollTo("skills")}>
            <MapPin className="w-4 h-4" /> Skills
          </CommandItem>
          <CommandItem onSelect={() => scrollTo("projects")}>
            <MapPin className="w-4 h-4" /> Projects
          </CommandItem>
          <CommandItem onSelect={copyEmail}>
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy email"}
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Links">
          <CommandItem onSelect={() => window.location.assign(`mailto:${personalInfo.email}`)}>
            <Mail className="w-4 h-4" /> Email me
          </CommandItem>
          <CommandItem onSelect={() => window.open(personalInfo.github, "_blank", "noopener")}>
            <Github className="w-4 h-4" /> GitHub <ExternalLink className="w-3 h-3 opacity-50" />
          </CommandItem>
          <CommandItem onSelect={() => window.open(personalInfo.linkedin, "_blank", "noopener")}>
            <Linkedin className="w-4 h-4" /> LinkedIn <ExternalLink className="w-3 h-3 opacity-50" />
          </CommandItem>
          <CommandItem onSelect={() => window.location.assign(personalInfo.cvUrl)}>
            <Download className="w-4 h-4" /> Download CV
          </CommandItem>
        </CommandGroup>
      </CommandList>
      </Command>
    </CommandDialog>
  ) : null;
}
