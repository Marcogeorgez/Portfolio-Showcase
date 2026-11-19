import { stackGroups } from "@/data";

export function Stack() {
  const total = stackGroups.reduce((count, group) => count + group.items.length, 0);

  return (
    <section id="stack" className="ops-section" aria-labelledby="stack-heading">
      <div className="ops-wrap">
        <div className="ops-section-head">
          <div>
            <p className="ops-label">
              <span>05</span>
              <span>Capability matrix</span>
            </p>
            <h2 id="stack-heading" className="ops-h2">
              What I actually use.
            </h2>
          </div>
          <p>Grouped by how often I use it. Core ships every week. The rest is proven on client work or still active working knowledge.</p>
        </div>

        <div className="ops-matrix">
          {stackGroups.map((group) => (
            <div key={group.id} className="ops-matrix-row">
              <div>
                <h3 className="ops-matrix-tier">{group.tier}</h3>
                <span className="ops-matrix-note">{group.note}</span>
              </div>
              <p className="ops-matrix-items">
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </p>
              <span className="ops-matrix-count">{String(group.items.length).padStart(2, "0")}</span>
            </div>
          ))}
        </div>

        <div className="ops-matrix-foot">
          <span>{total} tools in the matrix. Five tiers, no logo wall.</span>
          <span>Also: Git / Radzen / MudBlazor / Refit</span>
        </div>
      </div>
    </section>
  );
}
