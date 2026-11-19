import { useState } from "react";
import type { FlowSpec } from "./flow-data";

/**
 * A vertical request path for the case drawer. Each stage is a row, so the map
 * reads on a phone without horizontal scrolling or 8px SVG labels.
 */
export function SystemFlow({ spec }: { spec: FlowSpec }) {
  const [selected, setSelected] = useState<string | null>(null);
  const active = spec.stages.flatMap((stage) => stage.nodes).find((node) => node.id === selected);

  return (
    <section className="ops-flow" aria-label={spec.title}>
      <div className="ops-flow-head">
        <span>System map</span>
        <span className="ops-flow-live">
          <i aria-hidden="true" />
          request path
        </span>
      </div>

      <ol className="ops-flow-stages">
        {spec.stages.map((stage, index) => (
          <li key={stage.id} className="ops-flow-stage">
            <div className="ops-flow-stage-label">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <b>{stage.label}</b>
            </div>

            <div className="ops-flow-spine" aria-hidden="true">
              <i className="ops-flow-dot" />
              {index < spec.stages.length - 1 && <i className="ops-flow-pulse" style={{ animationDelay: `${index * 0.55}s` }} />}
            </div>

            <div className="ops-flow-nodes">
              {stage.nodes.map((node) => {
                const isActive = selected === node.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    className="ops-flow-node"
                    data-hot={node.hot ? "true" : undefined}
                    data-active={isActive ? "true" : undefined}
                    aria-pressed={isActive}
                    aria-label={`${node.label}: ${node.detail}`}
                    onClick={() => setSelected((current) => (current === node.id ? null : node.id))}
                  >
                    <b>{node.label}</b>
                    {node.sub && <small>{node.sub}</small>}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ol>

      <p className="ops-flow-detail" aria-live="polite">
        {active ? (
          <>
            <b>{active.label}</b> {active.detail}
          </>
        ) : (
          spec.note
        )}
      </p>
    </section>
  );
}
