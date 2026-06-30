'use client';

import React, { useEffect, useRef, createContext, useContext } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import type { MotionValue } from 'motion/react';
import Lenis from 'lenis';
import Link from 'next/link';
import {
  Sparkles, ArrowRight, ArrowUpRight, Shield, Database,
  Workflow, Mic, Video, Brain, Bot, TrendingUp, Settings,
  BarChart3, Code, CheckCircle2, Zap, RefreshCw,
  Search, GitBranch, Repeat, MessageSquare, Eye, FileText,
  Webhook, Network, BookOpen, TestTube, Users, MapPin, Rocket,
  ChevronRight, Lock, Server, Lightbulb, Briefcase
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

// ─── Reusable sub-capability card ────────────────────────────────────────────

const CapCard = ({ icon, title, desc, dark = false }: {
  icon: React.ReactNode; title: string; desc: string; dark?: boolean;
}) => (
  <div className={`group p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${dark ? 'bg-[#0c0c0e] border-zinc-900 hover:border-zinc-800' : 'bg-white border-zinc-200 hover:border-zinc-300'}`}>
    <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 border group-hover:scale-110 transition-transform ${dark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>{icon}</div>
    <h4 className={`text-xs font-sans font-bold mb-1 ${dark ? 'text-white' : 'text-zinc-900'}`}>{title}</h4>
    <p className={`text-[11px] leading-relaxed font-light ${dark ? 'text-zinc-500' : 'text-zinc-500'}`}>{desc}</p>
  </div>
);

const DarkTag = ({ label }: { label: string }) => (
  <span className="px-2.5 py-1 rounded-full text-[10px] font-sans font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800">{label}</span>
);
const Tag = ({ label }: { label: string }) => (
  <span className="px-2.5 py-1 rounded-full text-[10px] font-sans font-semibold bg-zinc-100 text-zinc-600 border border-zinc-200">{label}</span>
);

// ─── CSS Flow Diagram ─────────────────────────────────────────────────────────

const FlowDiagram = ({ steps, dark = false }: {
  steps: { label: string; sub?: string; icon?: React.ReactNode }[];
  dark?: boolean;
}) => (
  <div className="flex flex-col sm:flex-row items-center gap-3 flex-wrap">
    {steps.map((step, i) => (
      <React.Fragment key={i}>
        <div className={`flex flex-col items-center gap-1 px-4 py-3 rounded-2xl border text-center min-w-[90px] ${dark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
          {step.icon && <span className="mb-0.5">{step.icon}</span>}
          <span className={`text-[11px] font-sans font-bold ${dark ? 'text-zinc-200' : 'text-zinc-900'}`}>{step.label}</span>
          {step.sub && <span className={`text-[10px] font-light leading-tight ${dark ? 'text-zinc-500' : 'text-zinc-500'}`}>{step.sub}</span>}
        </div>
        {i < steps.length - 1 && <ChevronRight className={`w-4 h-4 flex-shrink-0 ${dark ? 'text-blue-500' : 'text-zinc-400'}`} />}
      </React.Fragment>
    ))}
  </div>
);

// ─── ServicesPage ─────────────────────────────────────────────────────────────

export default function ServicesPage() {
  const [isScrolled, setIsScrolled] = React.useState(false);

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
            {[{ label: 'Home', href: '/' }, { label: 'Industries', href: '/industries' }, { label: 'Enterprise', href: '/enterprise' }].map((l) => (
              <Link key={l.href} href={l.href} className="relative text-[13px] font-sans font-medium tracking-tight text-zinc-400 hover:text-zinc-200 transition-colors group">
                {l.label}<span className="absolute -bottom-0.5 left-0 h-[1.5px] bg-blue-400 rounded-full w-0 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>
          <a href="#services-cta" className="group px-5 py-2.5 rounded-full text-[13px] font-sans font-medium bg-white text-zinc-950 hover:bg-blue-50 hover:shadow-[0_0_22px_rgba(255,255,255,0.22)] hover:scale-105 transition-all duration-200 shadow-md flex items-center gap-1.5">
            Book Demo <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
          </a>
        </div>
      </nav>

      {/* ═══ HERO ═══════════════════════════════════════════════════════════════ */}
      <motion.section className="relative min-h-screen flex items-center justify-center bg-[#0a0a0c] overflow-hidden border-b border-zinc-900 pt-24"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <div className="absolute inset-0 bg-grid-pattern opacity-8 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-900/10 blur-[140px] pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 text-center space-y-8 relative z-10 py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-[11px] font-sans text-blue-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />Full-Spectrum Enterprise AI Engineering
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-display font-semibold text-white tracking-tight leading-tight max-w-5xl mx-auto">
            Every AI capability your<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-white">enterprise demands</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.18 }}
            className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto">
            Eight specialised AI engineering practices. One integrated platform. Deployed on your infrastructure with full enterprise security from day one.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.26 }}
            className="flex flex-wrap items-center justify-center gap-3 pt-4">
            {[
              { label: 'LLM Solutions', href: '#llm' }, { label: 'Agentic AI', href: '#agentic' },
              { label: 'RAG Systems', href: '#rag' }, { label: 'AI Automation', href: '#automation' },
              { label: 'Voice AI', href: '#voice' }, { label: 'Multimodal AI', href: '#multimodal' },
              { label: 'Custom AI Dev', href: '#custom' }, { label: 'AI Consulting', href: '#consulting' },
            ].map((s) => (
              <a key={s.href} href={s.href}
                className="px-4 py-2 rounded-full text-[11px] font-sans font-semibold bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-200">
                {s.label}
              </a>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ═══ LLM SOLUTIONS ══════════════════════════════════════════════════════ */}
      <SectionReveal id="llm" className="relative py-10 lg:py-14 bg-white text-zinc-950 border-b border-zinc-200">
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4 space-y-5">
              <div className="w-11 h-11 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center">
                <Brain className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-semibold text-zinc-950 tracking-tight leading-tight">
                <WordReveal text="LLM Solutions" />
              </h2>
              <p className="text-sm text-zinc-600 font-light leading-relaxed">
                Enterprise-grade language model orchestration — from foundation model selection and multi-model routing to prompt engineering, fine-tuning, and sovereign API deployment on your private infrastructure.
              </p>
              <div className="flex flex-wrap gap-2">
                {['GPT-4o', 'Claude 4', 'Llama 3.3', 'DeepSeek R1', 'Mistral', 'Gemini 2'].map(t => <Tag key={t} label={t} />)}
              </div>
            </div>
            <div className="lg:col-span-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CapCard icon={<Brain className="w-4 h-4 text-blue-600" />} title="Foundation Model Routing"
                  desc="Intelligent routing across GPT-4o, Claude, Llama, DeepSeek, and Mistral — selecting the optimal model per task based on latency, cost, and capability." />
                <CapCard icon={<Settings className="w-4 h-4 text-indigo-600" />} title="Prompt Engineering"
                  desc="Systematic few-shot design, chain-of-thought structuring, and automated prompt optimisation with A/B evaluation and regression testing." />
                <CapCard icon={<RefreshCw className="w-4 h-4 text-purple-600" />} title="Fine-Tuning (SFT / LoRA)"
                  desc="Domain-adaptive supervised fine-tuning and LoRA on your proprietary data — increasing accuracy while reducing prompt length by 60–80%." />
                <CapCard icon={<Webhook className="w-4 h-4 text-blue-600" />} title="API Integration & Management"
                  desc="Clean REST/gRPC wrappers with rate limiting, fallback routing, token budgeting, caching, and real-time cost dashboards." />
                <CapCard icon={<TestTube className="w-4 h-4 text-indigo-600" />} title="LLM Evaluation Suite"
                  desc="Automated benchmarking with semantic similarity, faithfulness, hallucination rate, latency distribution, and cost-per-token tracking." />
                <CapCard icon={<Lock className="w-4 h-4 text-violet-600" />} title="Private VPC Deployment"
                  desc="All models deployed air-gapped on your AWS, Azure, GCP, or bare-metal environment. Zero telemetry to third-party providers." />
              </div>
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* ═══ AGENTIC AI ════════════════════════════════════════════════════════ */}
      <SectionReveal id="agentic" className="relative py-10 lg:py-14 bg-[#0a0a0c] text-white border-b border-zinc-900">
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4 space-y-5">
              <div className="w-11 h-11 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-center">
                <Bot className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-semibold text-white tracking-tight leading-tight">
                <WordReveal text="Agentic AI" />
              </h2>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                Autonomous AI systems that plan multi-step operations, call tools, read databases, and complete complex enterprise tasks end-to-end. Move beyond chatbots into cognitive automation.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Task Agents', 'Workflow Agents', 'Research Agents', 'Multi-Agent', 'Tool Calling', 'Memory', 'Reasoning'].map(t => <DarkTag key={t} label={t} />)}
              </div>
            </div>
            <div className="lg:col-span-8 space-y-5">
              {/* Agentic AI Flow Diagram */}
              <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-900 space-y-4">
                <h3 className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest">How Agentic AI Executes a Task</h3>
                <FlowDiagram dark steps={[
                  { label: 'Goal', sub: 'User objective', icon: <Lightbulb className="w-3.5 h-3.5 text-violet-400" /> },
                  { label: 'Plan', sub: 'Decompose steps', icon: <Bot className="w-3.5 h-3.5 text-purple-400" /> },
                  { label: 'Act', sub: 'Call tools / APIs', icon: <Zap className="w-3.5 h-3.5 text-blue-400" /> },
                  { label: 'Observe', sub: 'Process results', icon: <Settings className="w-3.5 h-3.5 text-indigo-400" /> },
                  { label: 'Reflect', sub: 'Adjust plan', icon: <RefreshCw className="w-3.5 h-3.5 text-indigo-400" /> },
                  { label: 'Complete', sub: 'Deliver output', icon: <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> },
                ]} />
                <p className="text-[10px] text-zinc-600 font-light">ReAct + chain-of-thought loop executes autonomously until the goal is fully completed or a human gate is triggered.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CapCard dark icon={<Zap className="w-4 h-4 text-violet-400" />} title="Task Agents"
                  desc="Goal-directed agents that decompose an objective into actions, execute each step, and return a completed result with full reasoning trace." />
                <CapCard dark icon={<Workflow className="w-4 h-4 text-purple-400" />} title="Workflow Agents"
                  desc="Structured pipelines triggering dependent actions across ERP, CRM, databases, and APIs in pre-defined or dynamic sequences." />
                <CapCard dark icon={<Search className="w-4 h-4 text-blue-400" />} title="Research Agents"
                  desc="Autonomous information-gathering agents that retrieve, synthesise, and present multi-source data as structured reports." />
                <CapCard dark icon={<Network className="w-4 h-4 text-indigo-400" />} title="Multi-Agent Orchestration"
                  desc="Orchestrators coordinating fleets of specialised sub-agents in parallel — completing complex workloads up to 8× faster." />
                <CapCard dark icon={<Brain className="w-4 h-4 text-indigo-400" />} title="Advanced Reasoning"
                  desc="CoT, ToT, and ReAct reasoning patterns enabling agents to solve multi-variable enterprise problems accurately." />
                <CapCard dark icon={<Shield className="w-4 h-4 text-indigo-400" />} title="Agent Guardrails"
                  desc="Sandboxed execution, rate limits, adversarial testing, human-in-the-loop gates, and automated rollback on failure." />
              </div>
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* ═══ RAG SYSTEMS ════════════════════════════════════════════════════════ */}
      <SectionReveal id="rag" className="relative py-10 lg:py-14 bg-white text-zinc-950 border-b border-zinc-200">
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4 space-y-5">
              <div className="w-11 h-11 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-semibold text-zinc-950 tracking-tight leading-tight">
                <WordReveal text="RAG Systems" />
              </h2>
              <p className="text-sm text-zinc-600 font-light leading-relaxed">
                Sub-second hybrid semantic search over your internal documents, APIs, and databases. Real-time retrieval-augmented generation with source citations, relevance scoring, and semantic chunking — all on your infrastructure.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Pinecone', 'Qdrant', 'pgvector', 'Weaviate', 'Chroma', 'BM25 + Dense'].map(t => <Tag key={t} label={t} />)}
              </div>
            </div>
            <div className="lg:col-span-8 space-y-5">
              {/* RAG Architecture Diagram */}
              <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-900 space-y-4">
                <h3 className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest">RAG Pipeline Architecture</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest w-16 text-right flex-shrink-0 hidden sm:block">Ingest</div>
                    <FlowDiagram dark steps={[
                      { label: 'Documents', sub: 'PDF, DOCX, HTML', icon: <FileText className="w-3 h-3 text-violet-400" /> },
                      { label: 'Chunking', sub: 'Semantic split', icon: <Settings className="w-3 h-3 text-blue-400" /> },
                      { label: 'Embedding', sub: 'Dense vectors', icon: <Brain className="w-3 h-3 text-purple-400" /> },
                      { label: 'Vector Store', sub: 'Qdrant / pgvector', icon: <Database className="w-3 h-3 text-blue-400" /> },
                    ]} />
                  </div>
                  <div className="border-t border-zinc-800 pt-3 flex flex-col sm:flex-row items-center gap-3">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest w-16 text-right flex-shrink-0 hidden sm:block">Query</div>
                    <FlowDiagram dark steps={[
                      { label: 'User Query', sub: 'Natural language', icon: <MessageSquare className="w-3 h-3 text-blue-400" /> },
                      { label: 'Hybrid Search', sub: 'BM25 + Dense', icon: <Search className="w-3 h-3 text-indigo-400" /> },
                      { label: 'Reranking', sub: 'Cross-encoder', icon: <TrendingUp className="w-3 h-3 text-indigo-400" /> },
                      { label: 'Generation', sub: 'LLM + context', icon: <Bot className="w-3 h-3 text-purple-400" /> },
                      { label: 'Response', sub: 'Cited answer', icon: <CheckCircle2 className="w-3 h-3 text-blue-400" /> },
                    ]} />
                  </div>
                </div>
                <p className="text-[10px] text-zinc-500 font-light">Average query latency: 280ms end-to-end. All retrieval happens inside your private VPC — no data leaves your environment.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CapCard icon={<BookOpen className="w-4 h-4 text-blue-600" />} title="Enterprise Knowledge Base"
                  desc="Index internal wikis, SOPs, product manuals, and institutional knowledge into a searchable vector store with real-time sync." />
                <CapCard icon={<FileText className="w-4 h-4 text-blue-600" />} title="Document Intelligence"
                  desc="PDF, Word, Excel, PPT, and HTML ingestion with semantic chunking, metadata extraction, and layout-aware parsing at scale." />
                <CapCard icon={<Webhook className="w-4 h-4 text-purple-600" />} title="Live API Retrieval"
                  desc="Agents retrieve from REST APIs, GraphQL endpoints, and live data streams — grounding responses in current enterprise data." />
                <CapCard icon={<CheckCircle2 className="w-4 h-4 text-indigo-600" />} title="Source Citations"
                  desc="Every response includes traceable source references, page numbers, and confidence scores for full auditability." />
              </div>
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* ═══ AI AUTOMATION ══════════════════════════════════════════════════════ */}
      <SectionReveal id="automation" className="relative py-10 lg:py-14 bg-[#f4f4f6] text-zinc-950 border-b border-zinc-200">
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4 space-y-5">
              <div className="w-11 h-11 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center">
                <Zap className="w-5 h-5 text-violet-600" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-semibold text-zinc-950 tracking-tight leading-tight">
                <WordReveal text="AI Automation" />
              </h2>
              <p className="text-sm text-zinc-600 font-light leading-relaxed">
                Intelligent pipelines that automate document processing, customer support, sales qualification, and DevOps operations. Replace brittle rule-based RPA with adaptive AI that handles exceptions intelligently.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Process Automation', 'Document AI', 'Customer Support', 'Sales AI', 'DevOps AI', 'Reporting'].map(t => <Tag key={t} label={t} />)}
              </div>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CapCard icon={<Workflow className="w-4 h-4 text-violet-600" />} title="Process Automation"
                desc="AI-powered workflow orchestration replacing manual repetitive tasks — from invoice processing to onboarding workflows end-to-end." />
              <CapCard icon={<FileText className="w-4 h-4 text-blue-600" />} title="Document AI"
                desc="Intelligent extraction, classification, and routing of invoices, contracts, forms, and compliance documents with 99.1% accuracy." />
              <CapCard icon={<MessageSquare className="w-4 h-4 text-blue-600" />} title="Customer Support AI"
                desc="Multi-channel AI agents handling tier-1 and tier-2 queries via chat, email, and voice — with seamless human escalation paths." />
              <CapCard icon={<TrendingUp className="w-4 h-4 text-purple-600" />} title="Sales AI"
                desc="Automated lead scoring, outreach personalisation, CRM data entry, and follow-up sequencing triggered by intent signals." />
              <CapCard icon={<Settings className="w-4 h-4 text-indigo-600" />} title="DevOps Automation"
                desc="AI-driven incident triage, code review automation, test generation, and deployment gating integrated into your CI/CD pipeline." />
              <CapCard icon={<BarChart3 className="w-4 h-4 text-indigo-600" />} title="Reporting & Analytics"
                desc="Automated report generation, anomaly detection, and natural language dashboards surfacing insights from operational data." />
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* ═══ VOICE AI ════════════════════════════════════════════════════════════ */}
      <SectionReveal id="voice" className="relative py-10 lg:py-14 bg-[#060e1c] text-white border-b border-[#1a2d4a]/50">
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4 space-y-5">
              <div className="w-11 h-11 rounded-2xl bg-[#0d1e38] border border-[#1a2d4a]/60 flex items-center justify-center">
                <Mic className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-semibold text-white tracking-tight leading-tight">
                <WordReveal text="Voice AI" />
              </h2>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                Real-time conversational voice agents for enterprise inbound support, outbound sales, and automated call analytics. Sub-300ms response latency, multilingual, fully integrated into your telephony and CRM stack.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Deepgram Nova-2', 'ElevenLabs v2', 'Whisper v3', 'Cartesia Sonic', 'Twilio', 'Vonage'].map(t => <DarkTag key={t} label={t} />)}
              </div>
              {/* Voice latency diagram */}
              <div className="p-4 rounded-2xl bg-[#0c0c0e] border border-zinc-900 space-y-3 mt-2">
                <h4 className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest">Real-Time Voice Pipeline</h4>
                <FlowDiagram dark steps={[
                  { label: 'Caller', icon: <Mic className="w-3 h-3 text-blue-400" /> },
                  { label: 'STT', sub: '<80ms', icon: <Settings className="w-3 h-3 text-blue-400" /> },
                  { label: 'LLM', sub: '<140ms', icon: <Brain className="w-3 h-3 text-purple-400" /> },
                  { label: 'TTS', sub: '<80ms', icon: <Zap className="w-3 h-3 text-violet-400" /> },
                ]} />
                <p className="text-[10px] text-zinc-600 font-light">End-to-end round-trip under 300ms in production on AWS/GCP.</p>
              </div>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CapCard dark icon={<Mic className="w-4 h-4 text-blue-400" />} title="Conversational Voice Agents"
                desc="Natural, low-latency voice agents with human-like turn-taking, interruption handling, and contextual memory across the call." />
              <CapCard dark icon={<MessageSquare className="w-4 h-4 text-blue-400" />} title="Inbound Support"
                desc="AI agents handling inbound calls for product support, appointment booking, billing queries, and FAQ resolution 24/7." />
              <CapCard dark icon={<TrendingUp className="w-4 h-4 text-purple-400" />} title="Outbound Campaigns"
                desc="Automated outbound campaigns for lead qualification, appointment reminders, payment collection, and customer re-engagement." />
              <CapCard dark icon={<BarChart3 className="w-4 h-4 text-blue-400" />} title="Call Analytics"
                desc="Real-time transcription, sentiment analysis, intent detection, and compliance keyword monitoring across all recordings." />
              <CapCard dark icon={<Network className="w-4 h-4 text-violet-400" />} title="Multilingual (40+ Languages)"
                desc="Voice agents with dialect adaptation, code-switching detection, and localised persona configuration across 40 languages." />
              <CapCard dark icon={<Webhook className="w-4 h-4 text-indigo-400" />} title="Telephony Integration"
                desc="Native connectors for Twilio, Vonage, AWS Connect, Genesys, and Five9 with CRM sync to Salesforce, HubSpot, Zendesk." />
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* ═══ MULTIMODAL AI ══════════════════════════════════════════════════════ */}
      <SectionReveal id="multimodal" className="relative py-10 lg:py-14 bg-white text-zinc-950 border-b border-zinc-200">
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4 space-y-5">
              <div className="w-11 h-11 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center">
                <Video className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-semibold text-zinc-950 tracking-tight leading-tight">
                <WordReveal text="Multimodal AI" />
              </h2>
              <p className="text-sm text-zinc-600 font-light leading-relaxed">
                Vision, video, audio, and document understanding models integrated into your enterprise workflows. Automate quality inspection, document extraction, visual search, and content moderation at production scale.
              </p>
              <div className="flex flex-wrap gap-2">
                {['GPT-4o Vision', 'SAM 2', 'YOLOv10', 'PaddleOCR', 'Twelve Labs', 'CLIP'].map(t => <Tag key={t} label={t} />)}
              </div>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CapCard icon={<Eye className="w-4 h-4 text-indigo-600" />} title="Image Analysis"
                desc="Object detection, classification, defect identification, and visual Q&A for manufacturing, retail, and medical imaging." />
              <CapCard icon={<Video className="w-4 h-4 text-blue-600" />} title="Video AI"
                desc="Frame-by-frame analysis for surveillance, safety monitoring, content moderation, and automated video summarisation." />
              <CapCard icon={<Mic className="w-4 h-4 text-blue-600" />} title="Audio Intelligence"
                desc="Speech-to-text, speaker diarisation, audio classification, and noise-robust processing for enterprise media workflows." />
              <CapCard icon={<FileText className="w-4 h-4 text-violet-600" />} title="Advanced OCR & DocAI"
                desc="Layout-aware document understanding extracting structured data from PDFs, handwritten forms, receipts, and scanned docs." />
              <CapCard icon={<Search className="w-4 h-4 text-purple-600" />} title="Visual Search"
                desc="Cross-modal semantic search — find images and videos by natural language. Index millions of assets with CLIP-based embeddings." />
              <CapCard icon={<Shield className="w-4 h-4 text-indigo-600" />} title="Content Moderation"
                desc="Real-time detection of harmful, explicit, or policy-violating content across image, video, and audio streams under 50ms." />
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* ═══ CUSTOM AI DEVELOPMENT ══════════════════════════════════════════════ */}
      <SectionReveal id="custom" className="relative py-10 lg:py-14 bg-[#0a0a0c] text-white border-b border-zinc-900">
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4 space-y-5">
              <div className="w-11 h-11 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-center">
                <Code className="w-5 h-5 text-indigo-400" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-semibold text-white tracking-tight leading-tight">
                <WordReveal text="Custom AI Development" />
              </h2>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                Bespoke model fine-tuning, custom architecture development, and sovereign deployment on your cloud or on-premise. Every model ships with monitoring, versioning, and automated retraining pipelines.
              </p>
              <div className="flex flex-wrap gap-2">
                {['SFT', 'LoRA / QLoRA', 'RLHF', 'DPO', 'vLLM', 'TGI', 'Docker + K8s'].map(t => <DarkTag key={t} label={t} />)}
              </div>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CapCard dark icon={<RefreshCw className="w-4 h-4 text-indigo-400" />} title="Domain Fine-Tuning"
                desc="SFT, LoRA, and QLoRA fine-tuning on your proprietary data — reducing inference cost by up to 60% with domain-specific accuracy gains." />
              <CapCard dark icon={<Server className="w-4 h-4 text-purple-400" />} title="Sovereign Deployment"
                desc="Models containerised with Docker/K8s, served via vLLM or TGI, and deployed air-gapped on your VPC with no outbound data paths." />
              <CapCard dark icon={<BarChart3 className="w-4 h-4 text-blue-400" />} title="Production Monitoring"
                desc="Real-time dashboards tracking output quality, hallucination rate, latency distribution, cost, and data drift over time." />
              <CapCard dark icon={<GitBranch className="w-4 h-4 text-violet-400" />} title="Model Versioning"
                desc="Git-native model registry with full lineage tracking, rollback capability, and A/B shadow deployment testing frameworks." />
              <CapCard dark icon={<Repeat className="w-4 h-4 text-indigo-400" />} title="Auto-Retraining Pipelines"
                desc="Trigger-based retraining on detected production drift — models stay accurate without manual intervention from your team." />
              <CapCard dark icon={<Shield className="w-4 h-4 text-indigo-400" />} title="IP Ownership"
                desc="All custom models, training scripts, and deployment configs are fully owned by you — no lock-in, full code escrow available." />
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* ═══ AI CONSULTING ══════════════════════════════════════════════════════ */}
      <SectionReveal id="consulting" className="relative py-10 lg:py-14 bg-[#f4f4f6] text-zinc-950 border-b border-zinc-200">
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4 space-y-5">
              <div className="w-11 h-11 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-semibold text-zinc-950 tracking-tight leading-tight">
                <WordReveal text="AI Consulting" />
              </h2>
              <p className="text-sm text-zinc-600 font-light leading-relaxed">
                From initial AI readiness assessment and architecture design to governance frameworks and working proof-of-concept delivery in 3 weeks. Principal architects and AI researchers — not account managers.
              </p>
              <div className="flex flex-wrap gap-2">
                {['AI Strategy', 'Architecture', 'Governance', 'PoC Delivery', 'Roadmapping', 'Team Enablement'].map(t => <Tag key={t} label={t} />)}
              </div>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CapCard icon={<Lightbulb className="w-4 h-4 text-blue-600" />} title="AI Strategy"
                desc="Executive-level opportunity mapping, use-case prioritisation, build vs. buy analysis, and a phased deployment roadmap." />
              <CapCard icon={<Network className="w-4 h-4 text-blue-600" />} title="Architecture Design"
                desc="End-to-end technical blueprint covering data pipelines, model selection, retrieval systems, deployment topology, and integrations." />
              <CapCard icon={<Shield className="w-4 h-4 text-blue-600" />} title="AI Governance"
                desc="Compliance framework covering SOC-2, GDPR, HIPAA, ISO 27001, the EU AI Act, and industry-specific regulatory requirements." />
              <CapCard icon={<Rocket className="w-4 h-4 text-purple-600" />} title="PoC in 3 Weeks"
                desc="Working production proof-of-concept on real infrastructure in 3 weeks — with accuracy, latency, and cost benchmarks validated." />
              <CapCard icon={<MapPin className="w-4 h-4 text-indigo-600" />} title="AI Roadmapping"
                desc="6–18 month implementation roadmap with capability milestones, team requirements, infrastructure costs, and expected ROI at each phase." />
              <CapCard icon={<Users className="w-4 h-4 text-indigo-600" />} title="Team Enablement"
                desc="Hands-on training for your engineering teams — prompt engineering, MLOps, agent evaluation, and AI system design." />
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* ═══ DELIVERY METHODOLOGY ═══════════════════════════════════════════════ */}
      <SectionReveal id="methodology" className="relative py-10 lg:py-14 bg-[#060e1c] text-white border-b border-[#1a2d4a]/50">
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-white tracking-tight">
              <WordReveal text="Six-phase AI delivery methodology." />
            </h2>
            <p className="text-sm text-zinc-400 mt-4 font-light leading-relaxed">
              Every Fixl AI engagement follows a structured delivery framework designed to minimise risk, accelerate time-to-value, and ensure every deployed system is production-grade from day one.
            </p>
          </div>
          {/* Phase flow diagram */}
          <div className="p-6 rounded-3xl bg-[#0c0c0e] border border-zinc-900">
            <FlowDiagram dark steps={[
              { label: 'Discovery', sub: 'Week 1', icon: <Search className="w-3.5 h-3.5 text-blue-400" /> },
              { label: 'Assessment', sub: 'Week 2', icon: <TestTube className="w-3.5 h-3.5 text-purple-400" /> },
              { label: 'PoC', sub: 'Week 3–4', icon: <Rocket className="w-3.5 h-3.5 text-violet-400" /> },
              { label: 'Development', sub: 'Sprint cycles', icon: <Code className="w-3.5 h-3.5 text-blue-400" /> },
              { label: 'Deployment', sub: 'Zero-downtime', icon: <Server className="w-3.5 h-3.5 text-indigo-400" /> },
              { label: 'Optimisation', sub: 'Ongoing', icon: <TrendingUp className="w-3.5 h-3.5 text-indigo-400" /> },
            ]} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { num: '01', icon: <Search className="w-4 h-4 text-blue-400" />, title: 'Discovery', desc: 'Deep-dive into your data landscape, existing systems, and business objectives. Define success metrics, integration points, and scope.' },
              { num: '02', icon: <TestTube className="w-4 h-4 text-purple-400" />, title: 'Assessment', desc: 'Technical readiness audit of your infrastructure, data quality scoring, and competitive landscape analysis to set the optimal build path.' },
              { num: '03', icon: <Rocket className="w-4 h-4 text-violet-400" />, title: 'Proof of Concept', desc: 'Working prototype on real infrastructure in 3 weeks. Measures accuracy, latency, and cost against agreed KPIs before full build begins.' },
              { num: '04', icon: <Code className="w-4 h-4 text-blue-400" />, title: 'Development', desc: 'Agile 2-week sprints with continuous testing. Full-stack AI engineering — models, pipelines, APIs, agents, UIs, and integrations.' },
              { num: '05', icon: <Server className="w-4 h-4 text-indigo-400" />, title: 'Deployment', desc: 'Zero-downtime blue-green rollout with automated CI/CD, monitoring integration, runbook documentation, and SLA activation.' },
              { num: '06', icon: <TrendingUp className="w-4 h-4 text-indigo-400" />, title: 'Optimisation', desc: 'Continuous drift monitoring, auto-retraining triggers, and quarterly KPI reviews ensuring performance stays above agreed thresholds.' },
            ].map((phase, i) => (
              <div key={i} className="group p-6 rounded-3xl bg-[#0c0c0e] border border-zinc-900 hover:border-zinc-700 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">{phase.icon}</div>
                  <span className="text-[10px] font-sans font-bold text-zinc-600 tracking-widest">{phase.num}</span>
                </div>
                <h3 className="text-sm font-sans font-bold text-white mb-2">{phase.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed font-light">{phase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionReveal>

      {/* ═══ MLOPS & AI LIFECYCLE ════════════════════════════════════════════════ */}
      <SectionReveal id="mlops" className="relative py-10 lg:py-14 bg-white text-zinc-950 border-b border-zinc-200">
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-zinc-950 tracking-tight">
              <WordReveal text="MLOps & AI Lifecycle Management" />
            </h2>
            <p className="text-sm text-zinc-600 mt-4 font-light leading-relaxed">
              Production AI systems degrade without active lifecycle management. Fixl AI implements full MLOps infrastructure so every deployed model maintains its initial accuracy — indefinitely.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { icon: <Server className="w-5 h-5 text-blue-600" />, title: 'Deployment', desc: 'Docker, K8s, vLLM, TGI. One-command blue-green rollouts.' },
              { icon: <BarChart3 className="w-5 h-5 text-purple-600" />, title: 'Monitoring', desc: 'Prometheus, Grafana, Langfuse, Arize for quality and latency.' },
              { icon: <GitBranch className="w-5 h-5 text-blue-600" />, title: 'Versioning', desc: 'DVC + MLflow registry with lineage and rollback support.' },
              { icon: <TestTube className="w-5 h-5 text-violet-600" />, title: 'Evaluation', desc: 'RAGAS, TruLens, and custom domain benchmark suites.' },
              { icon: <Repeat className="w-5 h-5 text-indigo-600" />, title: 'CI/CD', desc: 'GitHub Actions pipelines with model gating and auto-rollback.' },
            ].map((item, i) => (
              <div key={i} className="group p-6 rounded-3xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-center">
                <div className="w-11 h-11 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-sm">{item.icon}</div>
                <h3 className="text-xs font-sans font-bold text-zinc-950 mb-2">{item.title}</h3>
                <p className="text-[11px] text-zinc-500 leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionReveal>

      {/* ═══ CTA + FOOTER ════════════════════════════════════════════════════════ */}
      <SectionReveal id="services-cta" className="relative py-10 lg:py-14 bg-[#0a0a0c] text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-900/10 blur-[130px] pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-10 relative z-10">
          <div style={clipHero}
            className="relative p-10 sm:p-16 bg-gradient-to-tr from-blue-900/40 via-zinc-950 to-indigo-950/30 text-center space-y-8 border border-zinc-800 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
            <div className="max-w-2xl mx-auto space-y-3 relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-white tracking-tight leading-tight">
                <WordReveal text="Ready to build your enterprise AI system?" />
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light max-w-lg mx-auto">
                Book a 30-minute discovery call with our principal AI engineers. We'll scope your system and outline a delivery timeline within the call.
              </p>
            </div>
            <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
              <Link href="/enterprise#contact" className="group px-7 py-3.5 rounded-full font-sans text-sm font-semibold bg-white text-zinc-950 hover:bg-blue-50 hover:shadow-[0_8px_32px_rgba(255,255,255,0.2)] hover:scale-[1.04] transition-all duration-200 flex items-center gap-2 shadow-lg">
                Book Architecture Review <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/" className="px-6 py-3.5 rounded-full font-sans text-sm font-semibold border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition-all duration-200">
                ← Back to Home
              </Link>
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
              <p className="text-zinc-500 leading-relaxed font-light text-[11px]">Custom AI systems, model integrations, and autonomous workflows. Built for enterprise. Deployed in weeks.</p>
              <div className="text-zinc-600 font-sans text-[10px] uppercase tracking-wider">&copy; {new Date().getFullYear()} Fixl AI. All rights reserved.</div>
            </div>
            {[
              { title: 'Services', links: [{ l: 'LLM Solutions', h: '#llm' }, { l: 'Agentic AI', h: '#agentic' }, { l: 'RAG Systems', h: '#rag' }, { l: 'Voice AI', h: '#voice' }] },
              { title: 'More Services', links: [{ l: 'AI Automation', h: '#automation' }, { l: 'Multimodal AI', h: '#multimodal' }, { l: 'Custom AI Dev', h: '#custom' }, { l: 'AI Consulting', h: '#consulting' }] },
              { title: 'Platform', links: [{ l: 'Home', h: '/' }, { l: 'Industries', h: '/industries' }, { l: 'Enterprise', h: '/enterprise' }] },
              { title: 'Legal', links: [{ l: 'Privacy Charter', h: '/' }, { l: 'Terms of Service', h: '/' }, { l: 'Cookie Policy', h: '/' }] },
            ].map((col, i) => (
              <div key={i} className="space-y-3">
                <h4 className="font-sans text-[10px] uppercase font-bold text-white tracking-widest">{col.title}</h4>
                <ul className="space-y-2 font-light text-zinc-500 text-[11px]">
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
