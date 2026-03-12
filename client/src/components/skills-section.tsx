import { motion } from "framer-motion";
import { useSkills } from "@/hooks/use-portfolio";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Zap, Cpu, Rocket, Database, GitBranch, Cloud, Workflow, Box, Brain, Smartphone, Braces, Layers, Wind, Radio, Network } from "lucide-react";

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
  const { data: skills, isLoading } = useSkills();

  return (
    <section id="skills" className="py-24 bg-white/[0.02] border-y border-white/5 relative">
      <div className="glow-orb bg-primary/20 w-[600px] h-[600px] top-0 left-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Technical Arsenal</h2>
          <p className="text-muted-foreground">Technologies and tools I use to build robust solutions.</p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[200px] w-full rounded-xl bg-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills
              ?.sort((a, b) => a.order - b.order)
              .map((skillGroup, i) => (
                <motion.div key={skillGroup.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Card className="h-full bg-background border-white/5 shadow-xl hover:shadow-primary/5 transition-all">
                    <CardHeader>
                      <CardTitle className="text-lg font-display text-primary">{skillGroup.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {skillGroup.items.map((skill) => (
                          <Badge key={skill} variant="secondary" className="bg-white/5 hover:bg-white/10 text-sm font-medium px-3 py-2 text-foreground transition-colors flex items-center gap-2">
                            {techIcons[skill] || <Code2 className="w-4 h-4" />}
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>
        )}
      </div>
    </section>
  );
}
