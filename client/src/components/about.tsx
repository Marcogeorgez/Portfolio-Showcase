import { SectionHeader } from "@/components/section-header";
import { Brain, Database, Layout, Rocket, Server, Workflow } from "lucide-react";

const passions = [
  {
    icon: Server,
    title: "Full-Stack Architecture",
    description: "Building end-to-end systems with .NET backends and modern frontends, from concept through deployment. I design scalable solutions that handle real-world complexity and deliver measurable business value.",
  },
  {
    icon: Brain,
    title: "AI Workflow Automation",
    description: "Creating intelligent systems that automate repetitive tasks and augment human capability. Using APIs like OpenAI and Whisper, I build workflows that save teams hundreds of hours per month while improving accuracy.",
  },
  {
    icon: Layout,
    title: "React & Tailwind Expertise",
    description: "Crafting responsive, beautiful interfaces with React and Tailwind CSS that feel great on any device. I focus on performance, accessibility, and user experience that keeps users coming back.",
  },
  {
    icon: Database,
    title: "Database Design & Optimization",
    description: "Engineering robust data architectures using PostgreSQL and SQL Server that handle complex business logic efficiently. I ensure data integrity, optimize queries for performance, and design schemas that scale.",
  },
  {
    icon: Workflow,
    title: "Code Quality & Reliability",
    description:
      "Every line of code I write is production-ready, tested, and maintainable. I deliver clean architectures, follow best practices, and ensure systems remain stable under real-world conditions. Your code is an investment that should pay dividends.",
  },
  {
    icon: Rocket,
    title: "Results-Driven Development",
    description:
      "I focus on solving your business problems, not just writing code. Every feature, optimization, and deployment directly impacts your bottom line. I deliver measurable outcomes and take ownership of project success from day one.",
  },
];

export function About() {
  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          kicker="About"
          title="What I Do"
          description="I'm passionate about transforming complex problems into elegant, efficient solutions. As a full-stack engineer, I bridge the gap between powerful backend systems and intuitive user experiences. Whether building enterprise applications, automating workflows with AI, or crafting beautiful interfaces, I'm committed to delivering software that matters."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {passions.map((item, i) => (
            <div
              key={item.title}
              className="group bg-card/50 border border-white/10 rounded-2xl p-7 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300"
              style={{ transitionDelay: `${i * 20}ms` }}
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5 group-hover:scale-110 group-hover:border-primary/50 transition-all">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
