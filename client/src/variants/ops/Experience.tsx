import { experiencesData } from "@/data";

export function Experience() {
  const experiences = experiencesData.slice().sort((a, b) => b.order - a.order);

  return (
    <section id="experience" className="ops-section" aria-labelledby="experience-heading">
      <div className="ops-wrap">
        <div className="ops-section-head">
          <div>
            <p className="ops-label">
              <span>04</span>
              <span>Shift log</span>
            </p>
            <h2 id="experience-heading" className="ops-h2">
              Two roles. I owned the build in both.
            </h2>
          </div>
          <p>I design the schema and API, ship the release, then support it. The CV has the short version.</p>
        </div>

        <div className="ops-log">
          {experiences.map((experience) => (
            <article key={experience.id} className="ops-log-entry">
              <p className="ops-log-when">
                {experience.period}
                <span>{experience.location}</span>
                <span>{experience.company}</span>
              </p>

              <div>
                <h3>{experience.role}</h3>
                <p className="ops-log-company">{experience.company}</p>
                <ul className="ops-log-list">
                  {experience.description.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {experience.stack && <p className="ops-log-stack">{experience.stack.join(" / ")}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
