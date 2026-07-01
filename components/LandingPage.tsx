'use client';

import React, { useState, useEffect, useRef, useMemo, createContext, useContext } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import type { MotionValue } from 'motion/react';
import Lenis from 'lenis';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Shield,
  Cpu,
  Database,
  Workflow,
  Mic,
  Video,
  Terminal,
  Server,
  Star,
  Briefcase,
  Layers3,
  CheckCircle2,
  ShieldAlert,
  Zap,
  RefreshCw,
  Volume2
} from 'lucide-react';

// ─── Clip-path helpers ────────────────────────────────────────────────────────

const diagonalClipStyle = {
  clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)'
};
const diagonalClipSubtleStyle = {
  clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)'
};
const diagonalClipHeroStyle = {
  clipPath: 'polygon(40px 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%, 0 40px)'
};

// ─── Decorative pixel-cluster motifs ──────────────────────────────────────────
// Sharp, flat-colored voxel/pixel clusters bleeding off section edges —
// reused across the whole page (not just the hero), each instance in a
// different rotating color pair.

function seededRandom(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

type PixelCell = { x: number; y: number; color: string };

function makeBlobCells(seed: number, w: number, h: number, colors: string[]): PixelCell[] {
  const rand = seededRandom(seed);
  const cx = w / 2, cy = h / 2, maxR = Math.min(w, h) / 2;
  const cells: PixelCell[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const d = Math.hypot(x - cx, y - cy) / maxR;
      const noise = rand() * 0.4;
      if (d + noise < 0.9 && rand() > 0.15) {
        cells.push({ x, y, color: colors[Math.floor(rand() * colors.length)] });
      }
    }
  }
  return cells;
}

function makeScatterCells(seed: number, w: number, h: number, colors: string[], density = 0.14): PixelCell[] {
  const rand = seededRandom(seed);
  const cells: PixelCell[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (rand() < density) cells.push({ x, y, color: colors[Math.floor(rand() * colors.length)] });
    }
  }
  return cells;
}

const PixelCluster = ({
  cells,
  cell = 52,
  className = '',
}: {
  cells: PixelCell[];
  cell?: number;
  className?: string;
}) => (
  <div aria-hidden className={`absolute pointer-events-none ${className}`}>
    {cells.map((c, i) => (
      <div
        key={i}
        className={`absolute rounded-[4px] ${c.color}`}
        style={{ left: c.x * cell, top: c.y * cell, width: cell - 5, height: cell - 5 }}
      />
    ))}
  </div>
);

const ConfettiStripe = ({ className = '' }: { className?: string }) => {
  const segs = ['bg-steel', 'bg-ink', 'bg-rose-deep', 'bg-olive-deep', 'bg-violet-deep', 'bg-amber'];
  return (
    <div aria-hidden className={`w-full h-2.5 flex ${className}`}>
      {Array.from({ length: 28 }).map((_, i) => (
        <div key={i} className={`flex-1 ${segs[i % segs.length]}`} />
      ))}
    </div>
  );
};

// Aurora — dark wine-magenta base, matching the reference composition: a
// bright pink bloom dominating the top-left/center, a pink beam streaking
// down the middle, and a lime-yellow glow entering from the right edge.
const Aurora = () => (
  <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-wine" />
    <div className="absolute -top-1/3 -left-1/5 w-[950px] h-[950px] rounded-full bg-rose blur-[100px]" />
    <div className="absolute top-0 left-1/3 w-[520px] h-[1150px] bg-gradient-to-b from-rose via-rose/70 to-transparent blur-[65px] rotate-6" />
    <div className="absolute top-1/4 right-0 w-[700px] h-[950px] bg-gradient-to-l from-olive/90 via-olive/30 to-transparent blur-[90px]" />
    <div className="absolute inset-0 bg-stars opacity-45" />
    {/* Thick-glass depth — a dark vignette + soft top sheen so the aurora
        reads like tinted glass rather than a flat color fill. */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(15,4,11,0.55)_100%)]" />
    <div className="absolute inset-0 bg-gradient-to-b from-cream/10 via-transparent to-black/25" />
  </div>
);

// ─── Scroll-driven animation system ──────────────────────────────────────────

// Context: each SectionReveal broadcasts its scrollYProgress so nested
// WordReveal components can synchronise to the same progress value.
const ScrollProgressContext = createContext<MotionValue<number> | null>(null);

/**
 * Word — one word in the text scrub.
 * Kept as a separate component so hooks are called at component level.
 */
