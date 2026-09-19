import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowUpRight, Check, Compass, Hammer, ListChecks, Quote, Rocket } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Reveal, SectionHeading } from "@/components/ikelex";
import { CounterAnimation } from "@/components/animation-primitives";
import { TestimonialsColumns } from "@/components/testimonials-columns";
import { RadialOrbitalTimeline } from "@/components/radial-orbital-timeline";
import { processSteps, services } from "@/lib/site-data";
import { getPublicContent } from "@/lib/public-content.functions";
import core from "@/assets/digital-core.jpg";
import hotel from "@/assets/hotel-platform.jpg";
import qrMenu from "@/assets/qr-menu.jpg";

const processIcons = [Compass, ListChecks, Hammer, Rocket];
const processDescriptions = [
  "We understand your business, your workflow and what a good outcome looks like before anything is built.",
  "We define scope, structure and the right technology approach so the work stays focused and predictable.",
  "We design and build the solution, keeping you involved as it takes shape.",
  "We launch the finished solution and stay available for support as your business keeps moving.",
];
const processNodes = processSteps.map((step, index) => ({ id: step, step: `Step 0${index + 1}`, title: step, description: processDescriptions[index] ?? "A focused phase that turns business context into a tested, usable result.", icon: processIcons[index % processIcons.length] ?? Compass }));

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  loader: () => getPublicContent(),
  head: () => ({ meta: [
    { title: "Ikelex Technology — Digital Solutions That Move Business Forward" },
    { name: "description", content: "Ikelex Technology builds software, digital products, business systems, branding solutions and IT infrastructure." },
    { property: "og:title", content: "Ikelex Technology — Digital Solutions" },
    { property: "og:description", content: "Practical software and technology built around real business needs." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  const { reviews, images } = Route.useLoaderData();
  const siteImage = (key: string, fallbackSrc: string, fallbackAlt: string) => { const match = images.find((item) => item.image_key === key && item.url); return { src: match?.url ?? fallbackSrc, alt: match?.alt_text || fallbackAlt }; };
  const heroImage = siteImage("home-hero", core, "Connected digital business systems");
  const softwareImage = siteImage("home-software", hotel, "Hotel management, POS and inventory dashboard");
  const qrImage = siteImage("home-qr-menu", qrMenu, "QR digital menu experience");
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const coreScale = useTransform(scrollYProgress, [0, 1], [1, .82]);
  return <div>
    <section ref={heroRef} className="relative min-h-[94svh] overflow-hidden bg-ikelex-navy-2 pt-32">
      <div className="absolute inset-0 ikelex-grid opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <div className="absolute left-[8%] top-28 h-px w-28 origin-left animate-[pulse-line_3s_ease-in-out_infinite] bg-ikelex-red" />
      <div className="relative mx-auto grid min-h-[78svh] max-w-7xl items-center gap-10 px-6 lg:grid-cols-[1.1fr_.9fr]">
        <motion.div style={{ y: heroY }} className="relative z-10 pb-12">
          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.7}} className="mb-7 text-xs font-bold uppercase text-accent">Software · Systems · Digital Infrastructure</motion.p>
          <h1 className="text-balance font-display text-[clamp(3.3rem,7vw,7.8rem)] font-semibold uppercase leading-[.85]">{["Building digital", "solutions that move", "businesses forward."].map((line,i)=><motion.span key={line} initial={{opacity:0,y:70}} animate={{opacity:1,y:0}} transition={{duration:.8,delay:.12+i*.12,ease:[.22,1,.36,1]}} className={`block ${i===2?"text-primary":""}`}>{line}</motion.span>)}</h1>
          <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.6}} className="mt-8 max-w-xl text-base leading-8 text-muted-foreground">Ikelex Technology builds software, digital products, business management systems, branding solutions and IT infrastructure that help businesses operate smarter, serve customers better and grow.</motion.p>
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.75}} className="mt-9 flex flex-wrap gap-3"><Button variant="cinematic" size="lg" asChild><Link to="/services">Explore our services <ArrowUpRight /></Link></Button><Button variant="moving" size="lg" asChild><Link to="/contact">Let's talk</Link></Button></motion.div>
        </motion.div>
        <motion.div style={{ scale: coreScale }} initial={{opacity:0,scale:.75}} animate={{opacity:1,scale:1}} transition={{duration:1.2,delay:.3}} className="relative mx-auto aspect-square w-full max-w-[590px] overflow-hidden rounded-full shadow-[var(--ikelex-glow)]"><img src={heroImage.src} alt={heroImage.alt} className="h-full w-full object-cover"/><div className="absolute inset-8 animate-[orbit_18s_linear_infinite] rounded-full border border-accent/30"/><div className="absolute inset-20 animate-[orbit-reverse_12s_linear_infinite] rounded-full border border-primary/30"/></motion.div>
      </div><ArrowDown className="absolute bottom-7 left-1/2 size-5 -translate-x-1/2 animate-bounce text-accent" />
    </section>

    <section className="relative min-h-screen overflow-hidden bg-ikelex-white text-ikelex-navy-2"><div className="sticky top-0 flex min-h-screen items-center px-6"><div className="mx-auto max-w-7xl"><p className="mb-8 text-xs font-bold uppercase text-ikelex-blue">A clearer operating system</p><h2 className="max-w-6xl font-display text-[clamp(3.6rem,9vw,9rem)] font-semibold uppercase leading-[.86]">Technology should make <span className="text-ikelex-blue-bright">business simpler.</span></h2><p className="mt-9 max-w-xl text-lg leading-8 text-ikelex-navy/70">We remove friction, connect workflows and create digital experiences people can use with confidence.</p></div></div></section>

    <section className="border-y border-border bg-surface-soft py-16"><div className="mx-auto grid max-w-7xl gap-px bg-border px-6 md:grid-cols-3">{[{value:10,suffix:"+",label:"Years of technology & IT solutions"},{value:100,suffix:"%",label:"Client-focused solutions"},{value:7,suffix:"+",label:"Business technology services"}].map((stat)=><Reveal key={stat.label} className="bg-surface-soft px-6 py-9"><CounterAnimation value={stat.value} suffix={stat.suffix} className="text-5xl font-semibold text-primary sm:text-6xl"/><p className="mt-4 max-w-xs text-sm font-semibold uppercase leading-6 text-foreground">{stat.label}</p></Reveal>)}</div></section>

    <section className="bg-background py-28"><div className="mx-auto max-w-7xl px-6"><SectionHeading eyebrow="Built around the work" title="We build around real business needs." /><div className="mt-20 grid gap-5 lg:grid-cols-2">{["Software","Automation","Digital experience","IT infrastructure"].map((x,i)=><Reveal key={x} delay={i*.08} className={`group relative min-h-64 overflow-hidden border border-border bg-card p-8 ${i===0||i===3?"lg:col-span-2":""}`}><span className="text-xs text-accent">0{i+1}</span><h3 className="mt-20 text-3xl font-semibold uppercase sm:text-5xl">{x}</h3><div className="absolute -bottom-20 -right-16 size-64 rounded-full border border-primary/30 transition-transform duration-700 group-hover:-translate-x-10 group-hover:-translate-y-10"/></Reveal>)}</div></div></section>

    <section className="border-y border-border bg-ikelex-navy py-28"><div className="mx-auto max-w-7xl px-6"><SectionHeading eyebrow="Capabilities" title="What we build" copy="A connected capability set spanning products, operations, identity, growth and infrastructure."/><div className="mt-16 grid auto-rows-[230px] gap-4 md:grid-cols-2 lg:grid-cols-4">{services.map((service,i)=>{const Icon=service.icon; return <Reveal key={service.slug} delay={i*.04} className={`${i===0||i===3?"md:col-span-2":""} ${i===0?"md:row-span-2":""}`}><Link to="/services/$slug" params={{slug:service.slug}} className="group relative flex h-full flex-col justify-between overflow-hidden border border-border bg-card p-7 transition-all duration-500 hover:-translate-y-2 hover:border-primary hover:shadow-[var(--ikelex-glow)]"><Icon className="size-7 text-accent transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"/><div><h3 className="max-w-md text-2xl font-semibold uppercase">{service.title}</h3><p className="mt-3 translate-y-3 text-sm leading-6 text-muted-foreground opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">{service.short}</p></div><ArrowUpRight className="absolute right-6 top-6 size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent"/></Link></Reveal>})}</div></div></section>

    <Showcase image={softwareImage.src} imageAlt={softwareImage.alt} eyebrow="Featured software" title="Hotel management, POS & inventory. One connected view." copy="Bookings, billing, inventory and daily operations come together in a clear, practical system." />
    <Showcase image={qrImage.src} imageAlt={qrImage.alt} eyebrow="QR digital menu" title="Turn any menu into a digital experience." copy="Move from printed menus to a responsive digital experience that is easy to update, browse and share." reverse />

    <section className="bg-ikelex-white py-28 text-ikelex-navy-2"><div className="mx-auto max-w-7xl px-6"><p className="text-xs font-bold uppercase text-ikelex-blue">Why Ikelex</p><div className="mt-10 grid gap-8 lg:grid-cols-[1.25fr_.75fr]"><h2 className="text-balance text-5xl font-semibold uppercase leading-[.95] sm:text-7xl">Technology with a reason to exist.</h2><p className="max-w-lg text-lg leading-8 text-ikelex-navy/70">Every decision connects to how a business works, how customers experience it and what creates lasting value.</p></div><div className="mt-20 divide-y divide-ikelex-navy/15 border-y border-ikelex-navy/15">{["Business-first solutions","Practical technology","Design + function","Long-term value"].map((x,i)=><Reveal key={x} className="grid items-center gap-4 py-8 sm:grid-cols-[80px_1fr_auto]"><span className="text-sm text-ikelex-blue">0{i+1}</span><h3 className="text-3xl font-semibold uppercase sm:text-5xl">{x}</h3><Check className="size-6 text-ikelex-blue"/></Reveal>)}</div></div></section>

    <section className="py-28"><div className="mx-auto max-w-7xl px-6"><SectionHeading eyebrow="Process" title="From idea to implementation" copy="Tap a step to see what happens along the way."/><Reveal className="mt-16"><RadialOrbitalTimeline nodes={processNodes}/></Reveal></div></section>

    <section className="overflow-hidden border-y border-border py-8"><div className="flex w-max animate-[marquee_28s_linear_infinite] gap-12 text-2xl font-semibold uppercase text-muted-foreground">{[...services,...services].map((s,i)=><span key={`${s.slug}-${i}`} className="flex items-center gap-12"><span>{s.title}</span><span className="size-2 rounded-full bg-ikelex-red"/></span>)}</div></section>

    <section className="bg-ikelex-navy py-28"><div className="mx-auto max-w-7xl px-6"><SectionHeading eyebrow="Real customer reviews" title="Earned trust belongs here." copy="Only reviews added and published by Ikelex appear in this space."/>{reviews.length ? <TestimonialsColumns items={reviews.map((review) => ({ id: review.id, text: review.review, name: review.customer_name, role: [review.company, review.service].filter(Boolean).join(" · ") || (review.verified ? "Verified customer" : "Customer") }))}/> : <div className="mt-16 grid gap-10 border border-border bg-card p-8 md:grid-cols-[1fr_auto] md:p-12"><div><Quote className="size-10 text-primary"/><h3 className="mt-12 max-w-2xl text-3xl font-medium leading-tight sm:text-5xl">No customer reviews have been published yet.</h3><p className="mt-6 text-muted-foreground">This space is reserved for genuine customer experiences—never placeholders.</p></div><div className="flex size-40 items-center justify-center rounded-full border border-dashed border-primary/50 text-center text-xs font-bold uppercase text-accent">Admin<br/>managed</div></div>}</div></section>

  </div>;
}

function Showcase({ image, imageAlt, eyebrow, title, copy, reverse=false }: { image:string; imageAlt?:string; eyebrow:string; title:string; copy:string; reverse?:boolean }) { return <section className="overflow-hidden py-28"><div className={`mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 ${reverse?"lg:[&>*:first-child]:order-2":""}`}><Reveal className="relative"><div className="absolute -inset-5 border border-primary/20"/><img src={image} alt={imageAlt || title} loading="lazy" className="relative aspect-[4/3] w-full object-cover shadow-[var(--ikelex-glow)]"/></Reveal><SectionHeading eyebrow={eyebrow} title={title} copy={copy}/></div></section> }
