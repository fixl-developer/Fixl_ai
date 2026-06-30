'use client';

import React, { useEffect, useRef, useState, createContext, useContext } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import type { MotionValue } from 'motion/react';
import Lenis from 'lenis';
import Link from 'next/link';
import {
  Sparkles, ArrowRight, Shield, Database, Workflow, Brain, Bot,
  TrendingUp, BarChart3, Code, CheckCircle2, Zap, Heart,
  Building2, ShoppingCart, Cpu, BookOpen, ChevronRight,
  Server, Network, Layers3, Settings, FileText, Search,
  Lock, Globe, MessageSquare, Users, Mic, Video, Eye,
  Boxes, Radio, LayoutGrid, Webhook, TestTube
} from 'lucide-react';

// ─── Clip-path ───────────────────────────────────────────────────────────────

const clipHero = {
  clipPath: 'polygon(40px 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%, 0 40px)'
};

// ─── Scroll animation system ─────────────────────────────────────────────────

const ScrollProgressContext = createContext<MotionValue<number> | null>(null);

const Word = ({ word, index, total, scrollYProgress }: {
  word: string; index: number; total: number; scrollYProgress: MotionValue<number>;
}) => {
  const span = 0.70;
  const start = (index / total) * span * 0.82;
  const end = start + span / total;
  const opacity = useTransform(scrollYProgress, [start, end], [0.07, 1]);
  const y = useTransform(scrollYProgress, [start, end], [18, 0]);
  return <motion.span className="inline-block mr-[0.28em] last:mr-0" style={{ opacity, y }}>{word}</motion.span>;
};

const WordReveal = ({ text }: { text: string }) => {
  const progress = useContext(ScrollProgressContext);
  const words = text.split(' ');
  if (!progress) return <>{text}</>;
  return <>{words.map((w, i) => <Word key={i} word={w} index={i} total={words.length} scrollYProgress={progress} />)}</>;
};

