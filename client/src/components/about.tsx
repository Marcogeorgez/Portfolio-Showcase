import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export function About() {
  const passions = [
    {
      title: "Full-Stack Architecture",
      description: "Building end-to-end systems with .NET backends and modern frontends, from concept through deployment. I design scalable solutions that handle real-world complexity and deliver measurable business value.",
    },
    {
      title: "AI Workflow Automation",
      description: "Creating intelligent systems that automate repetitive tasks and augment human capability. Using APIs like OpenAI and Whisper, I build workflows that save teams hundreds of hours per month while improving accuracy.",
    },
    {
      title: "React & Tailwind Expertise",
      description: "Crafting responsive, beautiful interfaces with React and Tailwind CSS that feel great on any device. I focus on performance, accessibility, and user experience that keeps users coming back.",
    },
    {
      title: "Database Design & Optimization",
      description: "Engineering robust data architectures using PostgreSQL and SQL Server that handle complex business logic efficiently. I ensure data integrity, optimize queries for performance, and design schemas that scale.",
    },
    {
      title: "Code Quality & Reliability",
      description:
        "Every line of code I write is production-ready, tested, and maintainable. I deliver clean architectures, follow best practices, and ensure systems remain stable under real-world conditions. Your code is an investment that should pay dividends.",
    },
    {
      title: "Results-Driven Development",
      description:
        "I focus on solving your business problems, not just writing code. Every feature, optimization, and deployment directly impacts your bottom line. I deliver measurable outcomes and take ownership of project success from day one.",
    },
  ];

  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What I Do</h2>
          <div className="w-20 h-1 bg-primary rounded-full mb-8" />
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            I'm passionate about transforming complex problems into elegant, efficient solutions. As a full-stack engineer, I bridge the gap between powerful backend systems and intuitive user experiences. Whether building enterprise
            applications, automating workflows with AI, or crafting beautiful interfaces, I'm committed to delivering software that matters.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {passions.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors h-full">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-4 text-primary">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
