import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const easing = [0.22, 1, 0.36, 1] as const;
type RevealProps = { children: ReactNode; className?: string; delay?: number };

function MotionReveal({ children, className, delay = 0, x = 0, y = 28, scale = 1, blur = 0 }: RevealProps & { x?: number; y?: number; scale?: number; blur?: number }) {
  return <motion.div initial={{ opacity: 0, x, y, scale, filter: blur ? `blur(${blur}px)` : "blur(0px)" }} whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }} viewport={{ once: true, amount: .18 }} transition={{ duration: .72, delay, ease: easing }} className={className}>{children}</motion.div>;
}
export const FadeIn = (props: RevealProps) => <MotionReveal {...props} y={0}/>;
export const SlideUp = (props: RevealProps) => <MotionReveal {...props}/>;
export const SlideLeft = (props: RevealProps) => <MotionReveal {...props} x={-38} y={0}/>;
export const SlideRight = (props: RevealProps) => <MotionReveal {...props} x={38} y={0}/>;
export const ScaleReveal = (props: RevealProps) => <MotionReveal {...props} y={0} scale={.96}/>;
export const BlurReveal = (props: RevealProps) => <MotionReveal {...props} blur={12}/>;

export function StaggerChildren({ children, className }: Omit<RevealProps, "delay">) {
  return <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: .15 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: .08 } } }} className={className}>{children}</motion.div>;
}
export function StaggerItem({ children, className }: Omit<RevealProps, "delay">) {
  return <motion.div variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: .65, ease: easing } } }} className={className}>{children}</motion.div>;
}
export function TextReveal({ children, className }: Omit<RevealProps, "delay">) {
  return <span className={cn("inline-block overflow-hidden", className)}><motion.span className="inline-block" initial={{ y: "105%", opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: .8, ease: easing }}>{children}</motion.span></span>;
}
export function ParallaxImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null); const prefersReduced = useReducedMotion(); const [reduced, setReduced] = useState(false);
  useEffect(() => setReduced(Boolean(prefersReduced)), [prefersReduced]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-28, 28]);
  return <div ref={ref} className={cn("overflow-hidden", className)}><motion.img src={src} alt={alt} loading="lazy" style={{ y }} className="h-[112%] w-full object-cover"/></div>;
}
export function CounterAnimation({ value, suffix = "", className }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null); const [shown, setShown] = useState(0); const reduced = useReducedMotion();
  useEffect(() => { const node = ref.current; if (!node) return; const observer = new IntersectionObserver(([entry]) => { if (!entry?.isIntersecting) return; if (reduced) setShown(value); else { const start = performance.now(); const tick = (now: number) => { const p = Math.min((now - start) / 1100, 1); setShown(Math.round(value * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); } observer.disconnect(); }, { threshold: .5 }); observer.observe(node); return () => observer.disconnect(); }, [value, reduced]);
  return <span ref={ref} className={className}>{shown}{suffix}</span>;
}
export function MagneticButton({ children, className }: { children: ReactNode; className?: string }) {
  const x = useMotionValue(0); const y = useMotionValue(0); const reduced = useReducedMotion();
  const sx = useSpring(x, { stiffness: 230, damping: 18 }); const sy = useSpring(y, { stiffness: 230, damping: 18 });
  const move = (event: MouseEvent<HTMLDivElement>) => { if (reduced) return; const r = event.currentTarget.getBoundingClientRect(); x.set((event.clientX - r.left - r.width / 2) * .16); y.set((event.clientY - r.top - r.height / 2) * .16); };
  return <motion.div style={{ x: sx, y: sy }} onMouseMove={move} onMouseLeave={() => { x.set(0); y.set(0); }} className={cn("inline-flex", className)}>{children}</motion.div>;
}
export function HoverCard({ children, className }: Omit<RevealProps, "delay">) { return <motion.div whileHover={{ y: -6 }} transition={{ duration: .28, ease: easing }} className={className}>{children}</motion.div>; }
export function PageTransition({ children }: { children: ReactNode }) { return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .45 }}>{children}</motion.div>; }
export function ScrollProgress() { const { scrollYProgress } = useScroll(); const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25, restDelta: .001 }); return <motion.div aria-hidden style={{ scaleX }} className="fixed inset-x-0 top-0 z-[80] h-0.5 origin-left bg-primary"/>; }