const SectionReveal = ({ children, id, className = '' }: {
  children: React.ReactNode; id?: string; className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.1'] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 1], [0.32, 0.72, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 0.75, 1], [48, 12, 0]);
  return (
    <ScrollProgressContext.Provider value={scrollYProgress}>
      <div ref={ref} id={id} className={className}>
        <motion.div style={{ scale, opacity, borderRadius, transformOrigin: 'top center', willChange: 'transform, opacity' }}>
          {children}
        </motion.div>
      </div>
    </ScrollProgressContext.Provider>
  );
};

// ─── TechBadge ────────────────────────────────────────────────────────────────

const TechBadge = ({ label, dark = false }: { label: string; dark?: boolean }) => (
  <span className={`px-3 py-1.5 rounded-full text-[10px] font-sans font-semibold border inline-flex items-center gap-1.5 ${dark ? 'bg-zinc-950 border-zinc-800 text-zinc-400' : 'bg-zinc-100 border-zinc-200 text-zinc-600'}`}>
    <span className={`w-1 h-1 rounded-full ${dark ? 'bg-blue-500' : 'bg-zinc-400'}`} />{label}
  </span>
);

// ─── Flow diagram ─────────────────────────────────────────────────────────────

const FlowDiagram = ({ steps, dark = false }: {
  steps: { label: string; sub?: string; icon?: React.ReactNode }[];
  dark?: boolean;
}) => (
  <div className="flex flex-col sm:flex-row items-center gap-3 flex-wrap">
    {steps.map((step, i) => (
      <React.Fragment key={i}>
        <div className={`flex flex-col items-center gap-1 px-4 py-3 rounded-2xl border text-center min-w-[90px] hover:scale-105 hover:-translate-y-0.5 transition-all duration-200 ${dark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
          {step.icon && <span className="mb-0.5">{step.icon}</span>}
          <span className={`text-[11px] font-sans font-bold ${dark ? 'text-zinc-200' : 'text-zinc-900'}`}>{step.label}</span>
          {step.sub && <span className={`text-[10px] font-light leading-tight ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>{step.sub}</span>}
        </div>
        {i < steps.length - 1 && <ChevronRight className={`w-4 h-4 flex-shrink-0 ${dark ? 'text-blue-500' : 'text-zinc-400'}`} />}
      </React.Fragment>
    ))}
  </div>
);

// ─── Industry data ────────────────────────────────────────────────────────────

type Industry = {
  key: string;
  label: string;
  icon: React.ReactNode;
  accentClass: string;
  tagline: string;
  description: string;
  challenges: { title: string; desc: string }[];
  solutions: { title: string; desc: string }[];
  outcomes: { metric: string; description: string }[];
};

const industries: Industry[] = [
  {
    key: 'healthcare',
    label: 'Healthcare',
    icon: <Heart className="w-5 h-5" />,
    accentClass: 'text-indigo-400',
    tagline: 'From clinical documentation to drug discovery — AI across the patient lifecycle.',
    description: 'Fixl AI deploys HIPAA-compliant AI systems that reduce clinician administrative burden, accelerate diagnostics, and improve patient outcomes through predictive analytics and intelligent automation.',
    challenges: [
      { title: 'Clinical Documentation Burden', desc: 'Physicians spend 34–50% of their time on EHR documentation, reducing patient contact hours and accelerating burnout.' },
      { title: 'Diagnostic Accuracy Gaps', desc: 'Radiology and pathology bottlenecks create diagnostic delays affecting critical care pathways and patient risk stratification.' },
      { title: 'Patient No-Shows & Flow', desc: 'Average no-show rates of 18–23% disrupt scheduling, waste capacity, and inflate cost-per-encounter across hospital networks.' },
    ],
    solutions: [
      { title: 'AI Clinical Transcription', desc: 'Real-time ambient transcription converting physician-patient conversations into structured SOAP notes synced to EHR systems — eliminating 80% of documentation time.' },
      { title: 'Medical Imaging AI', desc: 'Vision models identifying anomalies in X-rays, CT scans, MRIs, and pathology slides with clinician-grade accuracy and source heatmaps.' },
      { title: 'Predictive Scheduling', desc: 'ML models predicting no-shows by patient, time, and channel — enabling proactive outreach and double-fill scheduling.' },
    ],
    outcomes: [
      { metric: '4 hrs/day', description: 'saved per physician on documentation tasks with ambient transcription AI' },
      { metric: '94.2%', description: 'diagnostic concordance with specialist panel review for imaging AI models' },
      { metric: '31%', description: 'reduction in appointment no-show rates through predictive intervention' },
    ],
  },
  {
    key: 'financial',
    label: 'Financial Services',
    icon: <Building2 className="w-5 h-5" />,
    accentClass: 'text-blue-400',
    tagline: 'Fraud detection, risk analytics, and compliance automation at financial scale.',
    description: 'SOC-2 and ISO 27001 certified AI deployment for banks, fintechs, and asset managers — covering fraud detection, credit risk modelling, document KYC, and regulatory compliance automation.',
    challenges: [
      { title: 'Real-Time Fraud Detection', desc: 'Legacy rule-based fraud systems generate 40–80% false positives while missing emerging synthetic identity and account takeover patterns.' },
      { title: 'KYC & AML Processing', desc: 'Manual KYC review takes 8–14 days per institutional client, creating onboarding friction and compliance exposure for regulators.' },
      { title: 'Regulatory Reporting', desc: 'Financial institutions spend 250,000+ analyst hours annually on regulatory report generation across Basel III, IFRS 9, and Dodd-Frank requirements.' },
    ],
    solutions: [
      { title: 'Real-Time Fraud ML', desc: 'Graph neural networks analysing transaction networks, device fingerprints, and behavioural patterns — detecting fraud with <200ms decisioning latency.' },
      { title: 'AI-Powered KYC Pipeline', desc: 'Automated document extraction, identity cross-referencing, sanctions list matching, and risk-scoring compressing KYC from 14 days to 4 hours.' },
      { title: 'Regulatory Report Generation', desc: 'LLM-powered extraction from core banking systems generating audit-ready regulatory reports with citation tracking and change logs.' },
    ],
    outcomes: [
      { metric: '94%', description: 'reduction in false positive fraud alerts with graph neural network detection' },
      { metric: '4 hrs', description: 'KYC turnaround time reduced from 14 days via AI document intelligence' },
      { metric: '$2.3M', description: 'annual cost avoided per 1,000 analysts through regulatory report automation' },
    ],
  },
  {
    key: 'retail',
    label: 'Retail',
    icon: <ShoppingCart className="w-5 h-5" />,
    accentClass: 'text-violet-400',
    tagline: 'Personalised commerce, demand intelligence, and AI-driven supply chains.',
    description: 'AI systems that predict what customers want before they search, optimise inventory at SKU level, and automate customer support at enterprise scale — across web, mobile, and in-store channels.',
    challenges: [
      { title: 'Inventory Overstocks & Stockouts', desc: 'US retailers lose $1.75T annually to inventory imbalances — excess safety stock on slow SKUs, stockouts on fast-moving ones during peak demand.' },
      { title: 'Low Personalisation at Scale', desc: 'Static segment-based recommendations drive 1.5–2% CTR. Individual intent modelling remains computationally infeasible with legacy systems.' },
      { title: 'Support Volume at Peak', desc: 'Q4 spikes generate 7–14× normal support ticket volumes, overwhelming human agents and generating 72hr+ response times.' },
    ],
    solutions: [
      { title: 'Demand Forecasting AI', desc: 'LSTM and transformer models on historical sales, weather, events, and social signals generating SKU-level 90-day demand forecasts with CI bands.' },
      { title: 'Hyper-Personalisation Engine', desc: 'Real-time session-aware recommendation engine updating user embeddings on every click — serving next-item and complementary product predictions sub-50ms.' },
      { title: 'Omnichannel Support AI', desc: 'Conversational AI agents handling order tracking, returns, product questions, and complaints across chat, email, and voice — 24/7 with human escalation.' },
    ],
    outcomes: [
      { metric: '23%', description: 'inventory cost reduction through AI demand forecasting at SKU level' },
      { metric: '4.8×', description: 'conversion lift from real-time hyper-personalisation vs static segments' },
      { metric: '83%', description: 'of support volume resolved by AI without human agent escalation' },
    ],
  },
  {
    key: 'manufacturing',
    label: 'Manufacturing',
    icon: <Cpu className="w-5 h-5" />,
    accentClass: 'text-blue-400',
    tagline: 'Predictive maintenance, visual quality inspection, and AI-driven operational intelligence.',
    description: 'Industrial AI systems connecting to SCADA, PLCs, and IoT sensor networks — predicting equipment failure before it happens, detecting defects at line speed, and optimising production schedules autonomously.',
    challenges: [
      { title: 'Unplanned Downtime', desc: 'Equipment failures cost manufacturers $260B/year globally. Average unplanned downtime runs 20 hours per incident with fully burdened costs exceeding $100K/hr in automotive.' },
      { title: 'Manual Quality Inspection', desc: 'Human visual inspection at line speed misses 18–25% of surface defects, driving warranty claims, recalls, and customer satisfaction erosion.' },
      { title: 'Energy & OEE Optimisation', desc: 'Most manufacturers operate at 60–75% OEE with limited visibility into yield, cycle time, and energy cost drivers at the machine level.' },
    ],
    solutions: [
      { title: 'Predictive Maintenance', desc: 'Vibration, temperature, and current signature analysis models predicting bearing failures, motor degradation, and tooling wear 2–7 weeks before failure occurs.' },
      { title: 'Vision-Based Quality Control', desc: 'High-speed camera systems with YOLOv10 and SAM-2 models inspecting 100% of production at line speed — detecting sub-millimetre surface defects.' },
      { title: 'Production Optimisation AI', desc: 'RL-based scheduling models dynamically adjusting production runs, shift planning, and maintenance windows to maximise OEE across the plant floor.' },
    ],
    outcomes: [
      { metric: '87%', description: 'of predicted equipment failures caught before they occur with 72hr+ advance notice' },
      { metric: '99.3%', description: 'defect detection accuracy on production lines replacing manual inspection' },
      { metric: '17%', description: 'improvement in OEE through AI-optimised production scheduling and energy management' },
    ],
  },
  {
    key: 'education',
    label: 'Education',
    icon: <BookOpen className="w-5 h-5" />,
    accentClass: 'text-violet-400',
    tagline: 'Adaptive learning, AI tutors, and intelligent student success systems.',
    description: 'FERPA-compliant AI systems for EdTech platforms, universities, and K-12 institutions — delivering personalised learning paths, early at-risk intervention, and AI-powered assessment at scale.',
    challenges: [
      { title: 'One-Size-Fits-All Instruction', desc: 'Traditional curricula cannot adapt to individual student pace, knowledge gaps, or learning styles — leaving 30–40% of students behind optimal progression.' },
      { title: 'At-Risk Student Identification', desc: 'Institutions identify struggling students after failure events rather than proactively — too late to intervene before course withdrawal or dropout.' },
      { title: 'Faculty Assessment Load', desc: 'Grading and feedback generation consumes 30–45% of faculty time, reducing availability for high-value instructional interactions with students.' },
    ],
    solutions: [
      { title: 'Adaptive Learning Engine', desc: 'Knowledge graph-based curriculum adapting content sequence, difficulty, and modality in real-time based on each student\'s mastery signals and learning pace.' },
      { title: 'Early Intervention AI', desc: 'Engagement and performance models flagging at-risk students 4–6 weeks before they self-identify — triggering personalised advisor outreach automatically.' },
      { title: 'AI Assessment & Feedback', desc: 'LLM-powered grading for essays, short answers, and code assignments with rubric-aligned feedback and growth suggestions — delivered within minutes.' },
    ],
    outcomes: [
      { metric: '+24%', description: 'improvement in student learning outcomes on adaptive curriculum vs standard delivery' },
      { metric: '6 weeks', description: 'earlier at-risk identification enabling proactive intervention before withdrawal' },
      { metric: '65%', description: 'reduction in faculty time spent on routine assessment and feedback tasks' },
    ],
  },
];

// ─── AI Maturity Ladder ───────────────────────────────────────────────────────

const maturityLevels = [
  { level: '01', label: 'Exploration', desc: 'Isolated AI experiments, proof of concepts', color: 'bg-zinc-800 border-zinc-700', textColor: 'text-zinc-400' },
  { level: '02', label: 'Pilot', desc: 'Department-level AI tools in production', color: 'bg-blue-950/50 border-blue-900/50', textColor: 'text-blue-400' },
  { level: '03', label: 'Integration', desc: 'AI embedded in core business workflows', color: 'bg-indigo-950/50 border-indigo-900/50', textColor: 'text-indigo-400' },
  { level: '04', label: 'Scale', desc: 'AI-first operations across business units', color: 'bg-violet-950/50 border-violet-900/50', textColor: 'text-violet-400' },
  { level: '05', label: 'Autonomous', desc: 'Self-optimising AI ecosystem with human oversight', color: 'bg-purple-950/50 border-purple-900/50', textColor: 'text-purple-400' },
];

// ─── IndustriesPage ─────────────────────────────────────────────────────────

export default function IndustriesPage() {
  const [activeIndustry, setActiveIndustry] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [litIndustry, setLitIndustry] = useState<number | null>(null);
  const [dotPosition, setDotPosition] = useState<{ x: number; y: number } | null>(null);
  const [showCookies, setShowCookies] = useState(false);
  useEffect(() => { if (typeof window !== 'undefined' && !sessionStorage.getItem('fixiai-cookies')) setShowCookies(true); }, []);
  const acceptCookies = (all: boolean) => { sessionStorage.setItem('fixiai-cookies', all ? 'all' : 'essential'); setShowCookies(false); };
  const industry = industries[activeIndustry];

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.35,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true, wheelMultiplier: 0.88, touchMultiplier: 2,
    } as any);
    let rafId: number;
    const raf = (time: number) => { lenis.raf(time); rafId = requestAnimationFrame(raf); };
    rafId = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(rafId); lenis.destroy(); };
  }, []);

  useEffect(() => {
    const h = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    let currentIdx = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const animateToNext = () => {
      const totalIndustries = industries.length;
      const angle = (currentIdx / totalIndustries) * 2 * Math.PI - Math.PI / 2;
      const r = 42;
      const targetX = 50 + r * Math.cos(angle);
      const targetY = 50 + r * Math.sin(angle);

      setLitIndustry(null);
      setDotPosition({ x: 50, y: 50 });

      timeoutId = setTimeout(() => {
        setDotPosition({ x: targetX, y: targetY });
        timeoutId = setTimeout(() => {
          setLitIndustry(currentIdx);
          timeoutId = setTimeout(() => {
            currentIdx = (currentIdx + 1) % totalIndustries;
            animateToNext();
          }, 1200);
        }, 800);
      }, 50);
    };

    const startDelay = setTimeout(animateToNext, 1500);
    return () => {
      clearTimeout(startDelay);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0a0a0c] text-[#f4f4f6] font-sans antialiased overflow-x-hidden selection:bg-blue-600/30 selection:text-blue-100">

      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0a0a0c]/90 backdrop-blur-md border-b border-zinc-800/50 py-3.5' : 'bg-transparent py-6'}`}>
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-blue-500/50 group-hover:shadow-[0_0_16px_rgba(59,130,246,0.3)] group-hover:-rotate-6">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl font-semibold tracking-tight text-white">Fixl <span className="text-blue-500 font-light">AI</span></span>
          </Link>
          <div className="hidden lg:flex items-center space-x-8">
            {[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: 'Enterprise', href: '/enterprise' }].map((l) => (
              <Link key={l.href} href={l.href} className="relative text-[13px] font-sans font-medium tracking-tight text-zinc-300 hover:text-zinc-100 transition-colors group">
                {l.label}<span className="absolute -bottom-0.5 left-0 h-[1.5px] bg-blue-400 rounded-full w-0 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>
          <Link href="/enterprise#contact" className="group px-5 py-2.5 rounded-full text-[13px] font-sans font-medium bg-white text-zinc-950 hover:bg-blue-50 hover:shadow-[0_0_22px_rgba(255,255,255,0.22)] hover:scale-105 transition-all duration-200 shadow-md flex items-center gap-1.5">
            Request Demo <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
          </Link>
        </div>
      </nav>

      {/* ═══ HERO ═══════════════════════════════════════════════════════════════ */}
      <motion.section className="relative min-h-screen flex items-center bg-[#0a0a0c] overflow-hidden border-b border-zinc-900 pt-24"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <div className="absolute inset-0 bg-grid-pattern opacity-8 pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-900/8 blur-[140px] pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 w-full py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-[11px] font-sans text-blue-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />Sector-Specific AI Deployment
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold text-white tracking-tight leading-tight">
              AI built for your<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-white">industry's exact context</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.18 }}
              className="text-sm text-zinc-300 font-light leading-relaxed max-w-lg">
              Sector-native AI systems engineered around your regulatory requirements, data architecture, workflows, and operational constraints. Not generic AI — purpose-built for your vertical.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.26 }}
              className="flex flex-wrap gap-3">
              {industries.map((ind, i) => (
                <button key={ind.key} onClick={() => { setActiveIndustry(i); document.getElementById('industry-detail')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-sans font-semibold border transition-all duration-200 ${activeIndustry === i ? 'bg-white text-zinc-950 border-white shadow-[0_0_20px_rgba(255,255,255,0.15)]' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'}`}>
                  <span className={`[&>svg]:w-3.5 [&>svg]:h-3.5 ${activeIndustry === i ? 'text-zinc-950' : ind.accentClass}`}>{ind.icon}</span>
                  {ind.label}
                </button>
              ))}
            </motion.div>
          </div>
          {/* Circular sector selector */}
          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-square">
              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-full border border-zinc-800/40 bg-[radial-gradient(circle,_rgba(30,30,60,0.2)_0%,_transparent_70%)]" />
              <div className="absolute inset-8 rounded-full border border-zinc-800/30" />
              <div className="absolute inset-16 rounded-full border border-zinc-700/20 bg-zinc-950/30" />

              {/* SVG layer for lines + animated dot */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* White connecting lines from center to each industry box */}
                {industries.map((_, i) => {
                  const angle = (i / industries.length) * 2 * Math.PI - Math.PI / 2;
                  const r = 42;
                  const x = 50 + r * Math.cos(angle);
                  const y = 50 + r * Math.sin(angle);
                  return (
                    <line key={i}
                      x1="50" y1="50" x2={x} y2={y}
                      stroke="white" strokeWidth="0.4" strokeOpacity={litIndustry === i ? 0.8 : 0.15}
                      style={{ transition: 'stroke-opacity 0.4s ease' }}
                    />
                  );
                })}

                {/* Animated traveling dot */}
                {dotPosition && (
                  <circle
                    cx={dotPosition.x}
                    cy={dotPosition.y}
                    r="1.5"
                    fill="white"
                    style={{ transition: 'cx 0.8s ease, cy 0.8s ease' }}
                  />
                )}
              </svg>

              {/* Center hub */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center shadow-xl shadow-blue-900/20">
                  <Brain className="w-7 h-7 text-blue-400" />
                </div>
              </div>

              {/* Industry boxes - all dark by default, light up when lit */}
              {industries.map((ind, i) => {
                const angle = (i / industries.length) * 2 * Math.PI - Math.PI / 2;
                const r = 42;
                const x = 50 + r * Math.cos(angle);
                const y = 50 + r * Math.sin(angle);
                const isLit = litIndustry === i;
                const isActive = activeIndustry === i;
                return (
                  <button key={ind.key} onClick={() => setActiveIndustry(i)}
                    style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                    className={`absolute w-14 h-14 rounded-2xl border flex flex-col items-center justify-center gap-0.5 transition-all duration-300 hover:scale-110 ${
                      isLit
                        ? 'bg-white border-white shadow-[0_0_28px_rgba(255,255,255,0.35)] scale-110'
                        : isActive
                        ? 'bg-zinc-800 border-zinc-600'
                        : 'bg-zinc-950 border-zinc-800 hover:border-zinc-600'
                    }`}>
                    <span className={`[&>svg]:w-4 [&>svg]:h-4 ${isLit ? 'text-zinc-950' : ind.accentClass}`}>{ind.icon}</span>
                    <span className={`text-[8px] font-sans font-bold ${isLit ? 'text-zinc-950' : 'text-zinc-400'}`}>{ind.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Cookie banner — absolute bottom, scrolls away with hero */}
        <AnimatePresence>
          {showCookies && (
            <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.45, delay: 2, ease: [0.32, 0.72, 0, 1] }}
              className="absolute bottom-0 left-0 right-0 z-30">
              <div className="bg-[#111113]/95 backdrop-blur-xl border-t border-zinc-800/60">
                <div className="max-w-[1440px] mx-auto px-8 sm:px-12 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                  <div className="space-y-0.5 max-w-xl">
                    <p className="text-sm font-sans font-semibold text-white">We use cookies</p>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed">We use cookies to help this site function and to understand how you use it, so we can improve your experience.</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => acceptCookies(false)} className="px-4 py-2 rounded-full text-[11px] font-sans font-semibold bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all duration-200">Manage Cookies</button>
                    <button onClick={() => acceptCookies(false)} className="px-4 py-2 rounded-full text-[11px] font-sans font-semibold bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all duration-200">Reject non-essential</button>
                    <button onClick={() => acceptCookies(true)} className="px-4 py-2 rounded-full text-[11px] font-sans font-semibold bg-white text-zinc-950 hover:bg-zinc-100 transition-all duration-200">Accept all</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* ═══ INDUSTRY DETAIL ════════════════════════════════════════════════════ */}
      <SectionReveal id="industry-detail" className="relative py-10 lg:py-14 bg-white text-zinc-950 border-b border-zinc-200">
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-10">
          {/* Tab selector */}
          <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-6">
            {industries.map((ind, i) => (
              <button key={ind.key} onClick={() => setActiveIndustry(i)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] font-sans font-semibold border transition-all duration-200 ${activeIndustry === i ? 'bg-zinc-950 text-white border-zinc-950 shadow-lg' : 'bg-transparent border-zinc-300 text-zinc-500 hover:border-zinc-500 hover:text-zinc-800'}`}>
                <span className={`[&>svg]:w-3.5 [&>svg]:h-3.5 ${activeIndustry === i ? 'text-white' : ind.accentClass}`}>{ind.icon}</span>
                {ind.label}
              </button>
            ))}
          </div>
          {/* Industry content */}
          <motion.div key={activeIndustry} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
            className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-4">
                <div className={`w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center ${industry.accentClass}`}>
                  {industry.icon}
                </div>
                <h2 className="text-3xl font-display font-semibold text-zinc-950 tracking-tight">{industry.label}</h2>
                <p className={`text-sm font-sans font-semibold ${industry.accentClass}`}>{industry.tagline}</p>
                <p className="text-xs text-zinc-600 font-light leading-relaxed">{industry.description}</p>
              </div>
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {industry.outcomes.map((o, i) => (
                  <div key={i} className="group p-5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-indigo-200 hover:-translate-y-1 hover:shadow-lg hover:bg-white transition-all duration-300 cursor-pointer">
                    <div className={`text-2xl font-display font-bold tracking-tight ${industry.accentClass} mb-1`}>{o.metric}</div>
                    <p className="text-[11px] text-zinc-500 font-light leading-relaxed">{o.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600 text-[8px]">!</span>
                  Industry Challenges
                </h3>
                <div className="space-y-3">
                  {industry.challenges.map((c, i) => (
                    <div key={i} className="group p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5 hover:border-indigo-200 hover:-translate-y-1 hover:shadow-md hover:bg-white transition-all duration-300 cursor-pointer">
                      <h4 className="text-xs font-sans font-bold text-zinc-950">{c.title}</h4>
                      <p className="text-[11px] text-zinc-500 font-light leading-relaxed">{c.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 text-[8px]">✓</span>
                  Fixl AI Solutions
                </h3>
                <div className="space-y-3">
                  {industry.solutions.map((s, i) => (
                    <div key={i} className="group p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5 hover:border-indigo-200 hover:-translate-y-1 hover:shadow-md hover:bg-white transition-all duration-300 cursor-pointer">
                      <h4 className="text-xs font-sans font-bold text-blue-600">{s.title}</h4>
                      <p className="text-[11px] text-zinc-500 font-light leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </SectionReveal>

      {/* ═══ SECTOR AI MATURITY DIAGRAM ════════════════════════════════════════ */}
      <SectionReveal id="maturity" className="relative py-10 lg:py-14 bg-[#0a0a0c] text-white border-b border-zinc-900">
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-white tracking-tight">
              <WordReveal text="Where is your sector on the AI maturity curve?" />
            </h2>
            <p className="text-sm text-zinc-300 mt-4 font-light leading-relaxed">
              Most enterprises land between Pilot and Integration. Fixl AI's deployment model is designed to advance organisations 2–3 levels within 12 months.
            </p>
          </div>
          {/* Maturity ladder */}
          <div className="space-y-3">
            {maturityLevels.map((m, i) => (
              <div key={i} className={`flex items-center gap-4 py-4 px-5 rounded-2xl border ${m.color} transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(99,102,241,0.12)] cursor-pointer`}
                style={{ paddingLeft: `${1.5 + i * 1.1}rem` }}>
                <span className={`text-[11px] font-sans font-bold tabular-nums ${m.textColor} w-7 flex-shrink-0`}>{m.level}</span>
                <span className={`text-sm font-sans font-bold ${m.textColor} flex-shrink-0 w-28`}>{m.label}</span>
                <span className="text-xs text-zinc-300 font-light flex-1 min-w-0">{m.desc}</span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {i <= 1 && <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">Most orgs today</span>}
                  {i >= 3 && <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-950/50 text-blue-400 border border-blue-900/50">Fixl AI target</span>}
                  <div className={`w-2 h-2 rounded-full ${i <= 1 ? 'bg-zinc-600' : i <= 2 ? 'bg-blue-500 animate-pulse' : 'bg-violet-500 animate-pulse'}`} />
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-900">
            <h3 className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest mb-4">Typical Fixl AI Advancement Journey</h3>
            <FlowDiagram dark steps={[
              { label: 'Assess', sub: 'Current state', icon: <TestTube className="w-3.5 h-3.5 text-blue-400" /> },
              { label: 'PoC', sub: 'First use case', icon: <Zap className="w-3.5 h-3.5 text-violet-400" /> },
              { label: 'Integration', sub: 'Core workflows', icon: <Webhook className="w-3.5 h-3.5 text-purple-400" /> },
              { label: 'Expand', sub: 'Cross-BU rollout', icon: <Network className="w-3.5 h-3.5 text-indigo-400" /> },
              { label: 'Scale', sub: 'AI-first ops', icon: <TrendingUp className="w-3.5 h-3.5 text-blue-400" /> },
            ]} />
            <p className="text-[10px] text-zinc-400 font-light mt-3">Average time from Assessment to Integration: 12–16 weeks. Assessment to Scale: 9–14 months depending on org complexity.</p>
          </div>
        </div>
      </SectionReveal>

      {/* ═══ TECHNOLOGY FOUNDATION ══════════════════════════════════════════════ */}
      <SectionReveal id="tech-stack" className="relative py-10 lg:py-14 bg-[#f4f4f6] text-zinc-950 border-b border-zinc-200">
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-zinc-950 tracking-tight">
              <WordReveal text="Technology foundation powering every vertical." />
            </h2>
            <p className="text-sm text-zinc-600 mt-4 font-light leading-relaxed">
              The same battle-tested technology stack deployed across every industry — configured and fine-tuned for sector-specific data, workflows, and compliance requirements.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="group p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4 hover:border-indigo-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="w-10 h-10 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center">
                <Brain className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-sm font-sans font-bold text-zinc-950">Foundation Models</h3>
              <div className="flex flex-wrap gap-2">
                {['GPT-4o', 'Claude Sonnet 4', 'Gemini 2 Flash', 'Llama 3.3 70B', 'DeepSeek R1', 'Mistral Large', 'Command R+', 'Phi-4'].map(t => <TechBadge key={t} label={t} />)}
              </div>
            </div>
            <div className="group p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4 hover:border-indigo-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="w-10 h-10 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center">
                <Search className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-sm font-sans font-bold text-zinc-950">Embedding & Search</h3>
              <div className="flex flex-wrap gap-2">
                {['text-embedding-3-large', 'BGE-M3', 'Cohere Embed v3', 'CLIP', 'SPLADE++', 'BM25', 'HNSW ANN', 'Faiss'].map(t => <TechBadge key={t} label={t} />)}
              </div>
            </div>
            <div className="group p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4 hover:border-indigo-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="w-10 h-10 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center">
                <Mic className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-sm font-sans font-bold text-zinc-950">Speech & Voice</h3>
              <div className="flex flex-wrap gap-2">
                {['Deepgram Nova-3', 'Whisper v3', 'ElevenLabs Turbo', 'Cartesia Sonic', 'AssemblyAI', 'Azure Speech', 'PlayHT v3'].map(t => <TechBadge key={t} label={t} />)}
              </div>
            </div>
            <div className="group p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4 hover:border-indigo-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="w-10 h-10 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center">
                <Eye className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-sm font-sans font-bold text-zinc-950">Vision & Video AI</h3>
              <div className="flex flex-wrap gap-2">
                {['GPT-4o Vision', 'SAM 2.1', 'YOLOv10', 'PaddleOCR v4', 'Surya OCR', 'Twelve Labs', 'DINO v2', 'Florence 2'].map(t => <TechBadge key={t} label={t} />)}
              </div>
            </div>
            <div className="group p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4 hover:border-indigo-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="w-10 h-10 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center">
                <Workflow className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-sm font-sans font-bold text-zinc-950">Orchestration & Agents</h3>
              <div className="flex flex-wrap gap-2">
                {['LangGraph', 'CrewAI', 'AutoGen v0.4', 'LlamaIndex', 'Haystack v2', 'Temporal.io', 'Prefect 3'].map(t => <TechBadge key={t} label={t} />)}
              </div>
            </div>
            <div className="group p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4 hover:border-indigo-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="w-10 h-10 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center">
                <Server className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-sm font-sans font-bold text-zinc-950">Model Serving</h3>
              <div className="flex flex-wrap gap-2">
                {['vLLM', 'TGI', 'Ollama Enterprise', 'Triton Inference', 'BentoML', 'Ray Serve', 'ONNX Runtime'].map(t => <TechBadge key={t} label={t} />)}
              </div>
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* ═══ INFRASTRUCTURE ════════════════════════════════════════════════════ */}
      <SectionReveal id="infrastructure" className="relative py-10 lg:py-14 bg-[#060e1c] text-white border-b border-[#1a2d4a]/50">
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-white tracking-tight">
              <WordReveal text="Enterprise-grade infrastructure, privately deployed." />
            </h2>
            <p className="text-sm text-zinc-300 mt-4 font-light leading-relaxed">
              All AI systems run on your cloud account or on-premise hardware. No shared infrastructure. No cross-tenant data paths. Your environment, your control.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Globe className="w-5 h-5 text-blue-400" />, title: 'Cloud', items: ['AWS (Bedrock, SageMaker)', 'Azure (OpenAI, ML)', 'GCP (Vertex AI)', 'Private VPC isolation', 'Multi-region HA', 'SOC-2 Type II cloud'] },
              { icon: <Boxes className="w-5 h-5 text-purple-400" />, title: 'Orchestration', items: ['Kubernetes (EKS/GKE/AKS)', 'Docker Compose dev', 'Helm chart packaging', 'ArgoCD GitOps', 'Istio service mesh', 'Auto-scaling HPA'] },
              { icon: <Database className="w-5 h-5 text-blue-400" />, title: 'Vector Stores', items: ['Qdrant (Cloud + OSS)', 'Pinecone Enterprise', 'pgvector (PostgreSQL)', 'Weaviate', 'Chroma', 'Redis VSS'] },
              { icon: <Radio className="w-5 h-5 text-violet-400" />, title: 'Pipelines', items: ['Kafka (event streaming)', 'Apache Airflow 2', 'Prefect 3 workflows', 'dbt transformations', 'Spark (PySpark)', 'Snowflake Streams'] },
            ].map((col, i) => (
              <div key={i} className="group p-5 rounded-2xl bg-[#0c0c0e] border border-zinc-900 space-y-4 hover:border-violet-800/40 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(139,92,246,0.15)] hover:bg-zinc-900 transition-all duration-300 cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center">{col.icon}</div>
                <h4 className="text-xs font-sans font-bold text-white">{col.title}</h4>
                <ul className="space-y-1.5">
                  {col.items.map(item => (
                    <li key={item} className="flex items-center gap-2 text-[11px] text-zinc-300 font-light">
                      <span className="w-1 h-1 rounded-full bg-zinc-700 flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {/* Private AI stack diagram */}
          <div className="p-6 rounded-3xl bg-[#0c0c0e] border border-zinc-900 space-y-4">
            <h3 className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest">Private AI Infrastructure Stack</h3>
            <div className="grid grid-cols-1 gap-2">
              {[
                { label: 'Application Layer', items: ['AI APIs', 'Agent Orchestration', 'RAG Engine', 'Voice Pipeline'], color: 'border-blue-900/50 bg-blue-950/20' },
                { label: 'Model Serving', items: ['vLLM / TGI', 'Triton Inference', 'Auto-scaling', 'Load Balancing'], color: 'border-purple-900/50 bg-purple-950/20' },
                { label: 'Data Layer', items: ['Vector DBs', 'Relational DBs', 'Object Storage', 'Event Streams'], color: 'border-indigo-900/50 bg-indigo-950/20' },
                { label: 'Infrastructure', items: ['Kubernetes', 'Private VPC', 'mTLS + RBAC', 'Secrets Vault'], color: 'border-violet-900/50 bg-violet-950/20' },
              ].map((tier, i) => (
                <div key={i} className={`p-3.5 rounded-xl border ${tier.color} flex flex-wrap items-center gap-3 hover:border-indigo-800/40 hover:shadow-[0_4px_16px_rgba(99,102,241,0.1)] transition-all duration-300 cursor-pointer`}>
                  <span className="text-[10px] font-sans font-bold text-zinc-300 w-32 flex-shrink-0">{tier.label}</span>
                  <div className="flex flex-wrap gap-2">
                    {tier.items.map(item => <span key={item} className="px-2.5 py-1 rounded-lg text-[10px] font-sans font-semibold bg-zinc-950/80 text-zinc-300 border border-zinc-800">{item}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* ═══ ENTERPRISE INTEGRATIONS ════════════════════════════════════════════ */}
      <SectionReveal id="integrations" className="relative py-10 lg:py-14 bg-white text-zinc-950 border-b border-zinc-200">
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-zinc-950 tracking-tight">
              <WordReveal text="Native connectors for your entire enterprise stack." />
            </h2>
            <p className="text-sm text-zinc-600 mt-4 font-light leading-relaxed">
              Pre-built, production-tested integrations into the systems your teams already use — deployed as secure API connectors within your network perimeter.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: <Users className="w-4 h-4 text-blue-600" />, label: 'CRM', items: ['Salesforce', 'HubSpot', 'Pipedrive', 'Zoho CRM'] },
              { icon: <LayoutGrid className="w-4 h-4 text-purple-600" />, label: 'ERP', items: ['SAP S/4HANA', 'Oracle ERP', 'NetSuite', 'Microsoft Dynamics 365'] },
              { icon: <Settings className="w-4 h-4 text-blue-600" />, label: 'ITSM', items: ['ServiceNow', 'Jira Service Mgmt', 'Freshservice', 'Zendesk'] },
              { icon: <MessageSquare className="w-4 h-4 text-violet-600" />, label: 'Communication', items: ['Slack', 'Microsoft Teams', 'Zoom', 'Twilio'] },
              { icon: <FileText className="w-4 h-4 text-indigo-600" />, label: 'Productivity', items: ['Microsoft 365', 'Google Workspace', 'Notion', 'Confluence'] },
              { icon: <BarChart3 className="w-4 h-4 text-indigo-600" />, label: 'Data', items: ['Snowflake', 'Databricks', 'BigQuery', 'Redshift'] },
            ].map((cat, i) => (
              <div key={i} className="group p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3 hover:border-indigo-200 hover:shadow-md hover:-translate-y-1 hover:bg-white transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white border border-zinc-200 flex items-center justify-center shadow-sm">{cat.icon}</div>
                  <span className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest">{cat.label}</span>
                </div>
                <ul className="space-y-1.5">
                  {cat.items.map(item => (
                    <li key={item} className="flex items-center gap-1.5 text-[11px] text-zinc-600 font-light">
                      <CheckCircle2 className="w-3 h-3 text-blue-500 flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </SectionReveal>

      {/* ═══ OBSERVABILITY ══════════════════════════════════════════════════════ */}
      <SectionReveal id="observability" className="relative py-10 lg:py-14 bg-white text-zinc-950 border-b border-zinc-200">
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-zinc-950 tracking-tight">
              <WordReveal text="Full observability across every deployed model." />
            </h2>
            <p className="text-sm text-zinc-600 mt-4 font-light leading-relaxed">
              Proactive AI ops built into every deployment — catch quality degradation, cost spikes, and data drift before they reach your users.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <BarChart3 className="w-5 h-5 text-blue-600" />, title: 'LLM Tracing', desc: 'Langfuse + Arize for token counts, latency, cost, prompt/response pairs, and evaluation scores per request.' },
              { icon: <TrendingUp className="w-5 h-5 text-blue-600" />, title: 'Drift Detection', desc: 'Statistical quality tests on output distributions — alerting when model accuracy degrades below SLA thresholds.' },
              { icon: <Settings className="w-5 h-5 text-purple-600" />, title: 'Infrastructure', desc: 'Prometheus + Grafana for GPU utilisation, request throughput, p99 latency, and queue depth across all services.' },
              { icon: <Shield className="w-5 h-5 text-violet-600" />, title: 'Security Audit', desc: 'All model inputs/outputs logged to immutable audit trail with PII redaction, retention policies, and SIEM integration.' },
            ].map((item, i) => (
              <div key={i} className="group relative overflow-hidden p-5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1.5 hover:bg-white transition-all duration-300 space-y-3 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="relative z-10 w-9 h-9 rounded-xl bg-white border border-zinc-200 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">{item.icon}</div>
                <h4 className="relative z-10 text-xs font-sans font-bold text-zinc-950">{item.title}</h4>
                <p className="relative z-10 text-[11px] text-zinc-500 font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionReveal>

      {/* ═══ CTA + FOOTER ═══════════════════════════════════════════════════════ */}
      <SectionReveal id="industries-cta" className="relative py-10 lg:py-14 bg-[#060e1c] text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-900/10 blur-[130px] pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-10 relative z-10">
          <div style={clipHero}
            className="relative p-10 sm:p-16 bg-gradient-to-tr from-blue-900/40 via-[#0d1e38] to-indigo-950/30 text-center space-y-8 border border-[#1a2d4a]/60 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
            <div className="max-w-2xl mx-auto space-y-3 relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-white tracking-tight leading-tight">
                <WordReveal text="Ready for a sector-specific AI deployment?" />
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light max-w-lg mx-auto">
                Book a 30-minute discovery call. We'll scope an AI deployment plan tailored to your industry's regulatory environment, data architecture, and operational constraints.
              </p>
            </div>
            <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
              <Link href="/enterprise#contact" className="group px-7 py-3.5 rounded-full font-sans text-sm font-semibold bg-white text-zinc-950 hover:bg-blue-50 hover:shadow-[0_8px_32px_rgba(255,255,255,0.2)] hover:scale-[1.04] transition-all duration-200 flex items-center gap-2 shadow-lg">
                Book Sector Assessment <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/enterprise" className="group px-6 py-3.5 rounded-full font-sans text-sm font-semibold border border-[#1a2d4a] text-zinc-300 hover:text-white hover:border-zinc-600 transition-all duration-200 flex items-center gap-1.5">
                View Enterprise Plans <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
              </Link>
            </div>
          </div>
          <footer className="pt-10 border-t border-[#1a2d4a]/40 grid grid-cols-2 md:grid-cols-6 gap-8 text-left text-xs text-zinc-300">
            <div className="col-span-2 space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded bg-[#0d1e38] border border-[#1a2d4a]/60 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-display font-semibold text-white text-sm tracking-tight">Fixl AI</span>
              </div>
              <p className="text-zinc-400 leading-relaxed font-light text-[11px]">Sector-native AI systems engineered for your vertical — deployed on your infrastructure with full compliance.</p>
              <div className="text-zinc-600 font-sans text-[10px] uppercase tracking-wider">&copy; {new Date().getFullYear()} Fixl AI. All rights reserved.</div>
            </div>
            {[
              { title: 'Industries', links: industries.map(ind => ({ l: ind.label, h: '#industry-detail' })) },
              { title: 'Technology', links: [{ l: 'Tech Stack', h: '#tech-stack' }, { l: 'Infrastructure', h: '#infrastructure' }, { l: 'Integrations', h: '#integrations' }, { l: 'Observability', h: '#observability' }] },
              { title: 'Platform', links: [{ l: 'Home', h: '/' }, { l: 'Services', h: '/services' }, { l: 'Enterprise', h: '/enterprise' }] },
              { title: 'Legal', links: [{ l: 'Privacy Charter', h: '/' }, { l: 'Terms of Service', h: '/' }, { l: 'Cookie Policy', h: '/' }] },
            ].map((col, i) => (
              <div key={i} className="space-y-3">
                <h4 className="font-sans text-[10px] uppercase font-bold text-white tracking-widest">{col.title}</h4>
                <ul className="space-y-2 font-light text-zinc-400 text-[11px]">
                  {col.links.map((l) => <li key={l.l}><Link href={l.h} className="hover:text-blue-400 transition-colors">{l.l}</Link></li>)}
                </ul>
              </div>
            ))}
          </footer>
        </div>
      </SectionReveal>

    </div>
  );
}

