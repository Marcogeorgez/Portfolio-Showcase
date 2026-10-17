import { useSkills } from "@/hooks/use-portfolio";
import { SectionHeader } from "@/components/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Box, Brain, Cloud, Code2, Cpu, Database, GitBranch, Layers, Network, Radio, Smartphone, Wind, Workflow, Zap } from "lucide-react";

const techIcons: Record<string, React.ReactNode> = {
  ".NET Core": <Box className="w-4 h-4" />,
  "ASP.NET": <Box className="w-4 h-4" />,
  "EF Core": <Database className="w-4 h-4" />,
  OData: <Zap className="w-4 h-4" />,
  SignalR: <Radio className="w-4 h-4" />,
  Hangfire: <Workflow className="w-4 h-4" />,
  Refit: <Code2 className="w-4 h-4" />,
  "REST APIs": <Network className="w-4 h-4" />,
  Blazor: <Box className="w-4 h-4" />,
  React: <Layers className="w-4 h-4" />,
  "Tailwind CSS": <Wind className="w-4 h-4" />,
  JavaScript: <Code2 className="w-4 h-4" />,
  "HTML5/CSS3": <Code2 className="w-4 h-4" />,
  Radzen: <Code2 className="w-4 h-4" />,
  MudBlazor: <Code2 className="w-4 h-4" />,
  ".NET MAUI (Android / iOS)": <Smartphone className="w-4 h-4" />,
  PostgreSQL: <Database className="w-4 h-4" />,
  "Microsoft SQL Server": <Database className="w-4 h-4" />,
  Railway: <Cloud className="w-4 h-4" />,
  "Cloudflare R2": <Cloud className="w-4 h-4" />,
  "AWS S3": <Cloud className="w-4 h-4" />,
  N8N: <Workflow className="w-4 h-4" />,
  "OpenAI API": <Brain className="w-4 h-4" />,
  Whisper: <Brain className="w-4 h-4" />,
  Git: <GitBranch className="w-4 h-4" />,
  Docker: <Box className="w-4 h-4" />,
  Python: <Code2 className="w-4 h-4" />,
  Flask: <Cpu className="w-4 h-4" />,
  TensorFlow: <Cpu className="w-4 h-4" />,
};

export function SkillsSection() {
  const skills = useSkills().slice().sort((a, b) => a.order - b.order);

  return (
    <section id="skills" className="py-24 border-y border-white/5 relative">
      <div className="glow-orb bg-primary/20 w-[600px] h-[600px] top-0 left-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader kicker="Capabilities" title="Technical Arsenal" description="Technologies and tools I use to build robust solutions." align="center" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skillGroup) => (
            <Card key={skillGroup.id} className="h-full bg-card/50 border-white/5 hover:border-primary/30 transition-colors shadow-xl hover:shadow-primary/5">
              <CardHeader>
                <CardTitle className="text-lg font-display text-primary">{skillGroup.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="bg-white/5 hover:bg-primary/10 hover:border-primary/40 text-sm font-medium px-3 py-2 text-foreground border border-transparent transition-colors flex items-center gap-2 cursor-default"
                    >
                      {techIcons[skill] || <Code2 className="w-4 h-4" />}
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
