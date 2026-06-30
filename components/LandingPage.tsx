'use client';

import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import type { MotionValue } from 'motion/react';
import Lenis from 'lenis';
import Link from 'next/link';
import {
  Sparkles,
  Play,
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
  Lock,
  Server,
  Star,
  Briefcase,
  Layers3,
  Flame,
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
  const opacity      = useTransform(scrollYProgress, [0, 0.25, 1], [0.32, 0.72, 1]);
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

  // Cookie consent
  const [showCookies, setShowCookies] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('fixiai-cookies')) setShowCookies(true);
  }, []);
  const acceptCookies = (all: boolean) => {
    localStorage.setItem('fixiai-cookies', all ? 'all' : 'essential');
    setShowCookies(false);
  };

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
    { id: 'eco-llm', icon: <Cpu className="w-5 h-5 text-blue-500" />, category: 'Models', title: 'Model Integration', description: 'Integrate leading large language models with your custom guidelines and system rules.', metric: '99.4%', metricLabel: 'Task Accuracy' },
    { id: 'eco-agent', icon: <Workflow className="w-5 h-5 text-purple-500" />, category: 'Workflows', title: 'Custom Automations', description: 'Multi-step automated workflows that execute tasks and connect systems under human oversight.', metric: '18x', metricLabel: 'Speed Increase' },
    { id: 'eco-rag', icon: <Database className="w-5 h-5 text-blue-500" />, category: 'Search', title: 'Internal Databases', description: 'Custom internal search databases connected directly to your existing documentation.', metric: '< 120ms', metricLabel: 'Search Latency' },
    { id: 'eco-auto', icon: <Layers3 className="w-5 h-5 text-indigo-500" />, category: 'Operations', title: 'Workflow Efficiency', description: 'Workflow automation for back-office tasks, document reviews, and internal tickets.', metric: '-82%', metricLabel: 'Cost Reduction' },
    { id: 'eco-voice', icon: <Mic className="w-5 h-5 text-blue-500" />, category: 'Voice', title: 'Voice AI Integration', description: 'Voice integration with fast response times and clear natural language routing.', metric: '320ms', metricLabel: 'Response Delay' },
    { id: 'eco-multi', icon: <Video className="w-5 h-5 text-violet-500" />, category: 'Files', title: 'Document Parsing', description: 'Extract data from complex PDF files, charts, legacy scanned documents, and forms.', metric: '99.2%', metricLabel: 'Extraction Rate' },
    { id: 'eco-dev', icon: <Terminal className="w-5 h-5 text-indigo-500" />, category: 'Training', title: 'Custom Fine-Tuning', description: 'Model fine-tuning and hosting specialized on your private terminology.', metric: 'Bespoke', metricLabel: 'Term Customization' },
    { id: 'eco-consult', icon: <Briefcase className="w-5 h-5 text-blue-500" />, category: 'Architecture', title: 'Engineering Plans', description: 'System architecture reviews, feasibility studies, and functional software prototyping.', metric: 'SOC-2', metricLabel: 'Ready Design' },
    { id: 'eco-mlops', icon: <Server className="w-5 h-5 text-blue-500" />, category: 'Ops', title: 'Model Monitoring', description: 'Automatic model version tracking, health monitoring, and system uptime scaling.', metric: '99.99%', metricLabel: 'Uptime SLA' },
    { id: 'eco-sec', icon: <Shield className="w-5 h-5 text-red-500" />, category: 'Privacy', title: 'Data Security', description: 'Direct guardrails, secure networks, and strict data privacy compliance checks.', metric: 'Active', metricLabel: 'Security Shield' }
  ];

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

  const industryCards = [
    { id: 'healthcare', title: 'Healthcare & Life Sciences', metric: '-80% Doc Time', text: 'Secure document semantic lookup, automated clinical trial cohort matching, and privacy-first HIPAA compliant diagnostic assistant models.' },
    { id: 'finance', title: 'Financial Services & Capital Markets', metric: '99.8% Coherence', text: 'Sub-second portfolio asset query agents, multi-agent credit modeling networks, and deep regulatory audit text parsers.' },
    { id: 'retail', title: 'Retail & Global Commerce', metric: '4.1x ROAS Yield', text: 'Hyper-personalized product recommendation swarms, dynamic voice checkout helpers, and visual catalog OCR inventory trackers.' },
    { id: 'manufacturing', title: 'Manufacturing & Smart Logistics', metric: '18x Cycle Speed', text: 'Industrial system anomaly visual analyzers, conversational equipment logs, and automated vendor procurement routing.' },
    { id: 'education', title: 'Education & Enterprise Upskilling', metric: '98% CSAT Rating', text: 'Custom interactive adaptive tutors, high-velocity internal documentation synthesis, and sovereign code generation checkers.' }
  ];

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="relative min-h-screen bg-[#0a0a0c] text-[#f4f4f6] font-sans antialiased overflow-x-hidden selection:bg-blue-600/30 selection:text-blue-100">

      {/* ═══════════════════════════════════════════════════════════════════════
          FLOATING NAVIGATION
          ═══════════════════════════════════════════════════════════════════════ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0a0a0c]/90 backdrop-blur-md border-b border-zinc-800/50 py-3.5' : 'bg-transparent py-6'}`}>
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 flex items-center justify-between">
          <a href="#hero" className="flex items-center space-x-3 group">
            <div className="relative w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-blue-500/50 group-hover:shadow-[0_0_16px_rgba(59,130,246,0.3)] group-hover:-rotate-6">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-display text-xl font-semibold tracking-tight text-white">
              Fixl <span className="text-blue-500 font-light">AI</span>
            </span>
          </a>

          <div className="hidden lg:flex items-center space-x-8">
            {[
              { label: 'Services', href: '/services' },
              { label: 'Industries', href: '/industries' },
              { label: 'Enterprise', href: '/enterprise' },
            ].map((l) => (
              <Link key={l.href} href={l.href}
                className="relative text-[13px] font-sans font-medium tracking-tight text-zinc-400 hover:text-zinc-200 transition-colors group">
                {l.label}
                <span className="absolute -bottom-0.5 left-0 h-[1.5px] bg-blue-400 rounded-full w-0 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          <Link href="/enterprise#contact" className="group px-5 py-2.5 rounded-full text-[13px] font-sans font-medium bg-white text-zinc-950 hover:bg-blue-50 hover:shadow-[0_0_22px_rgba(255,255,255,0.22)] hover:scale-105 transition-all duration-200 shadow-md flex items-center gap-1.5">
            Book Demo
            <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
          </Link>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 1 — HERO
          (kept as original motion.section with time-based entrance animation)
          ═══════════════════════════════════════════════════════════════════════ */}
      <motion.section
        id="hero"
        className="relative h-screen flex items-center justify-center bg-[#0a0a0c] overflow-hidden border-b border-zinc-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-900/10 blur-[130px] pointer-events-none animate-pulse" />

        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Hero left text */}
          <motion.div
            className="lg:col-span-7 space-y-6 text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-semibold text-white tracking-tight leading-[1.1]">
              Redefine Systems <br />
              With Sovereign <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-white">
                Enterprise AI
              </span>
            </h1>

            <p className="text-sm text-zinc-400 font-light leading-relaxed max-w-xl">
              Fixl AI engineers and integrates bespoke, air-gapped cognitive frameworks natively into your core infrastructure.
              Unleash autonomous agentic orchestration, sub-second semantic retrieval, and bulletproof security firewalls.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a href="#results" className="group px-6 py-3.5 rounded-full font-sans text-sm font-medium bg-white text-zinc-950 hover:bg-blue-50 hover:shadow-[0_8px_32px_rgba(255,255,255,0.28)] hover:scale-[1.04] transition-all duration-200 flex items-center shadow-lg">
                Initiate Architecture
                <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
              <a href="#ecosystem" className="group px-5 py-3.5 rounded-full font-sans text-sm font-medium bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:text-white hover:border-blue-500/40 hover:bg-zinc-900 hover:shadow-[0_0_20px_rgba(59,130,246,0.12)] transition-all duration-200 flex items-center space-x-2 shadow-xs">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 text-white fill-current ml-0.5" />
                </div>
                <span>Explore Capabilities</span>
              </a>
            </div>
          </motion.div>

          {/* Hero Right — interactive Sentry console */}
          <motion.div
            className="lg:col-span-5 relative hidden lg:block"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="absolute -inset-1 rounded-3xl bg-blue-600/15 opacity-60 blur-xl" />

            <div className="relative p-6 rounded-[2rem] bg-[#0c0c0e]/95 border border-zinc-800/80 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[10px] font-sans font-medium text-zinc-400">Fixl AI Sentry Control</span>
                </div>
                <div className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-[10px] font-sans text-blue-400 font-semibold">Live Shell</div>
              </div>

              <div className="space-y-3">
                <div className="text-left">
                  <label className="text-[10px] font-sans text-zinc-500 font-medium">Query Cognitive Model Pipeline</label>
                  <div className="mt-1 flex space-x-2">
                    <input
                      type="text"
                      value={heroPromptInput}
                      onChange={(e) => setHeroPromptInput(e.target.value)}
                      className="flex-grow min-w-0 bg-[#050507] border border-zinc-800/60 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-blue-500 font-sans"
                    />
                    <button
                      onClick={runHeroSimulation}
                      disabled={isHeroSimulating}
                      className="px-3 rounded-xl bg-blue-600 text-white hover:bg-blue-500 hover:shadow-[0_0_16px_rgba(59,130,246,0.5)] hover:scale-105 transition-all duration-200 disabled:bg-zinc-800 disabled:text-zinc-500 flex items-center justify-center flex-shrink-0"
                    >
                      {isHeroSimulating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="h-36 bg-[#030305] rounded-xl border border-zinc-900 p-3 overflow-y-auto text-left space-y-1.5 scrollbar-thin">
                  {heroSimulatedLogs.map((log, idx) => (
                    <div key={idx} className="text-xs font-sans leading-normal flex items-start space-x-1.5">
                      <span className="text-blue-500 select-none">&gt;</span>
                      <span className={idx === heroSimulatedLogs.length - 1 ? "text-zinc-200 font-medium" : "text-zinc-500"}>{log}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-sans text-zinc-500 font-medium">
                    <span>System Coherence Tuning</span>
                    <span>{heroSimProgress}%</span>
                  </div>
                  <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                      style={{ width: `${heroSimProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-850 pt-3 flex items-center justify-between text-[10px] font-sans text-zinc-500">
                <div className="flex items-center space-x-1">
                  <Cpu className="w-3.5 h-3.5 text-blue-500" />
                  <span>Air-Gapped Sync</span>
                </div>
                <span>Latency: 14ms (avg)</span>
              </div>
            </div>
          </motion.div>

        </div>

        {/* ── Cookie consent — anchored to hero bottom, scrolls away with hero ── */}
        <AnimatePresence>
          {showCookies && (
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.55, delay: 1.8, ease: [0.32, 0.72, 0, 1] }}
              className="absolute bottom-0 left-0 right-0 z-30"
            >
              <div className="bg-[#0b0b0e]/92 backdrop-blur-xl border-t border-zinc-800/70 shadow-2xl">
                <div className="max-w-[1440px] mx-auto px-8 sm:px-12 py-5">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">

                    {/* Left: detailed content */}
                    <div className="lg:col-span-8 space-y-2.5">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                          <Shield className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                        <span className="text-xs font-sans font-bold text-white tracking-wide">Privacy & Cookie Preferences</span>
                      </div>

                      <p className="text-[11px] text-zinc-400 font-light leading-relaxed pl-9">
                        Fixl AI uses cookies and similar technologies to keep the platform secure and to improve your experience.
                        Essential cookies are required for core functionality. Analytics cookies help us understand how the site is used.
                        Personalisation cookies remember your settings across sessions. No data is ever shared with third parties without
                        explicit consent.{' '}
                        <a href="#shift" className="text-blue-400 underline underline-offset-2 hover:text-blue-300 transition-colors">
                          Read our Privacy Charter →
                        </a>
                      </p>

                      <div className="flex flex-wrap gap-4 text-[10px] text-zinc-500 pl-9 font-sans">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-blue-500 flex-shrink-0" />
                          Essential (always active)
                        </span>
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-zinc-500 flex-shrink-0" />
                          Analytics & Performance
                        </span>
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-zinc-500 flex-shrink-0" />
                          Personalisation
                        </span>
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-zinc-500 flex-shrink-0" />
                          Marketing & Retargeting
                        </span>
                      </div>
                    </div>

                    {/* Right: action buttons */}
                    <div className="lg:col-span-4 flex flex-wrap items-center gap-2 lg:justify-end">
                      <button
                        onClick={() => acceptCookies(false)}
                        className="px-4 py-2 rounded-full text-[11px] font-sans font-semibold text-zinc-400 bg-zinc-900 border border-zinc-800 hover:text-white hover:bg-zinc-800 hover:border-zinc-600 hover:shadow-[0_0_14px_rgba(255,255,255,0.05)] transition-all duration-200"
                      >
                        Essential only
                      </button>
                      <button
                        onClick={() => acceptCookies(true)}
                        className="px-5 py-2 rounded-full text-[11px] font-sans font-semibold bg-white text-zinc-950 hover:bg-blue-50 hover:shadow-[0_4px_20px_rgba(255,255,255,0.25)] hover:scale-[1.04] transition-all duration-200 shadow-lg"
                      >
                        Accept all cookies
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 2 — THE AI SHIFT
          ═══════════════════════════════════════════════════════════════════════ */}
      <SectionReveal id="shift" className="relative py-10 lg:py-14 bg-[#f4f4f6] text-zinc-950 border-b border-zinc-200">
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12">
          <div className="relative p-8 md:p-14 rounded-[2.5rem] bg-white border border-zinc-200 shadow-sm">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

              <div className="lg:col-span-5 space-y-6">
                <div className="p-4 rounded-3xl bg-[#f4f4f6] border border-zinc-200 shadow-xs relative overflow-hidden group">
                  <div className="aspect-[4/3] rounded-2xl bg-zinc-950 relative flex items-center justify-center overflow-hidden">
                    <img
                      src="/laptop_showcase.jpg"
                      alt="Fixl AI Laptop Workspace Showcase"
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/40" />
                    <div className="relative w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-all cursor-pointer">
                      <Play className="w-4 h-4 text-zinc-950 fill-current ml-1" />
                    </div>
                    <div className="absolute bottom-4 left-4 text-xs font-sans text-zinc-300">Hi, we are Fixl AI</div>
                  </div>
                  <div className="flex items-center justify-between mt-4 px-2">
                    <span className="font-sans font-bold text-sm text-zinc-900">Product Overview</span>
                    <div className="flex space-x-0.5 items-center">
                      <span className="w-0.5 h-3 bg-blue-600 rounded-full animate-pulse" />
                      <span className="w-0.5 h-4 bg-blue-600 rounded-full animate-pulse [animation-delay:150ms]" />
                      <span className="w-0.5 h-2.5 bg-blue-600 rounded-full animate-pulse [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>

                <button className="px-6 py-3 rounded-full bg-zinc-950 text-white font-sans text-xs font-medium hover:bg-zinc-800 transition-all flex items-center space-x-2 shadow-md">
                  <span>How it works</span>
                  <div className="flex space-x-0.5 items-center">
                    <span className="w-0.5 h-2 bg-white rounded-full animate-pulse" />
                    <span className="w-0.5 h-3 bg-white rounded-full animate-pulse [animation-delay:150ms]" />
                    <span className="w-0.5 h-1.5 bg-white rounded-full animate-pulse [animation-delay:300ms]" />
                  </div>
                </button>
              </div>

              <div className="lg:col-span-7 space-y-6 text-left">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-zinc-950 tracking-tight leading-tight">
                  <WordReveal text="We build custom systems that connect AI models to your real-world databases and APIs." />
                </h2>
                <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-light">
                  Standard chatbot interfaces and disconnected APIs quickly reach their limits. True efficiency comes from tailor-made workflows that read internal documentation, process document streams, and execute actions under secure corporate guidelines.
                </p>

                <div className="flex space-x-4 border-b border-zinc-200 pb-2">
                  {[
                    { id: 'trends', label: 'Workflows' },
                    { id: 'stats', label: 'Statistics' },
                    { id: 'overview', label: 'Approach' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveShiftTab(tab.id as any)}
                      className={`pb-2 text-sm font-sans font-semibold transition-colors relative ${activeShiftTab === tab.id ? 'text-blue-600 font-bold' : 'text-zinc-400 hover:text-zinc-600'}`}
                    >
                      {tab.label}
                      {activeShiftTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600" />}
                    </button>
                  ))}
                </div>

                <div className="pt-2 min-h-[140px]">
                  {activeShiftTab === 'trends' && (
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2.5">
                        <Flame className="w-4.5 h-4.5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-sans font-semibold text-zinc-800">Automated Task Workflows</h4>
                          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">Automate complex routines by stringing together database actions, document parsers, and system checks without manual bottlenecks.</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2.5">
                        <Lock className="w-4.5 h-4.5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-sans font-semibold text-zinc-800">Data Privacy & Governance</h4>
                          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">Keep sensitive data on your own private cloud or host air-gapped on dedicated network clusters. Zero telemetry leaks.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeShiftTab === 'stats' && (
                    <div className="grid grid-cols-2 gap-4">
                      {shiftStats.map((st, i) => (
                        <div key={i} className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/60 shadow-xs">
                          <div className="text-xl sm:text-3xl font-display font-bold text-blue-600">{st.value}</div>
                          <p className="text-xs text-zinc-500 mt-1">{st.label}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeShiftTab === 'overview' && (
                    <div className="space-y-3">
                      {executiveOverviewPoints.map((pt, i) => (
                        <div key={i} className="border-l-2 border-blue-500 pl-3">
                          <h4 className="text-sm font-sans font-semibold text-zinc-800">{pt.title}</h4>
                          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">{pt.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </SectionReveal>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 3 — THE Fixl AI ECOSYSTEM
          ═══════════════════════════════════════════════════════════════════════ */}
      <SectionReveal id="ecosystem" className="relative py-10 lg:py-14 bg-[#f4f4f6] text-zinc-950 border-b border-zinc-200">
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-8">

          <div className="text-left max-w-2xl space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-zinc-950 tracking-tight">
              <WordReveal text="A unified suite of AI solutions." />
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-light">
              We replace loose scripts and fragmented services with a single, production-ready AI platform. Scale securely with complete model control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {ecosystemCards.map((eco) => (
              <div
                key={eco.id}
                onMouseEnter={() => setHoveredEcoId(eco.id)}
                onMouseLeave={() => setHoveredEcoId(null)}
                className={`p-6 rounded-3xl bg-white border transition-all duration-300 flex flex-col justify-between min-h-[220px] relative overflow-hidden group cursor-pointer ${
                  hoveredEcoId === eco.id
                    ? 'border-zinc-950 bg-zinc-950 text-white shadow-[0_8px_32px_rgba(0,0,0,0.4)] -translate-y-2'
                    : 'border-zinc-200/80 hover:border-zinc-400 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5'
                }`}
              >
                <div className="space-y-4 relative z-10 text-left">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-zinc-50 rounded-xl border border-zinc-200 group-hover:bg-zinc-900 group-hover:border-zinc-800">
                      {eco.icon}
                    </div>
                    <span className="text-[10px] font-sans text-zinc-400 font-semibold">{eco.category}</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-sans font-semibold">{eco.title}</h3>
                    <p className={`text-xs leading-relaxed font-light line-clamp-3 ${hoveredEcoId === eco.id ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      {eco.description}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-zinc-100 group-hover:border-zinc-900 mt-4 flex items-center justify-between text-[10px] font-sans text-zinc-400 relative z-10">
                  <span>{eco.metricLabel}</span>
                  <span className={`font-semibold flex items-center ${hoveredEcoId === eco.id ? 'text-white' : 'text-zinc-850'}`}>
                    {eco.metric}
                    <ArrowUpRight className={`w-2.5 h-2.5 ml-0.5 transition-transform duration-200 ${hoveredEcoId === eco.id ? 'translate-x-0.5 -translate-y-0.5' : ''}`} />
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </SectionReveal>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 4 — CORE CAPABILITIES
          ═══════════════════════════════════════════════════════════════════════ */}
      <SectionReveal id="core" className="relative py-10 lg:py-14 bg-[#060e1c] text-white border-b border-[#1a2d4a]/50">
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-8">

          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 border-b border-zinc-900 pb-8">
            <div className="text-left space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-white tracking-tight">
                <WordReveal text="Our core capabilities." />
              </h2>
            </div>
            <p className="text-sm text-zinc-400 max-w-md text-left font-light leading-relaxed">
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
                        ? 'bg-zinc-900 border-zinc-700 shadow-[0_0_20px_rgba(59,130,246,0.07)]'
                        : 'bg-transparent border-transparent hover:bg-zinc-900/50 hover:border-zinc-800/60 hover:shadow-[0_2px_12px_rgba(0,0,0,0.2)]'
                    }`}
                  >
                    <span className="font-sans text-xs font-semibold text-zinc-500">{tab.num}</span>
                    <div>
                      <h3 className="text-sm font-sans font-semibold text-white">{tab.label}</h3>
                      <p className="text-xs text-zinc-400 mt-1 font-light">{tab.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-[#050e1d]/80 border border-[#1a2d4a]/50 text-left space-y-2">
                <span className="text-[10px] font-sans font-semibold tracking-wide text-zinc-500">System Integration Checklist</span>
                <div className="flex items-center space-x-2 text-xs text-zinc-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>SOC-2 Hardened Infrastructure</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-zinc-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>Real-time Prompt Guardrails</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#050e1d] border border-[#1a2d4a]/50 rounded-3xl p-6 relative flex flex-col justify-between overflow-hidden min-h-[360px]">
              <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

              <div className="flex items-center justify-between border-b border-zinc-900 pb-3 relative z-10">
                <span className="text-[10px] font-sans text-zinc-400 font-medium">Fixl AI Engine Visualizer</span>
                <span className="text-[10px] font-sans text-zinc-500">System Coherence: 99.8%</span>
              </div>

              <div className="my-6 relative z-10 flex-grow flex flex-col justify-center text-left">
                {activeCoreTab === 'llm' && (
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-sans text-blue-400 font-medium">Multi-Model Orchestrator</span>
                      <h3 className="text-base font-display font-bold text-white mt-1">Foundation Model Agnostic Layer</h3>
                      <p className="text-xs text-zinc-400 mt-2 font-light leading-relaxed">
                        We deploy, coordinate, and host leading open weights and proprietary models. Our orchestrator dynamically routes prompt payloads to the best aligned LLM according to latency, query complexity, and budget constraints.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                      {[
                        { name: 'GPT-4o', latency: '420ms', status: 'API Route' },
                        { name: 'Claude 3.5', latency: '650ms', status: 'VPC Node' },
                        { name: 'Gemini 2.5', latency: '180ms', status: 'Direct API' },
                        { name: 'Llama 3.3', latency: '12ms', status: 'Local GPU' },
                        { name: 'DeepSeek R1', latency: '40ms', status: 'Sovereign VPC' }
                      ].map((md, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-[#030b18] border border-[#1a2d4a]/60 flex flex-col justify-between">
                          <span className="text-[11px] font-sans font-semibold text-white">{md.name}</span>
                          <span className="text-[10px] font-sans text-blue-400 font-semibold mt-2">{md.latency}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeCoreTab === 'agents' && (
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-sans text-purple-400 font-medium">Goal-Directed Autonomy</span>
                      <h3 className="text-base font-display font-bold text-white mt-1">Dynamic Task Swarm Planning</h3>
                      <p className="text-xs text-zinc-400 mt-2 font-light leading-relaxed">
                        Rather than legacy linear steps, our agents synthesize natural text prompts, establish a goal map, call enterprise backend services (SAP, Salesforce, CRM), examine execution quality, and self-correct on failures.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                      {[
                        { title: 'Planning Engine', desc: 'Synthesizes Goal Map' },
                        { title: 'Orchestrator Node', desc: 'Executes API Systems' },
                        { title: 'Safety Firewall', desc: 'Verifies Compliance' }
                      ].map((sw, i) => (
                        <div key={i} className="p-3 rounded-xl bg-zinc-950 border border-zinc-900 text-center flex-grow w-full">
                          <div className="text-[10px] font-sans text-purple-400">{sw.title}</div>
                          <div className="text-[11px] text-white font-semibold mt-1">{sw.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeCoreTab === 'rag' && (
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-sans text-blue-400 font-medium">Sub-second Vector Knowledge</span>
                      <h3 className="text-base font-display font-bold text-white mt-1">Enterprise Hybrid Document Sync</h3>
                      <p className="text-xs text-zinc-400 mt-2 font-light leading-relaxed">
                        Connect unstructured raw enterprise document files directly into models safely. Our hybrid indexing systems perform instant metadata pre-filtering, dense vector mapping, and contextual ranking with clear citations.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      {[
                        { step: 'STAGE 01', title: 'Ingests Documents', desc: 'Chunking text on domain glossary rules.' },
                        { step: 'STAGE 02', title: 'Dense Embeddings', desc: 'Localized VPC database storage integration.' },
                        { step: 'STAGE 03', title: 'Hybrid Lookup', desc: 'Yields citation references in under 120ms.' }
                      ].map((rg, i) => (
                        <div key={i} className="p-3 rounded-xl bg-zinc-950 border border-zinc-900">
                          <span className="text-[10px] font-sans text-zinc-500">{rg.step}</span>
                          <div className="text-[11px] font-bold text-white mt-0.5">{rg.title}</div>
                          <p className="text-[10px] text-zinc-400 mt-1 font-light">{rg.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeCoreTab === 'automation' && (
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-sans text-indigo-400 font-medium">Transactional Back Office Loop</span>
                      <h3 className="text-base font-display font-bold text-white mt-1">Sovereign Automation Pipelines</h3>
                      <p className="text-xs text-zinc-400 mt-2 font-light leading-relaxed">
                        Bypass slow manual review bottlenecks. Fixl AI automates continuous, complex transactional work lines — classifying incoming emails, checking ledger values, processing PDFs, and coordinating DevOps.
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1 text-xs font-sans text-zinc-400">
                      <div className="flex justify-between border-b border-zinc-900 pb-1">
                        <span>Active Document Streams:</span>
                        <span className="text-white font-bold">12,420 files/hr</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-900 pb-1">
                        <span>Support Tickets Handled:</span>
                        <span className="text-white font-bold">98.4% resolved</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-900 pb-1">
                        <span>Compliance Check Status:</span>
                        <span className="text-blue-400 font-bold">Approved</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-zinc-900 pt-3 flex items-center justify-between text-[10px] font-sans text-zinc-500">
                <span>Console Operational</span>
                <span>UTC Time Check: Live</span>
              </div>
            </div>

          </div>

        </div>
      </SectionReveal>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 5 — ENTERPRISE SOLUTIONS
          ═══════════════════════════════════════════════════════════════════════ */}
      <SectionReveal id="solutions" className="relative py-10 lg:py-14 bg-white text-zinc-950 border-b border-zinc-200">
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-8">

          <div className="text-left max-w-2xl space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-zinc-950 tracking-tight">
              <WordReveal text="Custom AI systems for secure operations." />
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-light">
              We develop custom voice interfaces, document vision systems, fine-tuned models, and secure cloud setups.
            </p>
          </div>

          <div className="p-6 md:p-10 rounded-[2.5rem] bg-zinc-50 border border-zinc-200 shadow-xs">

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-b border-zinc-200 pb-6">
              {[
                { id: 'voice', label: 'Voice AI Integration' },
                { id: 'multimodal', label: 'Document Vision' },
                { id: 'development', label: 'Custom Model Tuning' },
                { id: 'consulting', label: 'Architecture & PoC' }
              ].map((sol) => (
                <button
                  key={sol.id}
                  onClick={() => setSelectedSolution(sol.id)}
                  className={`p-3 rounded-2xl border transition-all duration-300 text-left flex items-center space-x-2.5 ${
                    selectedSolution === sol.id
                      ? 'bg-zinc-950 text-white border-zinc-950 shadow-[0_4px_20px_rgba(0,0,0,0.2)] scale-[1.02]'
                      : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400 hover:text-zinc-900 hover:shadow-[0_2px_14px_rgba(0,0,0,0.07)] hover:scale-[1.02]'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-sans font-semibold px-1">{sol.label}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-8 items-center">

              <div className="lg:col-span-6 text-left space-y-6">
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-zinc-950 tracking-tight">
                  {solutionsData[selectedSolution].title}
                </h3>
                <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-light">
                  {solutionsData[selectedSolution].description}
                </p>

                <div className="space-y-2">
                  {solutionsData[selectedSolution].features.map((feat, i) => (
                    <div key={i} className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span className="text-xs sm:text-sm font-sans font-medium text-zinc-700">{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-200">
                  {solutionsData[selectedSolution].stats.map((st, i) => (
                    <div key={i} className="space-y-0.5">
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-zinc-950">{st.value}</div>
                      <div className="text-[10px] font-sans text-zinc-400 font-semibold uppercase tracking-wider leading-none">{st.label}</div>
                    </div>
                  ))}
                </div>

                <a href="#results" className="inline-flex items-center text-xs sm:text-sm font-sans font-semibold tracking-wide text-blue-600 hover:text-blue-700 pt-2">
                  <span>Explore Solutions</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </a>
              </div>

              <div className="lg:col-span-6">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-zinc-200 bg-zinc-950 p-6 flex flex-col justify-between shadow-xl">
                  <div className="absolute inset-0 bg-grid-pattern opacity-5" />

                  <div className="flex items-center justify-between border-b border-zinc-900 pb-3 relative z-10">
                    <span className="text-[10px] font-sans text-zinc-400 font-medium">Fixl AI &bull; {solutionsData[selectedSolution].visualLabel}</span>
                    <span className="text-[9px] font-sans text-blue-400 font-semibold uppercase flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse mr-1" />
                      Secure VPC Active
                    </span>
                  </div>

                  <div className="flex-grow flex flex-col justify-center relative z-10 py-4 h-full min-h-[180px]">
                    {selectedSolution === 'voice' && (
                      <div className="relative w-full h-full min-h-[160px] rounded-2xl overflow-hidden flex flex-col justify-between">
                        <img
                          src="/voice_soundwave.jpg"
                          alt="Voice Soundwave Analysis"
                          className="absolute inset-0 w-full h-full object-cover opacity-35"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                        <div className="relative z-10 flex-grow flex items-center justify-center">
                          <div className="flex items-end justify-center space-x-1 h-12">
                            {Array.from({ length: 15 }).map((_, i) => (
                              <div
                                key={i}
                                className="w-1 bg-gradient-to-t from-blue-500 to-indigo-400 rounded-full animate-bounce"
                                style={{ height: `${10 + (i % 3 === 0 ? 30 : 15)}px`, animationDelay: `${i * 80}ms`, animationDuration: '950ms' }}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="relative z-10 p-2 text-center">
                          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-sans text-blue-400 font-semibold">
                            <Volume2 className="w-3.5 h-3.5 text-blue-500" />
                            <span>Voice delay calibrated at 310ms</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedSolution === 'multimodal' && (
                      <div className="space-y-3 text-left">
                        <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-850 space-y-1">
                          <span className="text-[9px] font-sans text-zinc-500 font-semibold">LIVE OCR PARSING MATCHED DATA</span>
                          <div className="text-white text-xs font-bold font-sans">Invoice ID &bull; #9424-AX</div>
                          <p className="text-[10px] text-zinc-400">Extracted ledger items, matched purchase rates, synced to SAP.</p>
                        </div>
                        <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-850 space-y-1">
                          <span className="text-[9px] font-sans text-zinc-500 font-semibold">ENGINE VISION ACCURACY RATIO</span>
                          <div className="text-white text-xs font-bold font-sans">99.2% Correct Semantic Extraction</div>
                        </div>
                      </div>
                    )}

                    {selectedSolution === 'development' && (
                      <div className="space-y-4 text-left">
                        <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-850 space-y-2">
                          <span className="text-[9px] font-sans text-blue-400 font-bold uppercase tracking-wider">LoRA Weights Fine-Tuning Monitor</span>
                          <div className="grid grid-cols-3 gap-2 text-xs font-sans text-zinc-400">
                            <div><span>Epochs:</span><div className="text-white font-bold">12/12</div></div>
                            <div><span>Loss Value:</span><div className="text-blue-400 font-bold">0.024</div></div>
                            <div><span>Alignment:</span><div className="text-white font-bold">99.98%</div></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedSolution === 'consulting' && (
                      <div className="space-y-3 text-left">
                        <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-xl text-xs space-y-1">
                          <span className="text-[9px] font-sans text-zinc-500 font-semibold">PROPOSED STACK DESIGN ARCHITECTURE</span>
                          <div className="text-white font-sans text-xs font-bold">Sovereign Llama 3.3 + Isolated vector DB</div>
                          <p className="text-[10px] text-zinc-400 font-light">Compliance boundaries: SOC-2 Hardened VPC setups.</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-zinc-900 pt-2 flex items-center justify-between text-[10px] font-sans text-zinc-500">
                    <span>Node: secure_edge_04</span>
                    <span>System clock synced</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </SectionReveal>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 6 — INDUSTRIES & SECURITY TRUST
          ═══════════════════════════════════════════════════════════════════════ */}
      <SectionReveal id="enterprise" className="relative py-10 lg:py-14 bg-[#04111f] text-white border-b border-[#162741]/60">
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12">

          {/* Section label */}
          <div className="mb-8 text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-white tracking-tight">
              <WordReveal text="Sectors & Security." />
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[460px]">

            {/* ── Left card ─────────────────────────────────────────────────── */}
            <div className="lg:col-span-4">
              <div className="relative h-full min-h-[360px] rounded-[2rem] overflow-hidden bg-gradient-to-b from-[#0d1e38] to-[#04111f] border border-[#1e3558]/70 p-8 flex flex-col justify-between">
                {/* Background grid */}
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.06]" />
                {/* Blue glow from bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-blue-950/40 via-blue-950/10 to-transparent pointer-events-none" />

                {/* Top icon */}
                <div className="relative z-10">
                  <div className="group/icon w-10 h-10 rounded-xl bg-[#071929] border border-[#1e3558]/70 flex items-center justify-center shadow-lg hover:border-blue-400/50 hover:shadow-[0_0_18px_rgba(59,130,246,0.3)] transition-all duration-300 cursor-default">
                    <Shield className="w-5 h-5 text-blue-400 transition-transform duration-500 group-hover/icon:scale-110 group-hover/icon:rotate-12" />
                  </div>
                </div>

                {/* Bottom content */}
                <div className="relative z-10 space-y-5">
                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-white leading-snug">
                    Enterprise Trust &amp; Sector Coverage
                  </h3>
                  <div className="border-t border-zinc-800 pt-4 space-y-2">
                    <div className="text-[10px] font-sans uppercase tracking-widest text-zinc-500 font-bold">
                      SECTORS &amp; SECURITY
                    </div>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed">
                      Fixl AI designs compliance-ready AI systems for regulated industries — secured with active guardrails, adversarial red-teaming, and certified infrastructure standards.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right 2 × 2 stat grid ─────────────────────────────────────── */}
            <div className="lg:col-span-8">
              <div className="h-full grid grid-cols-1 sm:grid-cols-2 border border-[#1e3558]/60 rounded-[2rem] overflow-hidden divide-y divide-[#1e3558]/60 sm:divide-y-0">
                {[
                  {
                    num: '01',
                    cat: 'SECTORS',
                    title: '5 Industry Verticals',
                    desc: 'Healthcare, Financial Services, Retail, Manufacturing & Education — custom AI solutions deployed across every high-stakes regulated vertical.'
                  },
                  {
                    num: '02',
                    cat: 'COMPLIANCE',
                    title: 'SOC-2, ISO 27001 & Beyond',
                    desc: 'SOC-2 hardened, ISO 27001 certified, GDPR sovereign, HIPAA shielded, PCI DSS and EU AI Act aligned — full compliance on every deployment.'
                  },
                  {
                    num: '03',
                    cat: 'INTEGRATIONS',
                    title: '8+ Stack Integrations',
                    desc: 'Salesforce, SAP, Oracle, Snowflake, Databricks — plus AWS, GCP and Azure VPC clusters with SAML SSO and isolated container auth.'
                  },
                  {
                    num: '04',
                    cat: 'SECURITY',
                    title: 'Active Threat Monitoring',
                    desc: 'Adversarial red-teaming, real-time synthetic token masking and hardened prompt guardrails are active on every deployed pipeline. 99.99% uptime SLA.'
                  }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`group p-8 lg:p-10 flex flex-col justify-between gap-4 bg-[#04111f] hover:bg-[#071929] hover:shadow-[inset_3px_0_0_rgba(59,130,246,0.45)] transition-all duration-300 cursor-default
                      ${idx % 2 === 0 ? 'sm:border-r border-[#1e3558]/60' : ''}
                      ${idx < 2 ? 'sm:border-b border-[#1e3558]/60' : ''}
                    `}
                  >
                    <div className="space-y-3">
                      <div className="text-[10px] font-sans font-bold tracking-[0.18em] text-zinc-500 uppercase">
                        {item.num} — {item.cat}
                      </div>
                      <h3 className="text-xl sm:text-2xl lg:text-[1.65rem] font-display font-bold text-white leading-tight group-hover:text-blue-50 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </SectionReveal>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 7 — PRICING
          ═══════════════════════════════════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 8 — RESULTS & CTA
          ═══════════════════════════════════════════════════════════════════════ */}
      <SectionReveal id="results" className="relative py-10 lg:py-14 bg-[#0a0a0c] text-white border-b border-zinc-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-900/10 blur-[130px] pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-10 relative z-10">

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 border-b border-zinc-900 pb-12 text-center">
            {[
              { value: '18x', label: 'Average Output Gain' },
              { value: '98.5%', label: 'Retention Rate' },
              { value: '-82%', label: 'Cost Reduction' },
              { value: '99.98%', label: 'Uptime SLA' }
            ].map((st, i) => (
              <div key={i} className="group space-y-1 cursor-default">
                <div className="text-3xl sm:text-5xl lg:text-6xl font-display font-semibold text-white tracking-tight transition-all duration-300 group-hover:scale-110 group-hover:text-blue-100 group-hover:drop-shadow-[0_0_20px_rgba(96,165,250,0.5)] inline-block">{st.value}</div>
                <div className="text-xs font-sans text-zinc-500 font-bold uppercase tracking-wider group-hover:text-zinc-400 transition-colors duration-200">{st.label}</div>
              </div>
            ))}
          </div>

          <div
            style={diagonalClipHeroStyle}
            className="relative rounded-3xl bg-gradient-to-tr from-blue-900/40 via-zinc-950 to-indigo-950/40 p-10 sm:p-14 text-center space-y-8 border border-zinc-800 shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-blue-600/10 rounded-full blur-[50px] pointer-events-none" />

            <div className="max-w-2xl mx-auto space-y-3 relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-white tracking-tight leading-tight">
                <WordReveal text="Secure, custom AI systems. Deploy Fixl AI today." />
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light max-w-lg mx-auto">
                Contact us to discuss your requirements and design a custom plan for your infrastructure. Deploy in weeks.
              </p>
            </div>

            <div className="max-w-md mx-auto relative z-10 text-left bg-white p-3 rounded-full border border-zinc-200 shadow-lg">
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
                    className="flex-grow bg-transparent px-4 py-2 text-xs sm:text-sm text-zinc-900 focus:outline-none placeholder-zinc-400 font-sans min-w-0"
                  />
                  <button
                    type="submit"
                    className="w-10 h-10 bg-zinc-950 text-white rounded-full flex items-center justify-center hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(59,130,246,0.45)] hover:scale-110 transition-all duration-200 flex-shrink-0 shadow-md"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="p-2 text-center">
                  <span className="text-[11px] sm:text-xs font-sans font-bold text-blue-600">Request submitted successfully!</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 relative z-10 text-[10px] text-zinc-500 font-sans">
              <span className="flex items-center">
                <Shield className="w-3.5 h-3.5 text-blue-500 mr-1.5" />
                Secure server setups
              </span>
              <span>&bull;</span>
              <span>Zero external training leakage</span>
              <span>&bull;</span>
              <span>SOC-2 validated logs</span>
            </div>

            <div className="absolute bottom-4 right-6 opacity-10 pointer-events-none">
              <Star className="w-12 h-12 text-white" />
            </div>
          </div>

          <footer className="pt-10 border-t border-zinc-900 grid grid-cols-2 md:grid-cols-6 gap-8 text-left text-xs text-zinc-400">

            <div className="col-span-2 space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-display font-semibold text-white text-sm tracking-tight">Fixl AI</span>
              </div>
              <p className="text-zinc-500 leading-relaxed font-light text-[11px]">
                Custom AI systems and database integrations. We build secure model pipelines, custom text search engines, and automated workflows.
              </p>
              <div className="text-zinc-650 font-sans text-[10px] uppercase tracking-wider">
                &copy; {new Date().getFullYear()} Fixl AI. All rights reserved.
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-sans text-[10px] uppercase font-bold text-white tracking-widest">Company</h4>
              <ul className="space-y-2 font-light text-zinc-500 text-[11px]">
                <li><a href="#hero" className="hover:text-blue-400 transition-colors">About Us</a></li>
                <li><a href="#results" className="hover:text-blue-400 transition-colors">Team Careers</a></li>
                <li><a href="#shift" className="hover:text-blue-400 transition-colors">Security Charter</a></li>
                <li><a href="#results" className="hover:text-blue-400 transition-colors">Feasibility Audits</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-sans text-[10px] uppercase font-bold text-white tracking-widest">Services</h4>
              <ul className="space-y-2 font-light text-zinc-500 text-[11px]">
                <li><a href="#core" className="hover:text-blue-400 transition-colors">Model Integration</a></li>
                <li><a href="#core" className="hover:text-blue-400 transition-colors">Custom Automations</a></li>
                <li><a href="#core" className="hover:text-blue-400 transition-colors">Internal Databases</a></li>
                <li><a href="#solutions" className="hover:text-blue-400 transition-colors">Voice AI Integration</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-sans text-[10px] uppercase font-bold text-white tracking-widest">Legal</h4>
              <ul className="space-y-2 font-light text-zinc-500 text-[11px]">
                <li><a href="#shift" className="hover:text-blue-400 transition-colors">Privacy Charter</a></li>
                <li><a href="#shift" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                <li><a href="#shift" className="hover:text-blue-400 transition-colors">Service SLAs</a></li>
              </ul>
            </div>

          </footer>
        </div>
      </SectionReveal>


    </div>
  );
}
