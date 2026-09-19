import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type OrbitalNode = { id: string; step: string; title: string; description: string; icon: LucideIcon };

/** An interactive orbital layout: nodes arranged in a circle around a hub, expandable on click/focus. */
export function RadialOrbitalTimeline({ nodes }: { nodes: OrbitalNode[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(190);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const compute = () => setRadius(Math.max(120, Math.min(190, node.offsetWidth / 2 - 76)));
    compute();
    const observer = new ResizeObserver(compute);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const active = nodes.find((node) => node.id === activeId) ?? null;

  return (
    <div ref={containerRef} className="relative mx-auto flex min-h-[420px] w-full max-w-3xl items-center justify-center py-10 sm:min-h-[520px]">
      <motion.div
        aria-hidden
        className="absolute rounded-full border border-dashed border-primary/25"
        style={{ width: radius * 2, height: radius * 2 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute flex size-24 flex-col items-center justify-center rounded-full border border-primary bg-ikelex-navy px-2 text-center shadow-[var(--ikelex-glow)] sm:size-28">
        <span className="text-[10px] font-bold uppercase leading-tight text-ikelex-white sm:text-xs">{active ? active.step : "Our process"}</span>
      </div>
      {nodes.map((node, index) => {
        const angle = (index / nodes.length) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const Icon = node.icon;
        const isActive = activeId === node.id;
        return (
          <motion.button
            key={node.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => setActiveId(isActive ? null : node.id)}
            style={{ x, y }}
            className="absolute flex flex-col items-center gap-2 outline-none"
            whileHover={{ scale: 1.08 }}
            whileFocus={{ scale: 1.08 }}
          >
            <span className={cn("flex size-12 items-center justify-center rounded-full border transition-colors duration-300 sm:size-14", isActive ? "border-accent bg-accent text-ikelex-navy-2" : "border-border bg-card text-primary")}>
              <Icon className="size-5 sm:size-6" />
            </span>
            <span className="whitespace-nowrap text-[11px] font-bold uppercase text-foreground sm:text-xs">{node.title}</span>
          </motion.button>
        );
      })}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-0 max-w-sm border border-border bg-card p-5 text-center shadow-[var(--shadow-elevated)]"
          >
            <p className="text-xs font-bold uppercase text-accent">{active.step} — {active.title}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{active.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
      {!active && <p className="absolute bottom-0 text-xs text-muted-foreground">Tap a step to see what happens</p>}
    </div>
  );
}
