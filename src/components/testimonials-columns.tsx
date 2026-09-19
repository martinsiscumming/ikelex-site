import { motion } from "motion/react";
import { Quote } from "lucide-react";

export type TestimonialItem = { id: string; text: string; name: string; role: string };

const initialsOf = (name: string) => name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("") || "?";

function Column({ items, duration, className = "" }: { items: TestimonialItem[]; duration: number; className?: string }) {
  if (!items.length) return null;
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        animate={{ y: ["0%", "-50%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
        className="flex flex-col gap-5"
      >
        {[...items, ...items].map((item, index) => (
          <article key={`${item.id}-${index}`} className="border border-border bg-card p-6 shadow-[var(--shadow-nav)]">
            <Quote className="size-6 text-primary" />
            <p className="mt-4 text-sm leading-6 text-muted-foreground">&ldquo;{item.text}&rdquo;</p>
            <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold uppercase text-primary">{initialsOf(item.name)}</span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{item.name}</p>
                <p className="truncate text-xs text-muted-foreground">{item.role}</p>
              </div>
            </div>
          </article>
        ))}
      </motion.div>
    </div>
  );
}

/** An animated columns-of-testimonials section, fed by real published reviews. */
export function TestimonialsColumns({ items }: { items: TestimonialItem[] }) {
  if (!items.length) return null;
  const columnCount = items.length >= 6 ? 3 : items.length >= 3 ? 2 : 1;
  const columns: TestimonialItem[][] = Array.from({ length: columnCount }, (_, columnIndex) => items.filter((_, itemIndex) => itemIndex % columnCount === columnIndex));
  const durations = [26, 32, 29];
  const visibility = ["", "hidden md:block", "hidden lg:block"];
  return (
    <div
      className="mt-16 grid gap-5 [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]"
      style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`, maxHeight: 640 }}
    >
      {columns.map((column, index) => (
        <Column key={index} items={column} duration={durations[index % durations.length] ?? 28} className={visibility[index] ?? ""} />
      ))}
    </div>
  );
}
