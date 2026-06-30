'use client';

import React, { useEffect, useRef, useState, createContext, useContext } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import type { MotionValue } from 'motion/react';
import Lenis from 'lenis';
import Link from 'next/link';
import {
  Sparkles, ArrowRight, Shield, Database, Workflow, Brain, Bot,
  TrendingUp, BarChart3, CheckCircle2, Zap, Lock, Server,
  Code, Settings, Network, FileText, MessageSquare, Users,
  Globe, Award, Building2, Briefcase, ChevronRight,
  XCircle, MinusCircle, Phone, Mail, Calendar
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

// ─── FlowDiagram ─────────────────────────────────────────────────────────────

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

// ─── Pricing data ─────────────────────────────────────────────────────────────

const pricingPlans = [
  {
    name: 'Starter',
    price: '$8,500',
    period: '/month',
    tagline: 'Single AI use case, delivered in 4 weeks',
    features: [
      '1 AI system (LLM, RAG, or Agentic)',
      'Up to 3 integrations',
      'Private VPC deployment',
      '99.5% uptime SLA',
      'Email + chat support',
      'Monthly performance review',
      '1 foundation model',
      'Basic monitoring dashboard',
    ],
    cta: 'Start with Starter',
    highlight: false,
  },
  {
    name: 'Growth',
    price: '$22,000',
    period: '/month',
    tagline: 'Multi-system AI platform for growing teams',
    features: [
      'Up to 4 AI systems',
      'Up to 10 integrations',
      'Multi-region deployment',
      '99.9% uptime SLA',
      'Dedicated Slack channel',
      'Bi-weekly strategy calls',
      'Multi-model routing',
      'Full observability stack',
      'Custom evaluation suite',
      '3 fine-tuned models included',
    ],
    cta: 'Accelerate Growth',
    highlight: true,
  },
  {
    name: 'Scale',
    price: '$55,000',
    period: '/month',
    tagline: 'Enterprise AI platform across business units',
    features: [
      'Unlimited AI systems',
      'Unlimited integrations',
      'Global multi-region HA',
      '99.99% uptime SLA',
      'Dedicated AI engineering team',
      'Weekly architecture reviews',
      'Full model lifecycle management',
      'Custom agent frameworks',
      'RBAC + SSO + audit logs',
      'Compliance reporting suite',
      'Priority feature development',
    ],
    cta: 'Scale Enterprise AI',
    highlight: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    tagline: 'Sovereign AI platform for complex enterprises',
    features: [
      'Everything in Scale',
      'On-premise / air-gapped deployment',
      'Custom SLA (up to 99.999%)',
      'Embedded engineering team',
      'Executive AI advisory',
      'Custom compliance frameworks',
      'Board-level reporting',
      'IP ownership & code escrow',
      'Training & enablement',
    ],
    cta: 'Contact Enterprise Team',
    highlight: false,
  },
];

// ─── Comparison data ─────────────────────────────────────────────────────────

const comparisonRows = [
  { feature: 'Time to production', fixiai: '3–6 weeks', cloud: '6–18 months', consulting: '3–12 months', startups: '3–8 months', vendors: '2–6 months' },
  { feature: 'Custom model fine-tuning', fixiai: '✓', cloud: '✓', consulting: '✓', startups: '~', vendors: '✗' },
  { feature: 'Enterprise security (SOC2, HIPAA)', fixiai: '✓', cloud: '✓', consulting: '~', startups: '~', vendors: '✓' },
  { feature: 'IP ownership', fixiai: '✓ (full)', cloud: '✗', consulting: '~', startups: '✗', vendors: '✗' },
  { feature: 'Private VPC deployment', fixiai: '✓', cloud: '✓', consulting: '✓', startups: '~', vendors: '✗' },
  { feature: 'Multi-model routing', fixiai: '✓', cloud: '✗', consulting: '~', startups: '~', vendors: '✗' },
  { feature: 'AI governance framework', fixiai: '✓', cloud: '~', consulting: '✓', startups: '✗', vendors: '~' },
  { feature: 'Ongoing optimisation', fixiai: '✓ (SLA)', cloud: '✗', consulting: '✗', startups: '~', vendors: '~' },
  { feature: 'ROI guarantee', fixiai: '✓', cloud: '✗', consulting: '✗', startups: '✗', vendors: '✗' },
];

// ─── Managed Services data ───────────────────────────────────────────────────

const managedServices = [
  { icon: <Server className="w-5 h-5 text-blue-600" />, title: 'AI Infrastructure Management', desc: 'We own the servers, uptime, scaling, and model updates. You own the business outcomes. Zero infrastructure burden on your team.' },
  { icon: <Settings className="w-5 h-5 text-purple-600" />, title: 'Continuous Model Optimisation', desc: 'Monthly evaluation cycles with accuracy, latency, and cost benchmarking. Models retrained when drift exceeds defined thresholds.' },
  { icon: <Shield className="w-5 h-5 text-blue-600" />, title: 'Security Patch Management', desc: 'CVE monitoring, dependency audits, and zero-downtime security updates applied within 24 hours of critical vulnerability disclosure.' },
  { icon: <BarChart3 className="w-5 h-5 text-violet-600" />, title: 'KPI Reporting & Reviews', desc: 'Monthly executive dashboards and bi-quarterly strategy reviews aligned to the business metrics defined in your engagement contract.' },
  { icon: <Users className="w-5 h-5 text-indigo-600" />, title: 'Dedicated Engineering Support', desc: '24/7 incident response on Growth+ plans. P1 SLA: 30 minutes response, 4 hours resolution. P2: 2-hour response, 24-hour resolution.' },
  { icon: <Zap className="w-5 h-5 text-indigo-600" />, title: 'Feature Development Pipeline', desc: 'Ongoing product evolution — new capabilities, integrations, and agent skills deployed on your platform every sprint cycle.' },
];

// ─── EnterprisePage ─────────────────────────────────────────────────────────

export default function EnterprisePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', company: '', role: '', message: '' });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  const inputClass = 'w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs font-light placeholder-zinc-600 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all';

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
            {[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: 'Industries', href: '/industries' }].map((l) => (
              <Link key={l.href} href={l.href} className="relative text-[13px] font-sans font-medium tracking-tight text-zinc-400 hover:text-zinc-200 transition-colors group">
                {l.label}<span className="absolute -bottom-0.5 left-0 h-[1.5px] bg-blue-400 rounded-full w-0 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>
          <a href="#contact" className="group px-5 py-2.5 rounded-full text-[13px] font-sans font-medium bg-white text-zinc-950 hover:bg-blue-50 hover:shadow-[0_0_22px_rgba(255,255,255,0.22)] hover:scale-105 transition-all duration-200 shadow-md flex items-center gap-1.5">
            Talk to Sales <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
          </a>
        </div>
      </nav>

      {/* ═══ HERO ═══════════════════════════════════════════════════════════════ */}
      <motion.section className="relative min-h-screen flex items-center bg-[#0a0a0c] overflow-hidden border-b border-zinc-900 pt-24"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <div className="absolute inset-0 bg-grid-pattern opacity-8 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-blue-900/8 blur-[150px] pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 w-full py-16 space-y-10 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-[11px] font-sans text-blue-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />Enterprise AI Platform
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-8">
              <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold text-white tracking-tight leading-tight">
                Enterprise AI.<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-white">Delivered with a guarantee.</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.18 }}
                className="text-sm text-zinc-400 font-light leading-relaxed max-w-lg">
                Transparent fixed-scope contracts. SOC-2 and ISO 27001 certified infrastructure. ROI guarantee backed by SLA credits. If agreed performance metrics aren't hit within 90 days, you don't pay for that period.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.26 }}
                className="flex flex-wrap gap-3">
                {['SOC-2 Type II', 'ISO 27001', 'GDPR', 'HIPAA', 'PCI DSS', 'EU AI Act'].map(badge => (
                  <span key={badge} className="px-3 py-1.5 rounded-full text-[10px] font-sans font-bold bg-zinc-950 border border-zinc-800 text-zinc-300 flex items-center gap-1.5">
                    <Award className="w-3 h-3 text-blue-400" />{badge}
                  </span>
                ))}
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.34 }}
                className="flex flex-wrap gap-3">
                <a href="#pricing" className="group px-7 py-3.5 rounded-full font-sans text-sm font-semibold bg-white text-zinc-950 hover:bg-blue-50 hover:shadow-[0_8px_32px_rgba(255,255,255,0.2)] hover:scale-[1.04] transition-all duration-200 flex items-center gap-2 shadow-lg">
                  View Pricing <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="#contact" className="px-6 py-3.5 rounded-full font-sans text-sm font-semibold border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition-all duration-200">
                  Talk to Sales
                </a>
              </motion.div>
            </div>
            {/* Security compliance visual */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-2 gap-4">
              {[
                { icon: <Lock className="w-6 h-6 text-blue-400" />, title: 'Zero-Trust Security', desc: 'mTLS between all services, RBAC at every API layer, vault-managed secrets.' },
                { icon: <Shield className="w-6 h-6 text-blue-400" />, title: 'Data Sovereignty', desc: 'Your data never leaves your VPC. No cross-tenant paths. Full audit trail.' },
                { icon: <Server className="w-6 h-6 text-purple-400" />, title: 'Air-Gap Ready', desc: 'On-premise deployment with no outbound internet dependency required.' },
                { icon: <Award className="w-6 h-6 text-violet-400" />, title: 'Compliance Certified', desc: 'SOC-2 Type II, ISO 27001, GDPR, HIPAA, PCI DSS, EU AI Act aligned.' },
              ].map((item, i) => (
                <div key={i} className="group p-5 rounded-2xl bg-zinc-950 border border-zinc-900 hover:border-zinc-700 transition-all duration-200 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">{item.icon}</div>
                  <h4 className="text-xs font-sans font-bold text-white">{item.title}</h4>
                  <p className="text-[11px] text-zinc-500 font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ═══ SECURITY ARCHITECTURE ══════════════════════════════════════════════ */}
      <SectionReveal id="security" className="relative py-10 lg:py-14 bg-white text-zinc-950 border-b border-zinc-200">
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-zinc-950 tracking-tight">
              <WordReveal text="Six-pillar security architecture." />
            </h2>
            <p className="text-sm text-zinc-600 mt-4 font-light leading-relaxed">
              Security is not a bolt-on — it's the foundation every Fixl AI system is built on. Each pillar is audited quarterly and covered by your compliance SLA.
            </p>
          </div>
          {/* Security architecture diagram */}
          <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-900 space-y-4">
            <h3 className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest">Request Security Flow</h3>
            <FlowDiagram dark steps={[
              { label: 'Client', sub: 'Authenticated', icon: <Users className="w-3.5 h-3.5 text-blue-400" /> },
              { label: 'WAF + DDoS', sub: 'Edge filter', icon: <Shield className="w-3.5 h-3.5 text-blue-400" /> },
              { label: 'API Gateway', sub: 'Rate limit + RBAC', icon: <Settings className="w-3.5 h-3.5 text-purple-400" /> },
              { label: 'Service Mesh', sub: 'mTLS + tracing', icon: <Network className="w-3.5 h-3.5 text-indigo-400" /> },
              { label: 'AI Engine', sub: 'Private VPC', icon: <Brain className="w-3.5 h-3.5 text-violet-400" /> },
              { label: 'Audit Log', sub: 'Immutable', icon: <FileText className="w-3.5 h-3.5 text-indigo-400" /> },
            ]} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: <Lock className="w-5 h-5 text-blue-600" />, title: 'Identity & Access', desc: 'SSO integration (Okta, Azure AD, Google), RBAC with attribute-based policies, MFA enforced, JIT provisioning with least-privilege defaults.', badges: ['OAuth 2.0', 'SAML 2.0', 'SCIM', 'JIT'] },
              { icon: <Shield className="w-5 h-5 text-blue-600" />, title: 'Network Security', desc: 'Private VPC with no public endpoints. All traffic encrypted TLS 1.3 in transit. WAF, DDoS protection, and anomaly detection at network perimeter.', badges: ['TLS 1.3', 'VPN', 'WAF', 'DDoS Shield'] },
              { icon: <Database className="w-5 h-5 text-purple-600" />, title: 'Data Protection', desc: 'AES-256 encryption at rest. Column-level PII detection and redaction. Customer-managed encryption keys (CMEK). Data residency controls per region.', badges: ['AES-256', 'CMEK', 'PII Redaction', 'RBAC'] },
              { icon: <FileText className="w-5 h-5 text-violet-600" />, title: 'Audit & Compliance', desc: 'Immutable audit logs for every model input/output, access event, and configuration change. SIEM integration with retention policy controls.', badges: ['SOC-2 Type II', 'ISO 27001', 'GDPR', 'HIPAA'] },
              { icon: <Settings className="w-5 h-5 text-indigo-600" />, title: 'Model Governance', desc: 'Every model version tracked in secure registry. Prompt injection detection, output validation, and hallucination scoring per request.', badges: ['EU AI Act', 'NIST AI RMF', 'Bias Testing'] },
              { icon: <Globe className="w-5 h-5 text-indigo-600" />, title: 'Business Continuity', desc: 'Multi-region active-active deployment with automated failover. RTO < 15 minutes, RPO < 5 minutes. Quarterly DR tests with documented results.', badges: ['99.99% SLA', 'Blue-Green', 'Multi-AZ', 'DR Tested'] },
            ].map((pillar, i) => (
              <div key={i} className="group p-6 rounded-3xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">{pillar.icon}</div>
                <h3 className="text-sm font-sans font-bold text-zinc-950">{pillar.title}</h3>
                <p className="text-[11px] text-zinc-500 font-light leading-relaxed">{pillar.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {pillar.badges.map(b => <span key={b} className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-zinc-100 border border-zinc-200 text-zinc-600">{b}</span>)}
                </div>
              </div>
            ))}
          </div>
          {/* Compliance badge wall */}
          <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-200">
            <h3 className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest mb-5">Compliance Certifications</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'SOC 2 Type II', sub: 'Annual audit', color: 'text-blue-600 border-blue-200 bg-blue-50' },
                { label: 'ISO 27001', sub: 'Certified', color: 'text-indigo-600 border-indigo-200 bg-indigo-50' },
                { label: 'GDPR', sub: 'Article 28 DPA', color: 'text-purple-600 border-purple-200 bg-purple-50' },
                { label: 'HIPAA', sub: 'BAA available', color: 'text-violet-600 border-violet-200 bg-violet-50' },
                { label: 'PCI DSS', sub: 'Level 1', color: 'text-blue-700 border-blue-300 bg-blue-100' },
                { label: 'EU AI Act', sub: 'High-risk ready', color: 'text-purple-700 border-purple-300 bg-purple-100' },
              ].map((badge, i) => (
                <div key={i} className={`p-4 rounded-2xl border text-center space-y-1.5 ${badge.color}`}>
                  <Award className={`w-5 h-5 mx-auto ${badge.color.split(' ')[0]}`} />
                  <div className={`text-[11px] font-sans font-bold ${badge.color.split(' ')[0]}`}>{badge.label}</div>
                  <div className="text-[10px] text-zinc-500 font-light">{badge.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* ═══ PRICING ════════════════════════════════════════════════════════════ */}
      <SectionReveal id="pricing" className="relative py-10 lg:py-14 bg-[#0a0a0c] text-white border-b border-zinc-900">
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-white tracking-tight">
              <WordReveal text="Transparent pricing. No surprises." />
            </h2>
            <p className="text-sm text-zinc-400 mt-4 font-light leading-relaxed">
              Fixed monthly retainers with fully scoped deliverables. Every plan includes private deployment, security compliance, and dedicated engineering support.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pricingPlans.map((plan, i) => (
              <div key={i} className={`relative flex flex-col rounded-3xl border p-6 space-y-5 transition-all duration-200 hover:-translate-y-0.5 ${plan.highlight ? 'bg-blue-600/10 border-blue-500/40 shadow-[0_0_40px_rgba(59,130,246,0.12)]' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]'}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-bold shadow-lg">Most Popular</div>
                )}
                <div>
                  <h3 className="text-sm font-sans font-bold mb-1 text-white">{plan.name}</h3>
                  <p className="text-[11px] font-light text-zinc-400">{plan.tagline}</p>
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-display font-bold tracking-tight text-white">{plan.price}</span>
                  {plan.period && <span className="text-xs font-light mb-1 text-zinc-400">{plan.period}</span>}
                </div>
                <ul className="space-y-2 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-[11px] font-light text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-blue-400" />{f}
                    </li>
                  ))}
                </ul>
                <a href="#contact"
                  className={`mt-auto block w-full text-center py-3 rounded-xl text-[12px] font-sans font-semibold transition-all duration-200 ${plan.highlight ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_4px_16px_rgba(59,130,246,0.4)]' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}>
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-[11px] text-zinc-500 font-light">All plans include a 30-day onboarding period. Annual billing available at 15% discount. Enterprise plans billed quarterly.</p>
        </div>
      </SectionReveal>

      {/* ═══ MANAGED AI SERVICES ════════════════════════════════════════════════ */}
      <SectionReveal id="managed-services" className="relative py-10 lg:py-14 bg-white text-zinc-950 border-b border-zinc-200">
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-zinc-950 tracking-tight">
              <WordReveal text="Managed AI — we run it, you scale it." />
            </h2>
            <p className="text-sm text-zinc-600 mt-4 font-light leading-relaxed">
              Fixl AI operates your entire AI stack as a managed service. Your team focuses on business outcomes. We handle the infrastructure, model quality, security, and continuous improvement.
            </p>
          </div>
          {/* Managed service operation loop */}
          <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-200 space-y-4">
            <h3 className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest">Managed AI Operations Cycle</h3>
            <FlowDiagram steps={[
              { label: 'Deploy', sub: 'Production launch', icon: <Server className="w-3.5 h-3.5 text-blue-600" /> },
              { label: 'Monitor', sub: '24/7 ops', icon: <BarChart3 className="w-3.5 h-3.5 text-purple-600" /> },
              { label: 'Evaluate', sub: 'Quality checks', icon: <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> },
              { label: 'Optimise', sub: 'Retrain + tune', icon: <Settings className="w-3.5 h-3.5 text-blue-600" /> },
              { label: 'Report', sub: 'KPI review', icon: <FileText className="w-3.5 h-3.5 text-violet-600" /> },
              { label: 'Evolve', sub: 'New features', icon: <Zap className="w-3.5 h-3.5 text-indigo-600" /> },
            ]} />
            <p className="text-[10px] text-zinc-500 font-light">This cycle repeats monthly at minimum, weekly for Growth and Scale plans.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {managedServices.map((service, i) => (
              <div key={i} className="group p-6 rounded-3xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">{service.icon}</div>
                <h4 className="text-xs font-sans font-bold text-zinc-950">{service.title}</h4>
                <p className="text-[11px] text-zinc-500 font-light leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionReveal>

      {/* ═══ ROI GUARANTEE ══════════════════════════════════════════════════════ */}
      <SectionReveal id="roi" className="relative py-10 lg:py-14 bg-[#0a0a0c] text-white border-b border-zinc-900">
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-white tracking-tight">
              <WordReveal text="We guarantee ROI. Or you don't pay." />
            </h2>
            <p className="text-sm text-zinc-400 mt-4 font-light leading-relaxed">
              Every Fixl AI engagement defines measurable performance targets at kickoff. If those targets aren't achieved within 90 days of go-live, the period is credited. No disputes. No exceptions.
            </p>
          </div>
          <div style={clipHero} className="relative p-8 sm:p-10 bg-gradient-to-br from-blue-900/20 via-zinc-950 to-indigo-950/20 border border-zinc-800 overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-8 pointer-events-none" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2 space-y-5">
                <h3 className="text-xl font-display font-semibold text-white">How the ROI Guarantee Works</h3>
                <div className="space-y-3">
                  {[
                    { step: '1', title: 'Define Targets at Kickoff', desc: 'Together we define 3–5 measurable KPIs (accuracy %, cost reduction %, response time, task completion rate). These become contract obligations.' },
                    { step: '2', title: 'Monitor Throughout Delivery', desc: 'Real-time dashboard shows all KPIs. Both parties review progress weekly during the build phase and monthly post-deployment.' },
                    { step: '3', title: 'Credit or Verify at 90 Days', desc: 'If all KPIs are hit: standard billing continues. If any KPI misses: the entire billing period is credited until the target is achieved and sustained.' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="w-6 h-6 rounded-full bg-blue-900/40 border border-blue-800/50 text-blue-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{item.step}</span>
                      <div>
                        <h4 className="text-xs font-sans font-bold text-white mb-0.5">{item.title}</h4>
                        <p className="text-[11px] text-zinc-400 font-light leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <h4 className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest">Typical Guaranteed Targets</h4>
                  {[
                    'Accuracy ≥ agreed benchmark',
                    'P99 latency ≤ contracted SLA',
                    'Uptime ≥ tier SLA percentage',
                    'Task completion rate ≥ 90%',
                    'Cost per call ≤ agreed budget',
                  ].map(target => (
                    <div key={target} className="flex items-center gap-2 text-[11px] text-zinc-400 font-light">
                      <CheckCircle2 className="w-3 h-3 text-blue-400 flex-shrink-0" />{target}
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-2xl bg-zinc-950 border border-blue-900/40 text-center space-y-1">
                  <div className="text-xs font-sans font-bold text-blue-400">Guarantee Coverage</div>
                  <div className="text-3xl font-display font-bold text-white">90</div>
                  <div className="text-[10px] text-zinc-500 font-light">days from go-live</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* ═══ COMPARISON TABLE ═══════════════════════════════════════════════════ */}
      <SectionReveal id="comparison" className="relative py-10 lg:py-14 bg-white text-zinc-950 border-b border-zinc-200">
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-zinc-950 tracking-tight">
              <WordReveal text="Why Fixl AI over the alternatives?" />
            </h2>
            <p className="text-sm text-zinc-600 mt-4 font-light leading-relaxed">
              See how Fixl AI stacks up against cloud AI platforms, consulting firms, AI startups, and off-the-shelf vendor products across the dimensions that matter most.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-[11px]">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="text-left py-3 pr-4 text-zinc-500 font-sans text-[10px] font-bold uppercase tracking-widest w-36">Capability</th>
                  <th className="py-3 px-4 text-center rounded-t-xl bg-zinc-950 text-white font-sans font-bold">Fixl AI</th>
                  <th className="py-3 px-4 text-center text-zinc-500 font-sans font-semibold">Cloud AI</th>
                  <th className="py-3 px-4 text-center text-zinc-500 font-sans font-semibold">Consulting</th>
                  <th className="py-3 px-4 text-center text-zinc-500 font-sans font-semibold">AI Startups</th>
                  <th className="py-3 px-4 text-center text-zinc-500 font-sans font-semibold">AI Vendors</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i} className={`border-b border-zinc-100 ${i % 2 === 0 ? '' : 'bg-zinc-50/50'}`}>
                    <td className="py-3 pr-4 text-zinc-600 font-light">{row.feature}</td>
                    {[row.fixiai, row.cloud, row.consulting, row.startups, row.vendors].map((val, j) => (
                      <td key={j} className={`py-3 px-4 text-center ${j === 0 ? 'bg-zinc-950/3' : ''}`}>
                        {val === '✓' || val.startsWith('✓') ? (
                          <span className={`inline-flex items-center justify-center gap-1 ${j === 0 ? 'text-blue-600 font-bold' : 'text-blue-500'}`}>
                            <CheckCircle2 className="w-3.5 h-3.5" />{val !== '✓' && <span className="text-[10px]">{val.slice(2)}</span>}
                          </span>
                        ) : val === '✗' ? (
                          <XCircle className="w-3.5 h-3.5 text-zinc-300 mx-auto" />
                        ) : val === '~' ? (
                          <MinusCircle className="w-3.5 h-3.5 text-zinc-400 mx-auto" />
                        ) : (
                          <span className={`font-sans font-semibold ${j === 0 ? 'text-blue-600' : 'text-zinc-500'}`}>{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-5 text-[10px] text-zinc-400 font-light">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-blue-500" /> Yes / Included</span>
            <span className="flex items-center gap-1.5"><XCircle className="w-3 h-3 text-zinc-300" /> No / Not included</span>
            <span className="flex items-center gap-1.5"><MinusCircle className="w-3 h-3 text-zinc-400" /> Partial / Varies</span>
          </div>
        </div>
      </SectionReveal>

      {/* ═══ CLIENT SUCCESS ══════════════════════════════════════════════════════ */}
      <SectionReveal id="client-success" className="relative py-10 lg:py-14 bg-[#0a0a0c] text-white border-b border-zinc-900">
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-white tracking-tight">
              <WordReveal text="Measured outcomes from active engagements." />
            </h2>
            <p className="text-sm text-zinc-400 mt-4 font-light leading-relaxed">
              Client outcomes from live Fixl AI deployments — measured against the KPIs defined at contract kickoff, not at time of sale.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {[
              {
                quote: "Fixl AI deployed our KYC AI pipeline in 5 weeks. We went from 14-day institutional onboarding to under 4 hours. The ROI guarantee gave us the confidence to move fast.",
                name: 'Head of Digital Operations',
                company: 'Regional Investment Bank, Singapore',
                outcomes: [{ metric: '94%', label: 'faster KYC processing' }, { metric: '$1.8M', label: 'annual cost saving' }]
              },
              {
                quote: "The ambient clinical transcription system cut our physicians' documentation time by 4 hours daily. Patient satisfaction scores improved 18% in the first quarter post-deployment.",
                name: 'Chief Medical Information Officer',
                company: 'Hospital Network, UK (2,400 beds)',
                outcomes: [{ metric: '4 hrs', label: 'daily per physician saved' }, { metric: '+18%', label: 'patient satisfaction' }]
              },
              {
                quote: "Our AI demand forecasting reduced inventory costs by 23% in the first 6 months. The model runs inside our AWS account — our data never moves. That was non-negotiable for us.",
                name: 'VP of Supply Chain',
                company: 'Tier-1 Retail Group, 800+ locations',
                outcomes: [{ metric: '23%', label: 'inventory cost reduction' }, { metric: '6 weeks', label: 'to production' }]
              },
            ].map((story, i) => (
              <div key={i} className="group p-6 rounded-3xl bg-zinc-950 border border-zinc-900 hover:border-zinc-700 hover:-translate-y-0.5 transition-all duration-300 space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  {story.outcomes.map((o, j) => (
                    <div key={j} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                      <div className="text-xl font-display font-bold text-blue-400">{o.metric}</div>
                      <div className="text-[10px] text-zinc-500 font-light">{o.label}</div>
                    </div>
                  ))}
                </div>
                <blockquote className="text-[11px] text-zinc-400 font-light leading-relaxed italic">"{story.quote}"</blockquote>
                <div>
                  <div className="text-[11px] font-sans font-bold text-white">{story.name}</div>
                  <div className="text-[10px] text-zinc-600 font-light">{story.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionReveal>

      {/* ═══ CONTACT ════════════════════════════════════════════════════════════ */}
      <SectionReveal id="contact" className="relative py-10 lg:py-14 bg-white text-zinc-950 border-b border-zinc-200">
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-zinc-950 tracking-tight">
              <WordReveal text="Talk to an AI architect — not a sales rep." />
            </h2>
            <p className="text-sm text-zinc-600 mt-4 font-light leading-relaxed">
              Every initial conversation is with a principal AI engineer who has shipped production AI systems. We'll scope your use case, identify the right approach, and give you a timeline in 30 minutes.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact info */}
            <div className="space-y-6">
              <div className="space-y-4">
                {[
                  { icon: <Calendar className="w-4 h-4 text-blue-600" />, title: 'Book a Call', desc: 'Schedule a 30-minute technical discovery session with a principal AI engineer.' },
                  { icon: <Mail className="w-4 h-4 text-purple-600" />, title: 'Email Sales', desc: 'Send your brief and we\'ll respond with a scoping document within 24 hours.' },
                  { icon: <Phone className="w-4 h-4 text-blue-600" />, title: 'Urgent Enquiry', desc: 'Enterprise and Scale clients receive dedicated contact channels with 30-minute response SLA.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                    <div className="w-8 h-8 rounded-xl bg-white border border-zinc-200 flex items-center justify-center flex-shrink-0 shadow-sm">{item.icon}</div>
                    <div>
                      <h4 className="text-xs font-sans font-bold text-zinc-950 mb-0.5">{item.title}</h4>
                      <p className="text-[11px] text-zinc-500 font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                <h4 className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest">What to Expect</h4>
                {['30-min technical scope session with a principal engineer', 'Written scoping document within 48 hours', 'Proposal with timeline, tech stack, and fixed price', 'Pilot agreement if scope approved', 'Production delivery in 3–6 weeks'].map((step, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-[11px] text-zinc-600 font-light">
                    <span className="w-4 h-4 rounded-full bg-zinc-100 border border-zinc-300 text-zinc-500 text-[9px] font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                    {step}
                  </div>
                ))}
              </div>
            </div>
            {/* Contact form */}
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800">
              {formSent ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                  <div className="w-14 h-14 rounded-full bg-blue-900/20 border border-blue-900/40 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-display font-semibold text-white">Message received.</h3>
                  <p className="text-xs text-zinc-400 font-light max-w-sm">A principal AI engineer will contact you within 24 hours to schedule your technical discovery session.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-sm font-sans font-bold text-white mb-5">Request a discovery session</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest">Full Name *</label>
                      <input required type="text" placeholder="Alex Thompson" value={formData.name}
                        onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className={inputClass} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest">Work Email *</label>
                      <input required type="email" placeholder="alex@company.com" value={formData.email}
                        onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className={inputClass} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest">Company *</label>
                      <input required type="text" placeholder="Acme Corp" value={formData.company}
                        onChange={e => setFormData(p => ({ ...p, company: e.target.value }))} className={inputClass} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest">Your Role</label>
                      <input type="text" placeholder="VP Engineering" value={formData.role}
                        onChange={e => setFormData(p => ({ ...p, role: e.target.value }))} className={inputClass} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest">What are you trying to build? *</label>
                    <textarea required rows={4} placeholder="Brief description of your AI use case, timeline, and any current infrastructure context..."
                      value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                      className={`${inputClass} resize-none`} />
                  </div>
                  <button type="submit" className="w-full py-3.5 rounded-xl font-sans text-sm font-semibold bg-white text-zinc-950 hover:bg-blue-50 hover:shadow-[0_4px_20px_rgba(255,255,255,0.2)] transition-all duration-200 flex items-center justify-center gap-2">
                    Request Discovery Session <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[10px] text-zinc-600 font-light text-center">By submitting you agree to our Privacy Charter. We don't share your information with third parties.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* ═══ FOOTER ═════════════════════════════════════════════════════════════ */}
      <SectionReveal id="enterprise-footer" className="relative py-10 lg:py-14 bg-[#0a0a0c] text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-10 relative z-10">
          <div style={clipHero}
            className="relative p-10 sm:p-16 bg-gradient-to-tr from-blue-900/40 via-zinc-950 to-indigo-950/30 text-center space-y-8 border border-zinc-800 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
            <div className="max-w-2xl mx-auto space-y-3 relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-white tracking-tight leading-tight">
                <WordReveal text="Your AI platform is ready to build." />
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light max-w-lg mx-auto">
                Start with a discovery call. Leave with a scoped system, timeline, and ROI-guaranteed delivery plan.
              </p>
            </div>
            <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
              <a href="#contact" className="group px-7 py-3.5 rounded-full font-sans text-sm font-semibold bg-white text-zinc-950 hover:bg-blue-50 hover:shadow-[0_8px_32px_rgba(255,255,255,0.2)] hover:scale-[1.04] transition-all duration-200 flex items-center gap-2 shadow-lg">
                Book Discovery Call <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <Link href="/services" className="px-6 py-3.5 rounded-full font-sans text-sm font-semibold border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition-all duration-200">
                Explore Services
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
              <p className="text-zinc-500 leading-relaxed font-light text-[11px]">Custom AI systems, model integrations, and autonomous workflows. Built for enterprise. ROI guaranteed.</p>
              <div className="flex flex-wrap gap-2">
                {['SOC 2', 'ISO 27001', 'GDPR', 'HIPAA'].map(b => (
                  <span key={b} className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-zinc-900 border border-zinc-800 text-zinc-500">{b}</span>
                ))}
              </div>
              <div className="text-zinc-600 font-sans text-[10px] uppercase tracking-wider">&copy; {new Date().getFullYear()} Fixl AI. All rights reserved.</div>
            </div>
            {[
              { title: 'Enterprise', links: [{ l: 'Security', h: '#security' }, { l: 'Pricing', h: '#pricing' }, { l: 'Managed Services', h: '#managed-services' }, { l: 'ROI Guarantee', h: '#roi' }] },
              { title: 'Compare', links: [{ l: 'vs Cloud AI', h: '#comparison' }, { l: 'vs Consulting', h: '#comparison' }, { l: 'vs AI Vendors', h: '#comparison' }] },
              { title: 'Platform', links: [{ l: 'Home', h: '/' }, { l: 'Services', h: '/services' }, { l: 'Industries', h: '/industries' }] },
              { title: 'Legal', links: [{ l: 'Privacy Charter', h: '/' }, { l: 'Terms of Service', h: '/' }, { l: 'Cookie Policy', h: '/' }, { l: 'DPA', h: '/' }] },
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