const Word = ({
  word,
  index,
  total,
  scrollYProgress,
}: {
  word: string;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) => {
  // Words cascade across the first 70% of the section's entry progress.
  // High overlap (0.82) creates a rapid, staggered flash feel.
  const revealSpan = 0.70;
  const wordStart = (index / total) * revealSpan * 0.82;
  const wordEnd   = wordStart + revealSpan / total;

  const opacity = useTransform(scrollYProgress, [wordStart, wordEnd], [0.07, 1]);
  const y       = useTransform(scrollYProgress, [wordStart, wordEnd], [18, 0]);

  return (
    <motion.span className="inline-block mr-[0.28em] last:mr-0" style={{ opacity, y }}>
      {word}
    </motion.span>
  );
};

/**
 * WordReveal — wraps a heading string and reveals each word as the parent
 * section scrolls into view.  Reads scrollYProgress from context.
 */
const WordReveal = ({ text, className = '' }: { text: string; className?: string }) => {
  const scrollYProgress = useContext(ScrollProgressContext);
  const words = text.split(' ');

  if (!scrollYProgress) return <>{text}</>;

  return (
    <>
      {words.map((word, i) => (
        <Word
          key={i}
          word={word}
          index={i}
          total={words.length}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </>
  );
};

/**
 * SectionReveal — wraps a page section with the scroll-driven layout zoom:
 *   scale  0.93 → 1.00
 *   radius 32px → 0px
 *   opacity  0.55 → 1.00
 *
 * Also provides scrollYProgress via context for nested WordReveal components.
 */
const SectionReveal = ({
  children,
  id,
  className = '',
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 0.1'],
  });

  const scale        = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const opacity      = useTransform(scrollYProgress, [0, 0.4], [0.55, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 0.75, 1], [48, 12, 0]);

  return (
    <ScrollProgressContext.Provider value={scrollYProgress}>
      {/* Outer div carries the section background + border — stays fixed in layout */}
      <div ref={ref} id={id} className={className}>
        {/* Inner motion.div scales the content only; the section frame never moves */}
        <motion.div
          style={{
            scale,
            opacity,
            borderRadius,
            transformOrigin: 'top center',
            willChange: 'transform, opacity',
          }}
        >
          {children}
        </motion.div>
      </div>
    </ScrollProgressContext.Provider>
  );
};

// ─── LandingPage component ────────────────────────────────────────────────────

export default function LandingPage() {
  // Navigation states
  const [activeNav, setActiveNav] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);

  // Interactive section states
  const [activeShiftTab, setActiveShiftTab] = useState<'trends' | 'stats' | 'overview'>('trends');
  const [hoveredEcoId, setHoveredEcoId] = useState<string | null>(null);
  const [activeCoreTab, setActiveCoreTab] = useState<'llm' | 'agents' | 'rag' | 'automation'>('llm');
  const [selectedSolution, setSelectedSolution] = useState<string>('voice');
  const [activeIndustry, setActiveIndustry] = useState<string>('finance');
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);

  // Hero simulator states
  const [heroPromptInput, setHeroPromptInput] = useState('Build a localized routing & synthetic safety firewall for customer queries');
  const [heroSimulatedLogs, setHeroSimulatedLogs] = useState<string[]>(['System standby. Awaiting architecture query...']);
  const [isHeroSimulating, setIsHeroSimulating] = useState(false);
  const [heroSimProgress, setHeroSimProgress] = useState(0);

  // Email CTA
  const [email, setEmail] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState(false);

  // ── Lenis smooth scroll ─────────────────────────────────────────────────────
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.35,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.88,
      touchMultiplier: 2,
    } as any);

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // ── Scroll spy ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
      const sections = ['hero', 'shift', 'ecosystem', 'core', 'solutions', 'enterprise', 'pricing', 'results'];
      const scrollPosition = window.scrollY + 300;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) setActiveNav(section);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Hero simulation ─────────────────────────────────────────────────────────
  const runHeroSimulation = () => {
    if (isHeroSimulating) return;
    setIsHeroSimulating(true);
    setHeroSimProgress(0);
    setHeroSimulatedLogs(['Parsing request parameters...']);

    const steps = [
      { progress: 20, log: 'Initiating cognitive parsing... Tokenizing target prompt.' },
      { progress: 40, log: 'Analyzing sovereign infrastructure capabilities... Matching models.' },
      { progress: 60, log: 'RAG Pipeline configured. Initializing hybrid vector search on VPC.' },
      { progress: 85, log: 'Embedding real-time PII redaction rules & active guardrails.' },
      { progress: 100, log: 'System deployed! Average response latency: 14ms. SOC-2 Validated.' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setHeroSimProgress(steps[currentStep].progress);
        setHeroSimulatedLogs(prev => [...prev, steps[currentStep].log]);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsHeroSimulating(false);
      }
    }, 1000);
  };

  // ── Decorative pixel-cluster memoization ────────────────────────────────────
  // Rotating color pairs pulled from the moderate maroon/amber/rose/violet/
  // mint/olive/steel palette — a different combination at each placement.
  const heroBlobTL      = useMemo(() => makeBlobCells(7, 9, 8, ['bg-amber', 'bg-maroon-deep']), []);
  const heroScatterTR   = useMemo(() => makeScatterCells(21, 9, 7, ['bg-rose', 'bg-violet-deep'], 0.18), []);
  const heroScatterBL   = useMemo(() => makeScatterCells(31, 8, 6, ['bg-mint', 'bg-olive-deep'], 0.2), []);
  const heroScatterBR   = useMemo(() => makeScatterCells(35, 7, 6, ['bg-steel', 'bg-maroon-deep'], 0.18), []);
  const shiftMascot      = useMemo(() => makeBlobCells(41, 7, 6, ['bg-olive', 'bg-mint']), []);
  const shiftClusterB    = useMemo(() => makeScatterCells(43, 7, 6, ['bg-olive', 'bg-rose-deep'], 0.18), []);
  const ecoClusterA      = useMemo(() => makeScatterCells(33, 8, 6, ['bg-violet', 'bg-rose-deep'], 0.18), []);
  const ecoClusterB      = useMemo(() => makeScatterCells(38, 7, 6, ['bg-olive', 'bg-mint-deep'], 0.18), []);
  const ecoClusterC      = useMemo(() => makeScatterCells(39, 7, 6, ['bg-steel', 'bg-amber-deep'], 0.18), []);
  const ecoClusterD      = useMemo(() => makeScatterCells(41, 7, 6, ['bg-rose', 'bg-steel-deep'], 0.18), []);
  const coreClusterA     = useMemo(() => makeBlobCells(44, 8, 7, ['bg-mint', 'bg-rose-deep']), []);
  const coreClusterB     = useMemo(() => makeScatterCells(46, 7, 6, ['bg-steel', 'bg-olive-deep'], 0.18), []);
  const coreClusterC     = useMemo(() => makeScatterCells(47, 6, 6, ['bg-violet', 'bg-amber-deep'], 0.18), []);
  const coreClusterD     = useMemo(() => makeScatterCells(50, 6, 6, ['bg-amber', 'bg-rose-deep'], 0.18), []);
  const solutionsCluster = useMemo(() => makeScatterCells(49, 8, 6, ['bg-amber', 'bg-violet-deep'], 0.18), []);
  const solutionsClusterB = useMemo(() => makeScatterCells(51, 7, 6, ['bg-mint', 'bg-maroon-deep'], 0.18), []);
  const solutionsClusterC = useMemo(() => makeScatterCells(59, 6, 6, ['bg-steel', 'bg-olive-deep'], 0.18), []);
  const enterpriseA      = useMemo(() => makeScatterCells(48, 8, 8, ['bg-mint', 'bg-steel'], 0.16), []);
  const enterpriseB      = useMemo(() => makeScatterCells(52, 7, 6, ['bg-rose', 'bg-maroon-deep'], 0.18), []);
  const enterpriseC      = useMemo(() => makeScatterCells(53, 6, 6, ['bg-amber', 'bg-violet-deep'], 0.18), []);
  const ctaBlobLeft      = useMemo(() => makeBlobCells(55, 7, 9, ['bg-steel', 'bg-mint-deep']), []);
  const ctaBlobRight     = useMemo(() => makeBlobCells(64, 7, 9, ['bg-rose', 'bg-violet-deep']), []);
  const resultsCluster   = useMemo(() => makeScatterCells(66, 7, 6, ['bg-olive', 'bg-rose-deep'], 0.18), []);
  const footerClusterA   = useMemo(() => makeScatterCells(72, 7, 6, ['bg-amber', 'bg-olive-deep'], 0.2), []);
  const footerClusterB   = useMemo(() => makeScatterCells(76, 7, 6, ['bg-violet', 'bg-steel-deep'], 0.18), []);
  const footerClusterC   = useMemo(() => makeScatterCells(78, 6, 6, ['bg-mint', 'bg-amber-deep'], 0.18), []);

  // ── Content constants ───────────────────────────────────────────────────────

  const shiftStats = [
    { value: '315%', label: 'Growth in custom AI workloads' },
    { value: '82%', label: 'Organizations adopting custom model pipelines' },
    { value: '14ms', label: 'Average model response latency' },
    { value: '10x', label: 'Throughput gain using automated task loops' }
  ];

  const executiveOverviewPoints = [
    {
      title: 'Unified AI Platforms',
      text: 'Avoid scattered APIs. Fixl AI builds unified systems that coordinate models, internal databases, and private servers under a single, secure control panel.'
    },
    {
      title: 'Automated Task Workflows',
      text: 'Move beyond basic chatbots. Modern systems use multi-step automated workflows to execute actions, retrieve information, and integrate with backend systems.'
    },
    {
      title: 'Data Privacy & Governance',
      text: 'Enterprise AI requires clear boundaries. We ensure complete database isolation, private server deployment options, and strict compliance with your internal standards.'
    }
  ];

  const ecosystemCards = [
    { id: 'eco-llm', icon: <Cpu className="w-5 h-5" />, category: 'Models', title: 'Model Integration', description: 'Integrate leading large language models with your custom guidelines and system rules.', metric: '99.4%', metricLabel: 'Task Accuracy' },
    { id: 'eco-agent', icon: <Workflow className="w-5 h-5" />, category: 'Workflows', title: 'Custom Automations', description: 'Multi-step automated workflows that execute tasks and connect systems under human oversight.', metric: '18x', metricLabel: 'Speed Increase' },
    { id: 'eco-rag', icon: <Database className="w-5 h-5" />, category: 'Search', title: 'Internal Databases', description: 'Custom internal search databases connected directly to your existing documentation.', metric: '< 120ms', metricLabel: 'Search Latency' },
    { id: 'eco-auto', icon: <Layers3 className="w-5 h-5" />, category: 'Operations', title: 'Workflow Efficiency', description: 'Workflow automation for back-office tasks, document reviews, and internal tickets.', metric: '-82%', metricLabel: 'Cost Reduction' },
    { id: 'eco-voice', icon: <Mic className="w-5 h-5 text-steel" />, category: 'Voice', title: 'Voice AI Integration', description: 'Voice integration with fast response times and clear natural language routing.', metric: '320ms', metricLabel: 'Response Delay' },
    { id: 'eco-multi', icon: <Video className="w-5 h-5 text-rose-deep" />, category: 'Files', title: 'Document Parsing', description: 'Extract data from complex PDF files, charts, legacy scanned documents, and forms.', metric: '99.2%', metricLabel: 'Extraction Rate' },
    { id: 'eco-dev', icon: <Terminal className="w-5 h-5 text-olive-deep" />, category: 'Training', title: 'Custom Fine-Tuning', description: 'Model fine-tuning and hosting specialized on your private terminology.', metric: 'Bespoke', metricLabel: 'Term Customization' },
    { id: 'eco-consult', icon: <Briefcase className="w-5 h-5 text-violet-deep" />, category: 'Architecture', title: 'Engineering Plans', description: 'System architecture reviews, feasibility studies, and functional software prototyping.', metric: 'SOC-2', metricLabel: 'Ready Design' },
    { id: 'eco-mlops', icon: <Server className="w-5 h-5 text-steel" />, category: 'Ops', title: 'Model Monitoring', description: 'Automatic model version tracking, health monitoring, and system uptime scaling.', metric: '99.99%', metricLabel: 'Uptime SLA' },
    { id: 'eco-sec', icon: <Shield className="w-5 h-5 text-maroon" />, category: 'Privacy', title: 'Data Security', description: 'Direct guardrails, secure networks, and strict data privacy compliance checks.', metric: 'Active', metricLabel: 'Security Shield' }
  ];

  // Top 4 cards render as a gallery row of flat gradient cards; the
  // remaining 6 sit in a calmer 2-column grid with a couple of color pops.
  const galleryColors = [
    { grad: 'from-amber to-maroon-deep' },
    { grad: 'from-rose to-violet-deep' },
    { grad: 'from-mint to-steel-deep' },
    { grad: 'from-violet to-rose-deep' },
  ];
  const gridCardAccents = ['bg-cream', 'bg-mint/25', 'bg-cream', 'bg-amber/25', 'bg-cream', 'bg-violet/22'];

  const solutionsData: Record<string, {
    title: string;
    description: string;
    visualLabel: string;
    stats: { value: string; label: string }[];
    features: string[];
    tag: string;
  }> = {
    voice: {
      tag: 'Voice AI, Global',
      title: 'Cognitive Voice AI Systems',
      description: 'Our conversational engines operate at sub-second speeds. These are fully authorized inbound and outbound operators capable of complex live CRM updates and semantic call flow transitions.',
      visualLabel: 'Voice Stream Matrix',
      stats: [{ value: '310ms', label: 'Mean response delay' }, { value: '42%', label: 'Cost savings' }, { value: '98.5%', label: 'CSAT sentiment' }],
      features: ['Inbound concierge scaling', 'Dynamic API execution mid-sentence', 'Multilingual fluid dialect', 'Sentiment tracking logs']
    },
    multimodal: {
      tag: 'Vision Tech, US',
      title: 'Sovereign Multimodal Visual Engines',
      description: 'Process unstructured multi-source files. Our vision pipelines interpret visual charts, complex technical engineering schematics, handwritten ledgers, and video security records with high structural output.',
      visualLabel: 'Visual Processing Node',
      stats: [{ value: '99.2%', label: 'OCR recognition' }, { value: '8x', label: 'Faster extraction' }, { value: 'Zero', label: 'Data leakage' }],
      features: ['Contextual chart interpretation', 'Video security logging', 'High-density PDF schematic parsing', 'Product visual anomaly analysis']
    },
    development: {
      tag: 'Core ML, Europe',
      title: 'Custom AI Orchestration & Tuning',
      description: 'We curate proprietary training sets, execute domain-specific model fine-tuning, implement efficient quantization paths, and launch secure model API endpoints customized purely to your legacy infrastructure.',
      visualLabel: 'Fine-Tuning Playground',
      stats: [{ value: '32b/70b', label: 'Optimized models' }, { value: '99.98%', label: 'Alignment rating' }, { value: '-72%', label: 'Host size reduction' }],
      features: ['Direct LoRA / QLoRA tuning', 'Synthetic data augmentation', 'High-throughput MLOps clusters', 'Continuous model regression tracking']
    },
    consulting: {
      tag: 'Advisory, UK',
      title: 'Strategic Architecture & PoC Formulation',
      description: 'Accelerate the timeline from abstract whiteboard brainstorming to active production code. Our principal architects guide your core staff on security, governance compliance, custom stack selections, and return audits.',
      visualLabel: 'Governance Advisory Log',
      stats: [{ value: '3-Week', label: 'Working prototype' }, { value: '100%', label: 'SOC-2 compliant' }, { value: 'Model', label: 'Agnostic strategy' }],
      features: ['Enterprise-grade feasibility reports', 'Compute and API cost projections', 'Regulatory impact mitigation plans', 'Developer upskilling bootcamps']
    }
  };
  // Each solution gets its own accent, deliberately different from the
  // cream panel it sits inside (see section 5 below).
  const solutionAccent: Record<string, { grad: string; chip: string; hoverGrad: string }> = {
    voice: { grad: 'from-amber to-maroon-deep', chip: 'bg-maroon-deep', hoverGrad: 'hover:from-amber hover:to-maroon-deep' },
    multimodal: { grad: 'from-steel to-steel-deep', chip: 'bg-steel-deep', hoverGrad: 'hover:from-steel hover:to-steel-deep' },
    development: { grad: 'from-olive to-olive-deep', chip: 'bg-olive-deep', hoverGrad: 'hover:from-olive hover:to-olive-deep' },
    consulting: { grad: 'from-rose to-violet-deep', chip: 'bg-violet-deep', hoverGrad: 'hover:from-rose hover:to-violet-deep' },
  };

  const industryCards = [
    { id: 'healthcare', title: 'Healthcare & Life Sciences', metric: '-80% Doc Time', text: 'Secure document semantic lookup, automated clinical trial cohort matching, and privacy-first HIPAA compliant diagnostic assistant models.' },
    { id: 'finance', title: 'Financial Services & Capital Markets', metric: '99.8% Coherence', text: 'Sub-second portfolio asset query agents, multi-agent credit modeling networks, and deep regulatory audit text parsers.' },
    { id: 'retail', title: 'Retail & Global Commerce', metric: '4.1x ROAS Yield', text: 'Hyper-personalized product recommendation swarms, dynamic voice checkout helpers, and visual catalog OCR inventory trackers.' },
    { id: 'manufacturing', title: 'Manufacturing & Smart Logistics', metric: '18x Cycle Speed', text: 'Industrial system anomaly visual analyzers, conversational equipment logs, and automated vendor procurement routing.' },
    { id: 'education', title: 'Education & Enterprise Upskilling', metric: '98% CSAT Rating', text: 'Custom interactive adaptive tutors, high-velocity internal documentation synthesis, and sovereign code generation checkers.' }
  ];

  // Sectors & Security — flat gradient swatch cards.
  const sectorSwatches = [
    { num: '01', cat: 'SECTORS', title: '5 Industry Verticals', desc: 'Healthcare, Financial Services, Retail, Manufacturing & Education — deployed across every high-stakes regulated vertical.', grad: 'from-mint to-mint-deep' },
    { num: '02', cat: 'COMPLIANCE', title: 'SOC-2, ISO 27001 & Beyond', desc: 'SOC-2 hardened, ISO 27001 certified, GDPR sovereign, HIPAA shielded, PCI DSS and EU AI Act aligned.', grad: 'from-violet to-violet-deep' },
    { num: '03', cat: 'INTEGRATIONS', title: '8+ Stack Integrations', desc: 'Salesforce, SAP, Oracle, Snowflake, Databricks — plus AWS, GCP and Azure VPC clusters with SAML SSO.', grad: 'from-steel to-steel-deep' },
    { num: '04', cat: 'SECURITY', title: 'Active Threat Monitoring', desc: 'Adversarial red-teaming, real-time synthetic token masking and hardened prompt guardrails. 99.99% uptime SLA.', grad: 'from-rose to-maroon-deep' },
  ];

  const resultStats = [
    { value: '18x', label: 'Average Output Gain', grad: 'from-olive to-olive-deep' },
    { value: '98.5%', label: 'Retention Rate', grad: 'from-steel to-steel-deep' },
    { value: '-82%', label: 'Cost Reduction', grad: 'from-amber to-maroon-deep' },
    { value: '99.98%', label: 'Uptime SLA', grad: 'from-violet to-violet-deep' },
  ];

  const coreAccentText: Record<string, string> = {
    llm: 'text-rose',
    agents: 'text-steel',
    rag: 'text-violet',
    automation: 'text-olive',
  };
  const coreAccentBg: Record<string, string> = {
    llm: 'bg-gradient-to-br from-rose to-maroon-deep',
    agents: 'bg-gradient-to-br from-steel to-steel-deep',
    rag: 'bg-gradient-to-br from-violet to-violet-deep',
    automation: 'bg-gradient-to-br from-olive to-olive-deep',
  };
  // Hover preview — inactive tabs show the same accent color on hover, not
  // just once clicked, so the color-change isn't gated behind a click.
  const coreAccentHoverBg: Record<string, string> = {
    llm: 'hover:bg-gradient-to-br hover:from-rose hover:to-maroon-deep',
    agents: 'hover:bg-gradient-to-br hover:from-steel hover:to-steel-deep',
    rag: 'hover:bg-gradient-to-br hover:from-violet hover:to-violet-deep',
    automation: 'hover:bg-gradient-to-br hover:from-olive hover:to-olive-deep',
  };
  const coreAccentBorder: Record<string, string> = {
    llm: 'border-rose/40',
    agents: 'border-steel/40',
    rag: 'border-violet/40',
    automation: 'border-olive/40',
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="relative min-h-screen bg-cream text-ink font-sans antialiased overflow-x-hidden selection:bg-rose-deep/25 selection:text-cream">

      {/* ═══════════════════════════════════════════════════════════════════════
          FLOATING NAVIGATION
          ═══════════════════════════════════════════════════════════════════════ */}
      <nav className={`fixed top-3 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-cream/90 backdrop-blur-md border-b border-ink/10 py-3.5' : 'bg-transparent py-6'}`}>
        <div className="max-w-[1320px] mx-auto px-8 sm:px-14 flex items-center justify-between">
          <a href="#hero" className="flex items-center space-x-3 group">
            <div className={`relative w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 ${isScrolled ? 'bg-ink border-ink' : 'bg-cream/15 border-cream/30'}`}>
              <Sparkles className="w-4.5 h-4.5 text-cream" />
            </div>
            <span className={`font-display text-xl font-semibold tracking-tight transition-colors duration-300 ${isScrolled ? 'text-ink' : 'text-cream'}`}>
              Fixl <span className="text-rose font-light">AI</span>
            </span>
          </a>

          <div className="hidden lg:flex items-center space-x-8">
            {[
              { label: 'Services', href: '/services' },
              { label: 'Industries', href: '/industries' },
              { label: 'Enterprise', href: '/enterprise' },
            ].map((l) => (
              <Link key={l.href} href={l.href}
                className={`relative text-[13px] font-sans font-medium tracking-tight transition-colors group ${isScrolled ? 'text-ink/85 hover:text-ink' : 'text-cream/90 hover:text-cream'}`}>
                {l.label}
                <span className="absolute -bottom-0.5 left-0 h-[1.5px] bg-rose rounded-full w-0 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          <Link href="/enterprise#contact" className={`group relative overflow-hidden px-5 py-2.5 rounded-full text-[13px] font-sans font-medium hover:scale-105 hover:text-cream transition-all duration-200 shadow-md flex items-center gap-1.5 ${isScrolled ? 'bg-ink text-cream' : 'bg-cream text-void'}`}>
            <span className={`absolute inset-0 scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-300 ease-out ${isScrolled ? 'bg-rose' : 'bg-rose'}`} />
            <span className="relative z-10 flex items-center gap-1.5">
              Book Demo
              <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
            </span>
          </Link>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 1 — HERO
          Framed rounded card sitting inset on the page background, vivid
          magenta/purple aurora fill, centered serif headline, combined
          input+CTA pill. Equal to the full viewport height.
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="p-3 sm:p-5">
        <motion.section
          id="hero"
          className="relative h-[calc(100vh-1.5rem)] sm:h-[calc(100vh-2.5rem)] flex flex-col items-center justify-center overflow-hidden text-cream rounded-[2rem] border border-rose/25 shadow-[0_0_90px_-20px_rgba(230,61,159,0.45)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Aurora />
          <PixelCluster cells={heroBlobTL} className="-top-6 -left-10 opacity-90" />
          <PixelCluster cells={heroScatterTR} cell={56} className="top-16 -right-16 hidden md:block opacity-95" />
          <PixelCluster cells={heroScatterBL} cell={48} className="bottom-8 -left-8 opacity-80 hidden sm:block" />
          <PixelCluster cells={heroScatterBR} cell={52} className="bottom-1/4 -right-14 opacity-95 hidden lg:block" />

          <div className="max-w-5xl mx-auto px-8 sm:px-14 relative z-10 w-full text-center space-y-8">

            <motion.h1
              className="text-7xl sm:text-8xl lg:text-9xl font-accent font-normal text-cream tracking-tight leading-[1.02] [text-shadow:0_6px_28px_rgba(10,3,8,0.65)]"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              What can we build,<br />for you?
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-cream/95 leading-relaxed font-light max-w-xl mx-auto [text-shadow:0_2px_12px_rgba(10,3,8,0.55)]"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
            >
              Custom AI systems, secure vector databases, and multi-step automated workflows built natively for your infrastructure.
            </motion.p>

            {/* Combined input + CTA pill */}
            <motion.div
              className="w-full max-w-xl mx-auto pt-2"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="bg-ink/35 border border-cream/15 rounded-full pl-6 pr-2 py-2 flex items-center justify-between shadow-lg backdrop-blur-sm">
                <span className="font-sans font-light text-sm text-cream/90">Enter your work email</span>
                <Link href="/enterprise#contact" className="group relative flex-shrink-0 px-5 py-2.5 rounded-full bg-gradient-to-r from-rose to-violet text-cream text-sm font-sans font-semibold overflow-hidden shadow-md">
                  <span className="absolute inset-0 bg-violet-deep scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-300 ease-out" />
                  <span className="relative z-10 flex items-center gap-1.5">
                    Sign Up
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="flex flex-wrap items-center justify-center gap-2 pt-1"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              {[
                { label: 'LLM Solutions', href: '/services#llm' },
                { label: 'Agentic AI', href: '/services#agentic' },
                { label: 'RAG Systems', href: '/services#rag' },
                { label: 'Voice AI', href: '/services#voice' },
                { label: 'AI Automation', href: '/services#automation' },
              ].map((chip) => (
                <Link
                  key={chip.href}
                  href={chip.href}
                  className="px-4 py-2 rounded-full text-[11px] bg-cream/15 border border-cream/30 text-cream/95 hover:bg-rose hover:border-rose hover:text-cream transition-all font-sans"
                >
                  {chip.label}
                </Link>
              ))}
            </motion.div>
          </div>
        </motion.section>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 2 — THE AI SHIFT
          fal "Built for enterprise scale" analogue: dark field, headline +
          copy + tags on the left, a colorful swatch-card grid on the right,
          a giant pixel mascot bleeding off the left edge, and a giant faint
          vertical wordmark bleeding off the right edge.
          ═══════════════════════════════════════════════════════════════════════ */}
      <SectionReveal id="shift" className="relative min-h-screen flex items-center py-20 lg:py-28 bg-ink text-cream overflow-hidden">
        <PixelCluster cells={shiftMascot} cell={44} className="-top-10 -left-20 opacity-90" />
        <div aria-hidden className="absolute top-1/2 -right-10 -translate-y-1/2 rotate-90 select-none pointer-events-none">
          <span className="font-display font-bold text-[7rem] text-cream/[0.05] tracking-tight whitespace-nowrap">PLATFORM</span>
        </div>
        <PixelCluster cells={shiftClusterB} cell={48} className="top-1/3 -right-16 opacity-90 hidden lg:block" />

        <div className="max-w-[1320px] mx-auto px-8 sm:px-14 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

            <div className="lg:col-span-4 space-y-6">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-cream tracking-tight leading-tight">
                <WordReveal text="We build custom systems that connect AI models to your real-world databases and APIs." />
              </h2>
              <p className="text-sm text-cream/85 leading-relaxed font-light">
                Standard chatbot interfaces and disconnected APIs quickly reach their limits. True efficiency comes from tailor-made workflows that read internal documentation, process document streams, and execute actions under secure corporate guidelines.
              </p>

              <div className="flex flex-wrap gap-2">
                {['Zero telemetry leaks', 'Private cloud', 'Air-gapped clusters'].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 rounded-full text-[10px] font-sans font-semibold bg-ink-dim border border-cream/10 text-cream/90">{tag}</span>
                ))}
              </div>

              <button className="group relative overflow-hidden px-6 py-3 rounded-full bg-cream text-ink font-sans text-xs font-semibold hover:text-cream transition-all shadow-md">
                <span className="absolute inset-0 bg-rose scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-300 ease-out" />
                <span className="relative z-10">How it works</span>
              </button>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {executiveOverviewPoints.map((pt, i) => (
                  <div key={i} className={`rounded-3xl p-6 min-h-[220px] flex flex-col justify-between gap-6 bg-gradient-to-br ${['from-mint to-mint-deep', 'from-rose to-rose-deep', 'from-steel to-steel-deep'][i]}`}>
                    <span className="text-[10px] font-sans font-bold tracking-[0.18em] text-cream/85 uppercase">0{i + 1}</span>
                    <div className="space-y-2">
                      <h3 className="text-lg font-display font-bold text-cream leading-tight">{pt.title}</h3>
                      <p className="text-xs font-medium leading-relaxed text-cream/90">{pt.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-3xl p-8 bg-gradient-to-r from-amber to-maroon-deep flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-4xl sm:text-5xl font-display font-bold text-cream tracking-tight">{shiftStats[3].value}</div>
                  <p className="text-xs sm:text-sm font-medium text-cream/90 mt-1">{shiftStats[3].label}</p>
                </div>
                <div className="flex gap-6 text-cream/90 text-xs font-sans">
                  {shiftStats.slice(0, 3).map((st, i) => (
                    <div key={i}>
                      <div className="text-lg font-display font-bold text-cream">{st.value}</div>
                      <div className="opacity-70 max-w-[110px]">{st.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </SectionReveal>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 3 — THE Fixl AI ECOSYSTEM
          Top row = gradient "gallery" cards. Bottom = calmer 2-col grid
          with a couple of color pops.
          ═══════════════════════════════════════════════════════════════════════ */}
      <SectionReveal id="ecosystem" className="relative py-20 lg:py-28 bg-paper text-ink overflow-hidden">
        <PixelCluster cells={ecoClusterA} cell={48} className="bottom-4 -right-6 opacity-80 hidden md:block" />
        <PixelCluster cells={ecoClusterB} cell={44} className="top-8 right-10 opacity-70 hidden lg:block" />
        <PixelCluster cells={ecoClusterC} cell={40} className="top-1/2 -right-10 opacity-60 hidden lg:block" />
        <PixelCluster cells={ecoClusterD} cell={44} className="bottom-10 -left-10 opacity-70 hidden lg:block" />
        <div className="max-w-[1320px] mx-auto px-8 sm:px-14 space-y-10 relative">

          <div className="text-left max-w-2xl space-y-3">
            <span className="font-accent italic text-2xl text-rose-deep">Fixl Platform</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-ink tracking-tight">
              <WordReveal text="A unified suite of AI solutions." />
            </h2>
            <p className="text-sm sm:text-base text-ink/85 leading-relaxed font-light">
              We replace loose scripts and fragmented services with a single, production-ready AI platform. Scale securely with complete model control.
            </p>
          </div>

          {/* Gallery row — flat gradient cards, icon top, bold title bottom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ecosystemCards.slice(0, 4).map((eco, idx) => {
              const c = galleryColors[idx];
              const isActive = hoveredEcoId === eco.id;
              return (
                <div
                  key={eco.id}
                  onMouseEnter={() => setHoveredEcoId(eco.id)}
                  onMouseLeave={() => setHoveredEcoId(null)}
                  className={`bg-gradient-to-br ${c.grad} rounded-3xl p-6 min-h-[260px] flex flex-col justify-between cursor-pointer transition-transform duration-300 ${isActive ? '-translate-y-2 shadow-xl' : 'shadow-sm'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-cream/20 text-cream">{eco.icon}</div>
                    <span className="text-[10px] font-sans font-semibold text-cream/90">{eco.category}</span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-display font-bold text-cream leading-snug">{eco.title}</h3>
                    <p className="text-xs leading-relaxed font-medium text-cream/90 line-clamp-2">{eco.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-cream/20 text-[11px] font-semibold text-cream">
                      <span className="opacity-60">{eco.metricLabel}</span>
                      <span className="flex items-center gap-0.5">{eco.metric}<ArrowUpRight className="w-3 h-3" /></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Calm 2-col grid for the remaining items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ecosystemCards.slice(4).map((eco, idx) => {
              const isActive = hoveredEcoId === eco.id;
              return (
                <div
                  key={eco.id}
                  onMouseEnter={() => setHoveredEcoId(eco.id)}
                  onMouseLeave={() => setHoveredEcoId(null)}
                  className={`${gridCardAccents[idx]} rounded-3xl border border-ink/10 p-7 flex items-center justify-between gap-6 transition-all duration-300 ${isActive ? 'border-ink/30 shadow-md -translate-y-1' : 'hover:border-ink/20'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-ink/5 border border-ink/10">{eco.icon}</div>
                    <div>
                      <h3 className="text-sm font-sans font-semibold text-ink">{eco.title}</h3>
                      <p className="text-xs font-light mt-0.5 max-w-sm text-ink/90">{eco.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className="text-[10px] uppercase tracking-wide text-ink/90">{eco.metricLabel}</span>
                    <span className="font-semibold text-sm flex items-center gap-1 text-ink">{eco.metric}<ArrowUpRight className="w-3.5 h-3.5" /></span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </SectionReveal>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 4 — CORE CAPABILITIES
          Dark ink field; the visualizer panel tints with a flat gradient
          accent that rotates per active tab.
          ═══════════════════════════════════════════════════════════════════════ */}
      <SectionReveal id="core" className="relative py-20 lg:py-28 bg-ink text-cream overflow-hidden">
        <PixelCluster cells={coreClusterA} cell={52} className="-bottom-12 -left-12 opacity-80" />
        <PixelCluster cells={coreClusterB} cell={44} className="bottom-6 -right-6 opacity-70 hidden md:block" />
        <PixelCluster cells={coreClusterC} cell={40} className="top-1/3 right-1/4 opacity-50 hidden lg:block" />
        <PixelCluster cells={coreClusterD} cell={44} className="top-6 -right-8 opacity-70 hidden lg:block" />
        <div className="max-w-[1320px] mx-auto px-8 sm:px-14 space-y-8 relative">

          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 border-b border-cream/10 pb-8">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-cream tracking-tight">
              <WordReveal text="Our core capabilities." />
            </h2>
            <p className="text-sm text-cream/90 max-w-md text-left font-light leading-relaxed">
              We deploy foundation models, custom retrieval pipelines, and secure API integrations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">

            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                {[
                  { id: 'llm', num: '01', label: 'Model Integration', desc: 'Integration of standard and open-weight models' },
                  { id: 'agents', num: '02', label: 'Custom Automations', desc: 'Multi-step automated workflows' },
                  { id: 'rag', num: '03', label: 'Internal Databases', desc: 'Document processing and search systems' },
                  { id: 'automation', num: '04', label: 'Workflow Efficiency', desc: 'Back-office workflow automation' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCoreTab(tab.id as any)}
                    className={`w-full p-4 rounded-2xl text-left border transition-all duration-200 flex items-start space-x-4 ${
                      activeCoreTab === tab.id
                        ? `${coreAccentBg[tab.id]} border-transparent`
                        : `bg-transparent border-transparent ${coreAccentHoverBg[tab.id]}`
                    }`}
                  >
                    <span className={`font-sans text-xs font-semibold ${activeCoreTab === tab.id ? 'text-cream/85' : 'text-cream/90'}`}>{tab.num}</span>
                    <div>
                      <h3 className="text-sm font-sans font-semibold text-cream">{tab.label}</h3>
                      <p className={`text-xs mt-1 font-light ${activeCoreTab === tab.id ? 'text-cream/90' : 'text-cream/90'}`}>{tab.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-ink-dim border border-cream/10 text-left space-y-2">
                <span className="text-[10px] font-sans font-semibold tracking-wide text-cream/90">System Integration Checklist</span>
                <div className="flex items-center space-x-2 text-xs text-cream/85">
                  <CheckCircle2 className="w-3.5 h-3.5 text-mint" />
                  <span>SOC-2 Hardened Infrastructure</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-cream/85">
                  <CheckCircle2 className="w-3.5 h-3.5 text-mint" />
                  <span>Real-time Prompt Guardrails</span>
                </div>
              </div>
            </div>

            <div className={`lg:col-span-7 border rounded-3xl p-6 relative flex flex-col justify-between overflow-hidden min-h-[360px] transition-colors duration-300 bg-ink-dim ${coreAccentBorder[activeCoreTab]}`}>
              <div className="flex items-center justify-between border-b border-cream/10 pb-3 relative z-10">
                <span className="text-[10px] font-sans text-cream/90 font-medium">Fixl AI Engine Visualizer</span>
                <span className="text-[10px] font-sans text-cream/90">System Coherence: 99.8%</span>
              </div>

              <div className="my-6 relative z-10 flex-grow flex flex-col justify-center text-left">
                {activeCoreTab === 'llm' && (
                  <div className="space-y-4">
                    <div>
                      <span className={`text-[10px] font-sans font-medium ${coreAccentText.llm}`}>Multi-Model Orchestrator</span>
                      <h3 className="text-base font-display font-bold text-cream mt-1">Foundation Model Agnostic Layer</h3>
                      <p className="text-xs text-cream/85 mt-2 font-light leading-relaxed">
                        We deploy, coordinate, and host leading open weights and proprietary models. Our orchestrator dynamically routes prompt payloads to the best aligned LLM according to latency, query complexity, and budget constraints.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                      {[
                        { name: 'GPT-4o', latency: '420ms' },
                        { name: 'Claude 3.5', latency: '650ms' },
                        { name: 'Gemini 2.5', latency: '180ms' },
                        { name: 'Llama 3.3', latency: '12ms' },
                        { name: 'DeepSeek R1', latency: '40ms' }
                      ].map((md, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-ink border border-cream/10 flex flex-col justify-between">
                          <span className="text-[11px] font-sans font-semibold text-cream">{md.name}</span>
                          <span className={`text-[10px] font-sans font-semibold mt-2 ${coreAccentText.llm}`}>{md.latency}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeCoreTab === 'agents' && (
                  <div className="space-y-4">
                    <div>
                      <span className={`text-[10px] font-sans font-medium ${coreAccentText.agents}`}>Goal-Directed Autonomy</span>
                      <h3 className="text-base font-display font-bold text-cream mt-1">Dynamic Task Swarm Planning</h3>
                      <p className="text-xs text-cream/85 mt-2 font-light leading-relaxed">
                        Rather than legacy linear steps, our agents synthesize natural text prompts, establish a goal map, call enterprise backend services (SAP, Salesforce, CRM), examine execution quality, and self-correct on failures.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                      {[
                        { title: 'Planning Engine', desc: 'Synthesizes Goal Map' },
                        { title: 'Orchestrator Node', desc: 'Executes API Systems' },
                        { title: 'Safety Firewall', desc: 'Verifies Compliance' }
                      ].map((sw, i) => (
                        <div key={i} className="p-3 rounded-xl bg-ink border border-cream/10 text-center flex-grow w-full">
                          <div className={`text-[10px] font-sans ${coreAccentText.agents}`}>{sw.title}</div>
                          <div className="text-[11px] text-cream font-semibold mt-1">{sw.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeCoreTab === 'rag' && (
                  <div className="space-y-4">
                    <div>
                      <span className={`text-[10px] font-sans font-medium ${coreAccentText.rag}`}>Sub-second Vector Knowledge</span>
                      <h3 className="text-base font-display font-bold text-cream mt-1">Enterprise Hybrid Document Sync</h3>
                      <p className="text-xs text-cream/85 mt-2 font-light leading-relaxed">
                        Connect unstructured raw enterprise document files directly into models safely. Our hybrid indexing systems perform instant metadata pre-filtering, dense vector mapping, and contextual ranking with clear citations.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      {[
                        { step: 'STAGE 01', title: 'Ingests Documents', desc: 'Chunking text on domain glossary rules.' },
                        { step: 'STAGE 02', title: 'Dense Embeddings', desc: 'Localized VPC database storage integration.' },
                        { step: 'STAGE 03', title: 'Hybrid Lookup', desc: 'Yields citation references in under 120ms.' }
                      ].map((rg, i) => (
                        <div key={i} className="p-3 rounded-xl bg-ink border border-cream/10">
                          <span className="text-[10px] font-sans text-cream/90">{rg.step}</span>
                          <div className="text-[11px] font-bold text-cream mt-0.5">{rg.title}</div>
                          <p className="text-[10px] text-cream/90 mt-1 font-light">{rg.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeCoreTab === 'automation' && (
                  <div className="space-y-4">
                    <div>
                      <span className={`text-[10px] font-sans font-medium ${coreAccentText.automation}`}>Transactional Back Office Loop</span>
                      <h3 className="text-base font-display font-bold text-cream mt-1">Sovereign Automation Pipelines</h3>
                      <p className="text-xs text-cream/85 mt-2 font-light leading-relaxed">
                        Bypass slow manual review bottlenecks. Fixl AI automates continuous, complex transactional work lines — classifying incoming emails, checking ledger values, processing PDFs, and coordinating DevOps.
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-ink border border-cream/10 space-y-1 text-xs font-sans text-cream/85">
                      <div className="flex justify-between border-b border-cream/10 pb-1">
                        <span>Active Document Streams:</span>
                        <span className="text-cream font-bold">12,420 files/hr</span>
                      </div>
                      <div className="flex justify-between border-b border-cream/10 pb-1">
                        <span>Support Tickets Handled:</span>
                        <span className="text-cream font-bold">98.4% resolved</span>
                      </div>
                      <div className="flex justify-between border-b border-cream/10 pb-1">
                        <span>Compliance Check Status:</span>
                        <span className={`font-bold ${coreAccentText.automation}`}>Approved</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-cream/10 pt-3 flex items-center justify-between text-[10px] font-sans text-cream/90">
                <span>Console Operational</span>
                <span>UTC Time Check: Live</span>
              </div>
            </div>

          </div>

        </div>
      </SectionReveal>

      <ConfettiStripe />

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 5 — ENTERPRISE SOLUTIONS
          Curved-end panel restored: section bg (blush) ≠ panel bg (cream)
          ≠ tab/preview accent colors (steel / amber / olive / violet).
          ═══════════════════════════════════════════════════════════════════════ */}
      <SectionReveal id="solutions" className="relative py-14 lg:py-20 bg-blush text-ink overflow-hidden">
        <PixelCluster cells={solutionsCluster} cell={48} className="top-6 right-10 opacity-70 hidden md:block" />
        <PixelCluster cells={solutionsClusterB} cell={44} className="-bottom-6 -right-8 opacity-60 hidden md:block" />
        <PixelCluster cells={solutionsClusterC} cell={40} className="top-1/2 -left-10 opacity-70 hidden lg:block" />
        <div className="max-w-[1320px] mx-auto px-8 sm:px-14 relative">
          <div className="p-6 md:p-10 rounded-[2.5rem] bg-cream border border-ink/10 shadow-sm space-y-6">

            <div className="text-left max-w-2xl space-y-2">
              <span className="font-accent italic text-2xl text-violet-deep">Solutions</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-ink tracking-tight">
                <WordReveal text="Custom AI systems for secure operations." />
              </h2>
              <p className="text-xs sm:text-sm text-ink/85 leading-relaxed font-light">
                We develop custom voice interfaces, document vision systems, fine-tuned models, and secure cloud setups.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border-b border-ink/10 pb-4">
              {[
                { id: 'voice', label: 'Voice AI Integration' },
                { id: 'multimodal', label: 'Document Vision' },
                { id: 'development', label: 'Custom Model Tuning' },
                { id: 'consulting', label: 'Architecture & PoC' }
              ].map((sol) => (
                <button
                  key={sol.id}
                  onClick={() => setSelectedSolution(sol.id)}
                  className={`p-2.5 rounded-xl border transition-all duration-300 text-left flex items-center space-x-2 ${
                    selectedSolution === sol.id
                      ? `bg-gradient-to-br ${solutionAccent[sol.id].grad} text-cream border-transparent scale-[1.02]`
                      : `bg-paper text-ink/85 border-ink/10 hover:bg-gradient-to-br ${solutionAccent[sol.id].hoverGrad} hover:text-cream hover:border-transparent`
                  }`}
                >
                  <span className="text-xs font-sans font-semibold px-1">{sol.label}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2 items-center">

              <div className="lg:col-span-6 text-left space-y-4">
                <h3 className="text-xl sm:text-2xl font-display font-bold text-ink tracking-tight">
                  {solutionsData[selectedSolution].title}
                </h3>
                <p className="text-xs sm:text-sm text-ink/85 leading-relaxed font-light">
                  {solutionsData[selectedSolution].description}
                </p>

                <div className="space-y-1.5">
                  {solutionsData[selectedSolution].features.map((feat, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-violet-deep flex-shrink-0" />
                      <span className="text-xs font-sans font-medium text-ink/90">{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-ink/10">
                  {solutionsData[selectedSolution].stats.map((st, i) => (
                    <div key={i} className="space-y-0.5">
                      <div className="text-xl sm:text-2xl lg:text-3xl font-display font-black text-ink">{st.value}</div>
                      <div className="text-[9px] font-sans text-ink/90 font-semibold uppercase tracking-wider leading-none">{st.label}</div>
                    </div>
                  ))}
                </div>

                <a href="#results" className="inline-flex items-center text-xs font-sans font-semibold tracking-wide text-violet-deep hover:text-ink pt-1">
                  <span>Explore Solutions</span>
                  <ArrowRight className="w-3 h-3 ml-1.5" />
                </a>
              </div>

              <div className="lg:col-span-6">
                <div className={`relative aspect-[16/9] rounded-2xl overflow-hidden p-4 flex flex-col justify-between shadow-md transition-colors duration-300 bg-gradient-to-br ${solutionAccent[selectedSolution].grad}`}>

                  <div className="flex items-center border-b border-cream/20 pb-2 relative z-10">
                    <span className="text-[10px] font-sans text-cream/90 font-medium">Fixl AI &bull; {solutionsData[selectedSolution].visualLabel}</span>
                  </div>

                  <div className="flex-grow flex flex-col justify-center relative z-10 py-2 h-full min-h-[120px]">
                    {selectedSolution === 'voice' && (
                      <div className="relative w-full h-full min-h-[160px] rounded-2xl overflow-hidden flex flex-col justify-between">
                        <div className="relative z-10 flex-grow flex items-center justify-center">
                          <div className="flex items-end justify-center space-x-1 h-12">
                            {Array.from({ length: 15 }).map((_, i) => (
                              <div
                                key={i}
                                className="w-1 bg-cream rounded-full animate-bounce"
                                style={{ height: `${10 + (i % 3 === 0 ? 30 : 15)}px`, animationDelay: `${i * 80}ms`, animationDuration: '950ms' }}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="relative z-10 p-2 text-center">
                          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-ink/20 text-[10px] font-sans text-cream font-semibold">
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Voice delay calibrated at 310ms</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedSolution === 'multimodal' && (
                      <div className="space-y-3 text-left">
                        <div className="p-3 rounded-xl bg-ink/15 space-y-1">
                          <span className="text-[9px] font-sans text-cream/85 font-semibold">LIVE OCR PARSING MATCHED DATA</span>
                          <div className="text-cream text-xs font-bold font-sans">Invoice ID &bull; #9424-AX</div>
                          <p className="text-[10px] text-cream/90">Extracted ledger items, matched purchase rates, synced to SAP.</p>
                        </div>
                        <div className="p-3 rounded-xl bg-ink/15 space-y-1">
                          <span className="text-[9px] font-sans text-cream/85 font-semibold">ENGINE VISION ACCURACY RATIO</span>
                          <div className="text-cream text-xs font-bold font-sans">99.2% Correct Semantic Extraction</div>
                        </div>
                      </div>
                    )}

                    {selectedSolution === 'development' && (
                      <div className="space-y-4 text-left">
                        <div className="p-3 bg-ink/15 rounded-xl space-y-2">
                          <span className="text-[9px] font-sans text-cream font-bold uppercase tracking-wider">LoRA Weights Fine-Tuning Monitor</span>
                          <div className="grid grid-cols-3 gap-2 text-xs font-sans text-cream/90">
                            <div><span>Epochs:</span><div className="text-cream font-bold">12/12</div></div>
                            <div><span>Loss Value:</span><div className="text-cream font-bold">0.024</div></div>
                            <div><span>Alignment:</span><div className="text-cream font-bold">99.98%</div></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedSolution === 'consulting' && (
                      <div className="space-y-3 text-left">
                        <div className="p-3 bg-ink/15 rounded-xl text-xs space-y-1">
                          <span className="text-[9px] font-sans text-cream/85 font-semibold">PROPOSED STACK DESIGN ARCHITECTURE</span>
                          <div className="text-cream font-sans text-xs font-bold">Sovereign Llama 3.3 + Isolated vector DB</div>
                          <p className="text-[10px] text-cream/90 font-light">Compliance boundaries: SOC-2 Hardened VPC setups.</p>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </SectionReveal>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 6 — SECTORS & SECURITY
          Dark field, left copy column, right = 4 flat gradient swatch cards.
          ═══════════════════════════════════════════════════════════════════════ */}
      <SectionReveal id="enterprise" className="relative py-20 lg:py-28 bg-ink text-cream overflow-hidden">
        <PixelCluster cells={enterpriseA} cell={52} className="top-4 -right-8 opacity-70 hidden lg:block" />
        <PixelCluster cells={enterpriseB} cell={44} className="-bottom-6 left-1/3 opacity-60 hidden md:block" />
        <PixelCluster cells={enterpriseC} cell={40} className="top-1/2 -left-8 opacity-50 hidden lg:block" />
        <div className="max-w-[1320px] mx-auto px-8 sm:px-14 relative">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

            <div className="lg:col-span-4 space-y-6">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-cream tracking-tight">
                <WordReveal text="Sectors & Security." />
              </h2>
              <p className="text-sm text-cream/85 font-light leading-relaxed max-w-sm">
                Fixl AI designs compliance-ready AI systems for regulated industries — secured with active guardrails, adversarial red-teaming, and certified infrastructure standards.
              </p>
              <div className="flex flex-wrap gap-2">
                {['SOC-2', 'ISO 27001', 'HIPAA', 'GDPR', 'PCI DSS'].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 rounded-full text-[10px] font-sans font-semibold bg-ink-dim border border-cream/10 text-cream/90">{tag}</span>
                ))}
              </div>
              <button className="px-6 py-3 rounded-full bg-cream text-ink text-xs font-sans font-semibold hover:bg-blush transition-all">
                Learn more
              </button>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {sectorSwatches.map((item, idx) => (
                <div
                  key={idx}
                  className={`group rounded-3xl p-6 flex flex-col justify-between gap-6 min-h-[280px] transition-transform duration-300 hover:-translate-y-1.5 bg-gradient-to-br ${item.grad}`}
                >
                  <div className="space-y-3">
                    <div className="text-[10px] font-sans font-bold tracking-[0.18em] text-cream/85 uppercase">
                      {item.num} — {item.cat}
                    </div>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-cream leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs font-medium leading-relaxed text-cream/90">
                      {item.desc}
                    </p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-cream/85 group-hover:text-cream transition-colors" />
                </div>
              ))}
            </div>

          </div>

        </div>
      </SectionReveal>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 7 — RESULTS & CTA
          Stats as small flat gradient chips; CTA is a solid ink block with
          pixel-blob shapes bleeding at each edge.
          ═══════════════════════════════════════════════════════════════════════ */}
      <SectionReveal id="results" className="relative py-20 lg:py-24 bg-ink text-cream overflow-hidden">
        <PixelCluster cells={resultsCluster} cell={40} className="top-4 left-1/4 opacity-50 hidden lg:block" />
        <div className="max-w-[1320px] mx-auto px-8 sm:px-14 space-y-10 relative z-10">

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {resultStats.map((st, i) => (
              <div key={i} className={`rounded-2xl p-5 bg-gradient-to-br ${st.grad} space-y-1`}>
                <div className="text-2xl sm:text-4xl font-display font-bold tracking-tight text-cream">{st.value}</div>
                <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-cream/90">{st.label}</div>
              </div>
            ))}
          </div>

          <div className="relative rounded-[2.5rem] bg-gradient-to-br from-violet to-violet-deep p-10 sm:p-16 text-center space-y-8 overflow-hidden">
            <PixelCluster cells={ctaBlobLeft} cell={48} className="-left-8 top-1/2 -translate-y-1/2 opacity-90 hidden sm:block" />
            <PixelCluster cells={ctaBlobRight} cell={48} className="-right-8 top-1/2 -translate-y-1/2 opacity-90 hidden sm:block" />

            <div className="max-w-2xl mx-auto space-y-3 relative z-10">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-cream tracking-tight leading-tight">
                <WordReveal text="Secure, custom AI systems. Deploy Fixl AI today." />
              </h2>
              <p className="text-xs sm:text-sm text-cream/90 leading-relaxed font-light max-w-lg mx-auto">
                Contact us to discuss your requirements and design a custom plan for your infrastructure. Deploy in weeks.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <div className="max-w-md w-full text-left bg-cream p-3 rounded-full shadow-lg">
                {!submittedEmail ? (
                  <form
                    onSubmit={(e) => { e.preventDefault(); if (email) setSubmittedEmail(true); }}
                    className="flex items-center"
                  >
                    <input
                      type="email"
                      placeholder="Your corporate e-mail..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-grow bg-transparent px-4 py-2 text-xs sm:text-sm text-ink focus:outline-none placeholder-ink/40 font-sans min-w-0"
                    />
                    <button
                      type="submit"
                      className="w-10 h-10 bg-ink text-cream rounded-full flex items-center justify-center hover:bg-rose-deep hover:scale-110 transition-all duration-200 flex-shrink-0 shadow-md"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <div className="p-2 text-center">
                    <span className="text-[11px] sm:text-xs font-sans font-bold text-violet-deep">Request submitted successfully!</span>
                  </div>
                )}
              </div>
              <Link href="/enterprise#contact" className="group relative overflow-hidden flex-shrink-0 px-6 py-3.5 rounded-full bg-ink text-cream text-sm font-sans font-semibold shadow-md">
                <span className="absolute inset-0 bg-olive scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-300 ease-out" />
                <span className="relative z-10 group-hover:text-ink transition-colors duration-300">Contact Sales</span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 relative z-10 text-[10px] text-cream/85 font-sans">
              <span className="flex items-center">
                <Shield className="w-3.5 h-3.5 text-olive mr-1.5" />
                Secure server setups
              </span>
              <span>&bull;</span>
              <span>Zero external training leakage</span>
              <span>&bull;</span>
              <span>SOC-2 validated logs</span>
            </div>
          </div>
        </div>
      </SectionReveal>

      <ConfettiStripe />

      {/* ═══════════════════════════════════════════════════════════════════════
          FOOTER — light closing section
          ═══════════════════════════════════════════════════════════════════════ */}
      <footer className="relative text-cream overflow-hidden">
        <Aurora />
        <PixelCluster cells={footerClusterA} cell={48} className="bottom-8 left-8 opacity-70 hidden md:block" />
        <PixelCluster cells={footerClusterB} cell={40} className="top-6 right-10 opacity-60 hidden lg:block" />
        <PixelCluster cells={footerClusterC} cell={40} className="top-1/2 left-1/2 opacity-50 hidden lg:block" />
        <div className="max-w-[1320px] mx-auto px-8 sm:px-14 py-16 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-cream/10 pb-10 mb-10">
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-cream tracking-tight max-w-md">
              Ready to transform your enterprise with AI?
            </h3>
            <Link href="/enterprise#contact" className="group relative overflow-hidden flex-shrink-0 px-6 py-3 rounded-full bg-cream text-void text-sm font-sans font-semibold hover:text-cream transition-all duration-200 shadow-md">
              <span className="absolute inset-0 bg-rose scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-300 ease-out" />
              <span className="relative z-10">Contact Sales</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 text-left text-xs text-cream/90">

            <div className="col-span-2 space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded bg-cream flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-void" />
                </div>
                <span className="font-display font-semibold text-cream text-sm tracking-tight">Fixl AI</span>
              </div>
              <p className="text-cream/85 leading-relaxed font-light text-[11px]">
                Custom AI systems and database integrations. We build secure model pipelines, custom text search engines, and automated workflows.
              </p>
              <div className="text-cream/90 font-sans text-[10px] uppercase tracking-wider">
                &copy; {new Date().getFullYear()} Fixl AI. All rights reserved.
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-sans text-[10px] uppercase font-bold text-cream tracking-widest">Company</h4>
              <ul className="space-y-2 font-light text-cream/85 text-[11px]">
                <li><a href="#hero" className="hover:text-rose transition-colors">About Us</a></li>
                <li><a href="#results" className="hover:text-rose transition-colors">Team Careers</a></li>
                <li><a href="#shift" className="hover:text-rose transition-colors">Security Charter</a></li>
                <li><a href="#results" className="hover:text-rose transition-colors">Feasibility Audits</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-sans text-[10px] uppercase font-bold text-cream tracking-widest">Services</h4>
              <ul className="space-y-2 font-light text-cream/85 text-[11px]">
                <li><a href="#core" className="hover:text-rose transition-colors">Model Integration</a></li>
                <li><a href="#core" className="hover:text-rose transition-colors">Custom Automations</a></li>
                <li><a href="#core" className="hover:text-rose transition-colors">Internal Databases</a></li>
                <li><a href="#solutions" className="hover:text-rose transition-colors">Voice AI Integration</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-sans text-[10px] uppercase font-bold text-cream tracking-widest">Legal</h4>
              <ul className="space-y-2 font-light text-cream/85 text-[11px]">
                <li><a href="#shift" className="hover:text-rose transition-colors">Privacy Charter</a></li>
                <li><a href="#shift" className="hover:text-rose transition-colors">Terms of Service</a></li>
                <li><a href="#shift" className="hover:text-rose transition-colors">Service SLAs</a></li>
              </ul>
            </div>

          </div>

          <div className="mt-16 select-none pointer-events-none overflow-hidden">
            <span className="font-display font-bold text-[18vw] leading-none text-cream/[0.06] tracking-tighter block -mb-8 sm:-mb-12">
              fixl
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
