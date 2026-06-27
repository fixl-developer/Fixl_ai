'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

// Custom inline style helper for asymmetrical diagonal cuts (from Reference 5 & 10)
const diagonalClipStyle = {
  clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)'
};
const diagonalClipSubtleStyle = {
  clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)'
};
const diagonalClipHeroStyle = {
  clipPath: 'polygon(40px 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%, 0 40px)'
};

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
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual');

  // Hero interactive system simulator states
  const [heroPromptInput, setHeroPromptInput] = useState('Build a localized routing & synthetic safety firewall for customer queries');
  const [heroSimulatedLogs, setHeroSimulatedLogs] = useState<string[]>([
    'System standby. Awaiting architecture query...',
  ]);
  const [isHeroSimulating, setIsHeroSimulating] = useState(false);
  const [heroSimProgress, setHeroSimProgress] = useState(0);

  // Email CTA states
  const [email, setEmail] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState(false);

  // Scroll spy mechanism
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
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveNav(section);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Run Sentry simulation loop
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

  // Content constants
  const shiftStats = [
    { value: '315%', label: 'Growth in custom AI workloads' },
    { value: '82%', label: 'Organizations adopting custom model pipelines' },
    { value: '14ms', label: 'Average model response latency' },
    { value: '10x', label: 'Throughput gain using automated task loops' }
  ];

  const executiveOverviewPoints = [
    {
      title: 'Unified AI Platforms',
      text: 'Avoid scattered APIs. FixIAI builds unified systems that coordinate models, internal databases, and private servers under a single, secure control panel.'
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
    {
      id: 'eco-llm',
      icon: <Cpu className="w-5 h-5 text-blue-500" />,
      category: 'Models',
      title: 'Model Integration',
      description: 'Integrate leading large language models with your custom guidelines and system rules.',
      metric: '99.4%',
      metricLabel: 'Task Accuracy'
    },
    {
      id: 'eco-agent',
      icon: <Workflow className="w-5 h-5 text-purple-500" />,
      category: 'Workflows',
      title: 'Custom Automations',
      description: 'Multi-step automated workflows that execute tasks and connect systems under human oversight.',
      metric: '18x',
      metricLabel: 'Speed Increase'
    },
    {
      id: 'eco-rag',
      icon: <Database className="w-5 h-5 text-blue-500" />,
      category: 'Search',
      title: 'Internal Databases',
      description: 'Custom internal search databases connected directly to your existing documentation.',
      metric: '< 120ms',
      metricLabel: 'Search Latency'
    },
    {
      id: 'eco-auto',
      icon: <Layers3 className="w-5 h-5 text-indigo-500" />,
      category: 'Operations',
      title: 'Workflow Efficiency',
      description: 'Workflow automation for back-office tasks, document reviews, and internal tickets.',
      metric: '-82%',
      metricLabel: 'Cost Reduction'
    },
    {
      id: 'eco-voice',
      icon: <Mic className="w-5 h-5 text-pink-500" />,
      category: 'Voice',
      title: 'Voice AI Integration',
      description: 'Voice integration with fast response times and clear natural language routing.',
      metric: '320ms',
      metricLabel: 'Response Delay'
    },
    {
      id: 'eco-multi',
      icon: <Video className="w-5 h-5 text-amber-500" />,
      category: 'Files',
      title: 'Document Parsing',
      description: 'Extract data from complex PDF files, charts, legacy scanned documents, and forms.',
      metric: '99.2%',
      metricLabel: 'Extraction Rate'
    },
    {
      id: 'eco-dev',
      icon: <Terminal className="w-5 h-5 text-cyan-500" />,
      category: 'Training',
      title: 'Custom Fine-Tuning',
      description: 'Model fine-tuning and hosting specialized on your private terminology.',
      metric: 'Bespoke',
      metricLabel: 'Term Customization'
    },
    {
      id: 'eco-consult',
      icon: <Briefcase className="w-5 h-5 text-blue-500" />,
      category: 'Architecture',
      title: 'Engineering Plans',
      description: 'System architecture reviews, feasibility studies, and functional software prototyping.',
      metric: 'SOC-2',
      metricLabel: 'Ready Design'
    },
    {
      id: 'eco-mlops',
      icon: <Server className="w-5 h-5 text-orange-500" />,
      category: 'Ops',
      title: 'Model Monitoring',
      description: 'Automatic model version tracking, health monitoring, and system uptime scaling.',
      metric: '99.99%',
      metricLabel: 'Uptime SLA'
    },
    {
      id: 'eco-sec',
      icon: <Shield className="w-5 h-5 text-red-500" />,
      category: 'Privacy',
      title: 'Data Security',
      description: 'Direct guardrails, secure networks, and strict data privacy compliance checks.',
      metric: 'Active',
      metricLabel: 'Security Shield'
    }
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
      stats: [
        { value: '310ms', label: 'Mean response delay' },
        { value: '42%', label: 'Cost savings' },
        { value: '98.5%', label: 'CSAT sentiment' }
      ],
      features: ['Inbound concierge scaling', 'Dynamic API execution mid-sentence', 'Multilingual fluid dialect', 'Sentiment tracking logs']
    },
    multimodal: {
      tag: 'Vision Tech, US',
      title: 'Sovereign Multimodal Visual Engines',
      description: 'Process unstructured multi-source files. Our vision pipelines interpret visual charts, complex technical engineering schematics, handwritten ledgers, and video security records with high structural output.',
      visualLabel: 'Visual Processing Node',
      stats: [
        { value: '99.2%', label: 'OCR recognition' },
        { value: '8x', label: 'Faster extraction' },
        { value: 'Zero', label: 'Data leakage' }
      ],
      features: ['Contextual chart interpretation', 'Video security logging', 'High-density PDF schematic parsing', 'Product visual anomaly analysis']
    },
    development: {
      tag: 'Core ML, Europe',
      title: 'Custom AI Orchestration & Tuning',
      description: 'We curate proprietary training sets, execute domain-specific model fine-tuning, implement efficient quantization paths, and launch secure model API endpoints customized purely to your legacy infrastructure.',
      visualLabel: 'Fine-Tuning Playground',
      stats: [
        { value: '32b/70b', label: 'Optimized models' },
        { value: '99.98%', label: 'Alignment rating' },
        { value: '-72%', label: 'Host size reduction' }
      ],
      features: ['Direct LoRA / QLoRA tuning', 'Synthetic data augmentation', 'High-throughput MLOps clusters', 'Continuous model regression tracking']
    },
    consulting: {
      tag: 'Advisory, UK',
      title: 'Strategic Architecture & PoC Formulation',
      description: 'Accelerate the timeline from abstract whiteboard brainstorming to active production code. Our principal architects guide your core staff on security, governance compliance, custom stack selections, and return audits.',
      visualLabel: 'Governance Advisory Log',
      stats: [
        { value: '3-Week', label: 'Working prototype' },
        { value: '100%', label: 'SOC-2 compliant' },
        { value: 'Model', label: 'Agnostic strategy' }
      ],
      features: ['Enterprise-grade feasibility reports', 'Compute and API cost projections', 'Regulatory impact mitigation plans', 'Developer upskilling bootcamps']
    }
  };

  const industryCards = [
    {
      id: 'healthcare',
      title: 'Healthcare & Life Sciences',
      metric: '-80% Doc Time',
      text: 'Secure document semantic lookup, automated clinical trial cohort matching, and privacy-first HIPAA compliant diagnostic assistant models.'
    },
    {
      id: 'finance',
      title: 'Financial Services & Capital Markets',
      metric: '99.8% Coherence',
      text: 'Sub-second portfolio asset query agents, multi-agent credit modeling networks, and deep regulatory audit text parsers.'
    },
    {
      id: 'retail',
      title: 'Retail & Global Commerce',
      metric: '4.1x ROAS Yield',
      text: 'Hyper-personalized product recommendation swarms, dynamic voice checkout helpers, and visual catalog OCR inventory trackers.'
    },
    {
      id: 'manufacturing',
      title: 'Manufacturing & Smart Logistics',
      metric: '18x Cycle Speed',
      text: 'Industrial system anomaly visual analyzers, conversational equipment logs, and automated vendor procurement routing.'
    },
    {
      id: 'education',
      title: 'Education & Enterprise Upskilling',
      metric: '98% CSAT Rating',
      text: 'Custom interactive adaptive tutors, high-velocity internal documentation synthesis, and sovereign code generation checkers.'
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#0a0a0c] text-[#f4f4f6] font-sans antialiased overflow-x-hidden selection:bg-blue-600/30 selection:text-blue-100">
      
      {/* =========================================================================
          FLOATING NAVIGATION
          ========================================================================= */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0a0a0c]/90 backdrop-blur-md border-b border-zinc-800/50 py-3.5' : 'bg-transparent py-6'}`}>
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 flex items-center justify-between">
          <a href="#hero" className="flex items-center space-x-3 group">
            <div className="relative w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-display text-xl font-semibold tracking-tight text-white">
              FixI<span className="text-blue-500 font-light">AI</span>
            </span>
          </a>

          {/* Floating nav links */}
          <div className="hidden lg:flex items-center space-x-8">
            {['The Shift', 'Ecosystem', 'Capabilities', 'Solutions', 'Enterprise Trust', 'Pricing & Why Us'].map((label, idx) => {
              const ids = ['shift', 'ecosystem', 'core', 'solutions', 'enterprise', 'pricing'];
              return (
                <a 
                  key={idx} 
                  href={`#${ids[idx]}`} 
                  className={`text-[13px] font-sans font-medium tracking-tight transition-colors ${activeNav === ids[idx] ? 'text-blue-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'}`}
                >
                  {label}
                </a>
              );
            })}
          </div>

          <div>
            <a href="#results" className="px-5 py-2.5 rounded-full text-[13px] font-sans font-medium bg-white text-zinc-950 hover:bg-zinc-100 transition-all shadow-md">
              Book Demo
            </a>
          </div>
        </div>
      </nav>

      {/* =========================================================================
          SECTION 1 — HERO (viewport size h-screen only constraint respected!)
          ========================================================================= */}
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
              FixIAI engineers and integrates bespoke, air-gapped cognitive frameworks natively into your core infrastructure.
              Unleash autonomous agentic orchestration, sub-second semantic retrieval, and bulletproof security firewalls.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a href="#results" className="px-6 py-3.5 rounded-full font-sans text-sm font-medium bg-white text-zinc-950 hover:bg-zinc-100 transition-all flex items-center shadow-lg">
                Initiate Architecture
                <ArrowRight className="w-3.5 h-3.5 ml-2" />
              </a>
              <a href="#ecosystem" className="px-5 py-3.5 rounded-full font-sans text-sm font-medium bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:text-white transition-all flex items-center space-x-2 shadow-xs">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 text-white fill-current ml-0.5" />
                </div>
                <span>Explore Capabilities</span>
              </a>
            </div>
          </motion.div>

          {/* Hero Right Column - Interactive Sentry console inside a floating glass layout (Reference 4) */}
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
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-sans font-medium text-zinc-400">FixIAI Sentry Control</span>
                </div>
                <div className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-[10px] font-sans text-blue-400 font-semibold">Live Shell</div>
              </div>

              {/* Simulation Playground */}
              <div className="space-y-3">
                <div className="text-left">
                  <label className="text-[10px] font-sans text-zinc-500 font-medium">Query Cognitive Model Pipeline</label>
                  <div className="mt-1 flex space-x-2">
                    <input 
                      type="text"
                      value={heroPromptInput}
                      onChange={(e) => setHeroPromptInput(e.target.value)}
                      className="flex-grow bg-[#050507] border border-zinc-800/60 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-blue-500 font-sans"
                    />
                    <button 
                      onClick={runHeroSimulation}
                      disabled={isHeroSimulating}
                      className="px-3 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:bg-zinc-800 disabled:text-zinc-500 flex items-center justify-center"
                    >
                      {isHeroSimulating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Simulated log outputs */}
                <div className="h-36 bg-[#030305] rounded-xl border border-zinc-900 p-3 overflow-y-auto text-left space-y-1.5 scrollbar-thin">
                  {heroSimulatedLogs.map((log, idx) => (
                    <div key={idx} className="text-xs font-sans leading-normal flex items-start space-x-1.5">
                      <span className="text-blue-500 select-none">&gt;</span>
                      <span className={idx === heroSimulatedLogs.length - 1 ? "text-zinc-200 font-medium" : "text-zinc-500"}>{log}</span>
                    </div>
                  ))}
                </div>

                {/* Progress Bar */}
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

              {/* Status footer */}
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
      </motion.section>

      {/* =========================================================================
          SECTION 2 — THE AI SHIFT
          ========================================================================= */}
      <motion.section 
        id="shift" 
        className="relative py-16 lg:py-20 bg-[#f4f4f6] text-zinc-950 overflow-hidden border-b border-zinc-200"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
      >
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12">
          <div className="relative p-8 md:p-14 rounded-[2.5rem] bg-white border border-zinc-200 shadow-sm">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left column: Physical laptop mockup preview style */}
              <div className="lg:col-span-5 space-y-6">

                <div className="p-4 rounded-3xl bg-[#f4f4f6] border border-zinc-200 shadow-xs relative overflow-hidden group">
                  <div className="aspect-[4/3] rounded-2xl bg-zinc-950 relative flex items-center justify-center overflow-hidden">
                    <img 
                      src="/laptop_showcase.jpg" 
                      alt="FixIAI Laptop Workspace Showcase"
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/40" />
                    
                    {/* Play Button */}
                    <div className="relative w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-all cursor-pointer">
                      <Play className="w-4 h-4 text-zinc-950 fill-current ml-1" />
                    </div>
                    
                    <div className="absolute bottom-4 left-4 text-xs font-sans text-zinc-300">
                      Hi, we are FixIAI
                    </div>
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

              {/* Right column: Editorial Content and dynamic tabs */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-zinc-950 tracking-tight leading-tight">
                  We build custom systems that connect AI models to your real-world databases and APIs.
                </h2>
                <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-light">
                  Standard chatbot interfaces and disconnected APIs quickly reach their limits. True efficiency comes from tailor-made workflows that read internal documentation, process document streams, and execute actions under secure corporate guidelines.
                </p>

                {/* Custom Interactive Tab Buttons */}
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
                      {activeShiftTab === tab.id && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600" />
                      )}
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
      </motion.section>

      {/* =========================================================================
          SECTION 3 — THE FIXIAI ECOSYSTEM (Bento capabilities grid - Reference 7)
          ========================================================================= */}
      <motion.section 
        id="ecosystem" 
        className="relative py-16 lg:py-20 bg-[#f4f4f6] text-zinc-950 overflow-hidden border-b border-zinc-200"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
      >
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-10">
          
          <div className="text-left max-w-2xl space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-zinc-950 tracking-tight">
              A unified suite of AI solutions.
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-light">
              We replace loose scripts and fragmented services with a single, production-ready AI platform. Scale securely with complete model control.
            </p>
          </div>

          {/* Interactive Bento grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {ecosystemCards.map((eco) => (
              <div 
                key={eco.id}
                onMouseEnter={() => setHoveredEcoId(eco.id)}
                onMouseLeave={() => setHoveredEcoId(null)}
                className={`p-6 rounded-3xl bg-white border transition-all duration-300 flex flex-col justify-between min-h-[220px] relative overflow-hidden group cursor-pointer ${
                  hoveredEcoId === eco.id 
                    ? 'border-zinc-950 bg-zinc-950 text-white shadow-lg -translate-y-1' 
                    : 'border-zinc-200/80 hover:border-zinc-300'
                }`}
              >
                <div className="space-y-4 relative z-10 text-left">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-zinc-50 rounded-xl border border-zinc-200 group-hover:bg-zinc-900 group-hover:border-zinc-800">
                      {eco.icon}
                    </div>
                    <span className="text-[10px] font-sans text-zinc-400 font-semibold">
                      {eco.category}
                    </span>
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
                    <ArrowUpRight className="w-2.5 h-2.5 ml-0.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </motion.section>

      {/* =========================================================================
          SECTION 4 — CORE CAPABILITIES (Numbered advantages list - Reference 5)
          ========================================================================= */}
      <motion.section 
        id="core" 
        className="relative py-16 lg:py-20 bg-[#0a0a0c] text-white overflow-hidden border-b border-zinc-900"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
      >
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-12">
          
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 border-b border-zinc-900 pb-8">
            <div className="text-left space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-white tracking-tight">
                Our core capabilities.
              </h2>
            </div>
            <p className="text-sm text-zinc-400 max-w-md text-left font-light leading-relaxed">
              We deploy foundation models, custom retrieval pipelines, and secure API integrations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            
            {/* Left side: Numbered selection links (Reference 5 style) */}
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
                    className={`w-full p-4 rounded-2xl text-left border transition-all duration-300 flex items-start space-x-4 ${
                      activeCoreTab === tab.id 
                        ? 'bg-zinc-900 border-zinc-800' 
                        : 'bg-transparent border-transparent hover:bg-zinc-900/40'
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

              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-left space-y-2">
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

            {/* Right side: Console visual details */}
            <div className="lg:col-span-7 bg-[#0c0c0e] border border-zinc-850 rounded-3xl p-6 relative flex flex-col justify-between overflow-hidden min-h-[360px]">
              <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

              <div className="flex items-center justify-between border-b border-zinc-900 pb-3 relative z-10">
                <span className="text-[10px] font-sans text-zinc-400 font-medium">FixIAI Engine Visualizer</span>
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
                        <div key={idx} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-900 flex flex-col justify-between">
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
                      <span className="text-[10px] font-sans text-emerald-400 font-medium">Sub-second Vector Knowledge</span>
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
                        Bypass slow manual review bottlenecks. FixIAI automates continuous, complex transactional work lines — classifying incoming emails, checking ledger values, processing PDFs, and coordinating DevOps.
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
      </motion.section>

      {/* =========================================================================
          SECTION 5 — ENTERPRISE SOLUTIONS (Selected Work layouts - Reference 2 & 3)
          ========================================================================= */}
      <motion.section 
        id="solutions" 
        className="relative py-16 lg:py-20 bg-white text-zinc-950 overflow-hidden border-b border-zinc-200"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
      >
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-12">
          
          <div className="text-left max-w-2xl space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-zinc-950 tracking-tight">
              Custom AI systems for secure operations.
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-light">
              We develop custom voice interfaces, document vision systems, fine-tuned models, and secure cloud setups.
            </p>
          </div>

          <div className="p-6 md:p-10 rounded-[2.5rem] bg-zinc-50 border border-zinc-200 shadow-xs">
            
            {/* Top selectors horizontal row */}
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
                      ? 'bg-zinc-950 text-white border-zinc-950 shadow-md' 
                      : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-sans font-semibold px-1">{sol.label}</span>
                </button>
              ))}
            </div>

            {/* Alternating layout columns based on Selected Work visual reference */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-8 items-center">
              
              {/* Left Details block */}
              <div className="lg:col-span-6 text-left space-y-6">

                <h3 className="text-2xl sm:text-3xl font-display font-bold text-zinc-950 tracking-tight">
                  {solutionsData[selectedSolution].title}
                </h3>
                <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-light">
                  {solutionsData[selectedSolution].description}
                </p>

                {/* Sub-check list */}
                <div className="space-y-2">
                  {solutionsData[selectedSolution].features.map((feat, i) => (
                    <div key={i} className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span className="text-xs sm:text-sm font-sans font-medium text-zinc-700">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Massive numbers metrics (Reference 2 style) */}
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

              {/* Right Mockup Screen visualizer (Reference 3 style) */}
              <div className="lg:col-span-6">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-zinc-200 bg-zinc-950 p-6 flex flex-col justify-between shadow-xl">
                  <div className="absolute inset-0 bg-grid-pattern opacity-5" />

                  <div className="flex items-center justify-between border-b border-zinc-900 pb-3 relative z-10">
                    <span className="text-[10px] font-sans text-zinc-400 font-medium">FixIAI &bull; {solutionsData[selectedSolution].visualLabel}</span>
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
                                style={{ 
                                  height: `${10 + (i % 3 === 0 ? 30 : 15)}px`,
                                  animationDelay: `${i * 80}ms`,
                                  animationDuration: '950ms'
                                }}
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
                            <div>
                              <span>Epochs:</span>
                              <div className="text-white font-bold">12/12</div>
                            </div>
                            <div>
                              <span>Loss Value:</span>
                              <div className="text-blue-400 font-bold">0.024</div>
                            </div>
                            <div>
                              <span>Alignment:</span>
                              <div className="text-white font-bold">99.98%</div>
                            </div>
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
      </motion.section>

      {/* =========================================================================
          SECTION 6 — INDUSTRIES & SECURITY TRUST (Bento list - Reference 8)
          ========================================================================= */}
      <motion.section 
        id="enterprise" 
        className="relative py-16 lg:py-20 bg-[#0a0a0c] text-white overflow-hidden border-b border-zinc-900"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
      >
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-12">
          
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 border-b border-zinc-900 pb-8 text-left">
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-white tracking-tight">
                Sectors & Security.
              </h2>
            </div>
            <p className="text-sm sm:text-base text-zinc-400 max-w-md font-light leading-relaxed">
              We design robust solutions tailored directly to regulated industries, using secure infrastructure and compliance frameworks.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left side: Custom profile blocks with diagonal crops (Reference 9 style) */}
            <div className="lg:col-span-5 space-y-3 text-left">
              <span className="text-xs font-sans uppercase tracking-widest text-zinc-500 block font-semibold mb-2">Industry Profiles</span>
              {industryCards.map((ind) => (
                <button
                  key={ind.id}
                  onClick={() => setActiveIndustry(ind.id)}
                  style={diagonalClipSubtleStyle}
                  className={`w-full p-5 text-left border transition-all duration-300 ${
                    activeIndustry === ind.id 
                      ? 'bg-zinc-900 border-zinc-800' 
                      : 'bg-transparent border-zinc-900/60 hover:bg-zinc-900/30'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm font-sans uppercase tracking-wider text-blue-400 font-semibold">{ind.title}</span>
                    <span className="text-xs font-sans font-semibold text-blue-400 bg-blue-950/40 px-2 rounded-full">{ind.metric}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-2 font-light leading-relaxed">
                    {ind.text}
                  </p>
                </button>
              ))}
            </div>

            {/* Right side: Security Badges & Integrations */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              
              <div className="p-6 rounded-3xl bg-[#0c0c0e] border border-zinc-850 text-left space-y-4">
                <span className="text-xs font-sans text-zinc-400 uppercase tracking-widest font-semibold block">Technology Integrations</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Foundation Models', details: 'Sovereign / Hosted' },
                    { label: 'Cloud Clusters', details: 'AWS, GCP, Azure VPC' },
                    { label: 'Enterprise CRMs', details: 'Salesforce, Hubspot' },
                    { label: 'Data Platforms', details: 'Snowflake, Databricks' },
                    { label: 'System ERPs', details: 'SAP, Oracle Ledger' },
                    { label: 'Secure APIs', details: 'Sovereign Endpoints' },
                    { label: 'Auth Protocols', details: 'SAML Single-Sign' },
                    { label: 'Automations', details: 'Isolated Containers' }
                  ].map((tech, idx) => (
                    <div key={idx} className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl">
                      <div className="text-xs font-bold text-white leading-tight">{tech.label}</div>
                      <div className="text-[10px] font-sans text-zinc-550 mt-0.5">{tech.details}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compliance Badges with custom hovers (Reference 8 style bento grids) */}
              <div className="p-6 rounded-3xl bg-[#0c0c0e] border border-zinc-850 text-left space-y-4">
                <span className="text-xs font-sans text-zinc-400 uppercase tracking-widest font-semibold block">Security & Compliance Badges</span>
                
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                  {[
                    { code: 'SOC2', label: 'SOC-2 Hardened', desc: 'Continuous audit controls.' },
                    { code: 'ISO27001', label: 'ISO 27001 Certified', desc: 'Secure information management.' },
                    { code: 'GDPR', label: 'GDPR Compliant', desc: 'Sovereign private data.' },
                    { code: 'HIPAA', label: 'HIPAA Shielded', desc: 'Protected medical data.' },
                    { code: 'PCI DSS', label: 'PCI DSS Compliant', desc: 'Financial security standards.' },
                    { code: 'EU AI Act', label: 'EU AI Act Aligned', desc: 'Ethical human oversight.' }
                  ].map((badge) => (
                    <div 
                      key={badge.code}
                      onMouseEnter={() => setHoveredBadge(badge.code)}
                      onMouseLeave={() => setHoveredBadge(null)}
                      className="p-3 rounded-xl bg-zinc-950 border border-zinc-900 text-center relative cursor-pointer hover:border-blue-500/50 transition-colors"
                    >
                      <div className="text-xs sm:text-sm font-sans font-bold text-white">{badge.code}</div>
                      <span className="text-[10px] text-zinc-500 mt-1 block font-sans leading-none">{badge.label}</span>

                      {/* Floating tooltip */}
                      {hoveredBadge === badge.code && (
                        <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-zinc-900 text-zinc-100 text-[10px] font-sans rounded border border-zinc-800 w-32 shadow-xl leading-snug text-left">
                          {badge.desc}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center space-x-2 text-xs text-zinc-400 pt-2 border-t border-zinc-900">
                  <ShieldAlert className="w-4 h-4 text-blue-500" />
                  <span>Adversarial red-teaming testing and inline synthetic token masking deployed on every pipeline.</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </motion.section>

      {/* =========================================================================
          SECTION 7 — PRICING & COMPILATION DETAILS
          ========================================================================= */}
      <motion.section 
        id="pricing" 
        className="relative py-16 lg:py-20 bg-[#f4f4f6] text-zinc-950 overflow-hidden border-b border-zinc-200"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
      >
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-zinc-950 tracking-tight">
              Transparent Pricing. ROI Guaranteed.
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-light">
              We align our monetization model on continuous model performance and actual, quantifiable business throughput. Choose the plan right for your scale.
            </p>

            {/* Annual billing Toggle */}
            <div className="inline-flex items-center bg-white border border-zinc-300 rounded-full p-1 mt-2">
              <button 
                onClick={() => setBillingPeriod('monthly')}
                className={`px-4 py-1.5 rounded-full text-[10px] font-sans font-bold tracking-widest transition-all uppercase ${billingPeriod === 'monthly' ? 'bg-zinc-950 text-white shadow-xs' : 'text-zinc-500 hover:text-zinc-700'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingPeriod('annual')}
                className={`px-4 py-1.5 rounded-full text-[10px] font-sans font-bold tracking-widest transition-all uppercase ${billingPeriod === 'annual' ? 'bg-zinc-950 text-white shadow-xs' : 'text-zinc-500 hover:text-zinc-700'}`}
              >
                Annual (-20%)
              </button>
            </div>
          </div>

          {/* Pricing cards grid with custom layouts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
            {[
              {
                name: 'Starter',
                desc: 'Perfect for simple pilot studies and standalone model deployments.',
                monthlyPrice: 1200,
                annualPrice: 960,
                features: ['1 Model Integration API', 'Standard document search index', 'Basic support channel access', 'SOC-2 Compliance', 'Zero telemetry data leak']
              },
              {
                name: 'Growth',
                desc: 'Tailored for expanding teams deploying automated workflows.',
                monthlyPrice: 3800,
                annualPrice: 3040,
                features: ['3 Secure Model Endpoints', 'Complex document database sync', '2 Active custom automations', 'API integration to Salesforce/SAP', 'Standard security checks']
              },
              {
                name: 'Scale',
                desc: 'Designed for fully active production-grade enterprise systems.',
                monthlyPrice: 8500,
                annualPrice: 6800,
                popular: true,
                features: ['Unlimited Model Endpoints', 'Sub-second voice response latency', 'High-performance document search', 'Unlimited custom automations', 'Managed model updates', '1-on-1 Dedicated Architect']
              },
              {
                name: 'Enterprise',
                desc: 'Bespoke fine-tuned architectures running on secure cloud clusters.',
                monthlyPrice: 'Custom',
                annualPrice: 'Custom',
                features: ['Proprietary model fine-tuning', 'On-premise hardware setups', 'Automated data masking', 'SLA guaranteed system uptime', 'Security compliance controls', '100% custom code handover']
              }
            ].map((plan) => (
              <div 
                key={plan.name}
                style={diagonalClipStyle}
                className={`p-7 flex flex-col justify-between text-left relative overflow-hidden transition-all duration-300 ${
                  plan.popular 
                    ? 'bg-zinc-950 text-white border-2 border-blue-500 shadow-xl' 
                    : 'bg-white text-zinc-900 border border-zinc-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-4 right-4 bg-blue-600 text-white font-sans text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full">
                    POPULAR
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-sans font-bold uppercase tracking-wide">{plan.name}</h3>
                    <p className={`text-xs sm:text-sm mt-2 font-light leading-relaxed ${plan.popular ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      {plan.desc}
                    </p>
                  </div>

                  <div className="border-t border-zinc-200/50 pt-4">
                    <span className="text-[10px] font-sans uppercase tracking-wider text-zinc-400 font-medium">Target Cost</span>
                    <div className="flex items-baseline mt-1 space-x-1">
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-display font-black tracking-tight">
                        {typeof plan.monthlyPrice === 'number' 
                          ? `$${(billingPeriod === 'annual' ? plan.annualPrice : plan.monthlyPrice).toLocaleString()}`
                          : plan.monthlyPrice}
                      </span>
                      {typeof plan.monthlyPrice === 'number' && (
                        <span className="text-[11px] text-zinc-400 font-sans font-medium">/mo</span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-3 border-t border-zinc-200/50 pt-4">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs leading-normal font-light">
                        <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-blue-400' : 'text-zinc-500'}`} />
                        <span className={plan.popular ? 'text-zinc-300' : 'text-zinc-700'}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <a 
                    href="#results"
                    className={`w-full py-3 rounded-xl font-sans text-xs font-semibold tracking-wider uppercase flex items-center justify-center transition-colors ${
                      plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                        : 'bg-zinc-950 hover:bg-zinc-850 text-white'
                    }`}
                  >
                    Get started
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Guarantee bar */}
          <div className="p-5 rounded-3xl bg-zinc-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div className="relative z-10 flex items-center space-x-3">
              <div className="p-2 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400">
                <Star className="w-4.5 h-4.5 fill-current text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-sans font-bold uppercase tracking-wide text-white">ROI-first Managed Guarantee</h4>
                <p className="text-xs text-zinc-400 mt-0.5 font-light">All system pricing metrics include structured performance-based engagement benchmarks.</p>
              </div>
            </div>
            <a href="#results" className="relative z-10 text-xs font-sans uppercase tracking-widest font-bold text-blue-400 hover:text-blue-300 transition-colors">
              Read Governance Charter &rarr;
            </a>
          </div>

          {/* Comparative grids (Reference 5 lists layout) */}
          <div className="pt-12 border-t border-zinc-200 text-left space-y-6">
            <h3 className="text-2xl sm:text-3xl font-display font-semibold text-zinc-950 tracking-tight text-center">
              How Businesses Win with FixIAI.
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: '18x Faster Delivery',
                  desc: 'Skip tedious months of backend stack debugging. We deploy functional private enterprise setups within 3 weeks.'
                },
                {
                  title: 'ROI-First Strategy',
                  desc: 'Every engineering plan focuses purely on concrete throughput gains, support desk overhead reduction, and server cost drops.'
                },
                {
                  title: 'Complete Model Agnosticism',
                  desc: 'Avoid proprietary single-vendor lock-in. Move model payloads between GPT, Llama, Claude, or DeepSeek without rewriting core code.'
                },
                {
                  title: 'Production air-gapped ready',
                  desc: 'Host systems in isolated VPC, private Docker hubs, or secure edge networks. Zero telemetry leakage guaranteed.'
                }
              ].map((card, idx) => (
                <div key={idx} className="p-6 bg-white border border-zinc-200 rounded-3xl flex flex-col justify-between hover:shadow-xs transition-shadow">
                  <div className="space-y-3">
                    <div className="w-7 h-7 rounded-lg bg-zinc-50 border border-zinc-150 flex items-center justify-center text-zinc-600">
                      <Sparkles className="w-4 h-4 text-zinc-600" />
                    </div>
                    <h4 className="text-sm font-sans font-bold uppercase tracking-wide text-zinc-950">{card.title}</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed font-light">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </motion.section>

      {/* =========================================================================
          SECTION 8 — RESULTS & CTA (Immersive diagonal background & white input box - Reference 10)
          ========================================================================= */}
      <motion.section 
        id="results" 
        className="relative py-16 lg:py-20 bg-[#0a0a0c] text-white overflow-hidden border-b border-zinc-900"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-900/10 blur-[130px] pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 space-y-16 relative z-10">
          
          {/* Animated outcomes metrics counters (Reference 2 metrics) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 border-b border-zinc-900 pb-12 text-center">
            {[
              { value: '18x', label: 'Average Output Gain' },
              { value: '98.5%', label: 'Retention Rate' },
              { value: '-82%', label: 'Cost Reduction' },
              { value: '99.98%', label: 'Uptime SLA' }
            ].map((st, i) => (
              <div key={i} className="space-y-1">
                <div className="text-3xl sm:text-5xl lg:text-6xl font-display font-semibold text-white tracking-tight">{st.value}</div>
                <div className="text-xs font-sans text-zinc-500 font-bold uppercase tracking-wider">{st.label}</div>
              </div>
            ))}
          </div>

          {/* Immersive diagonal CTA card (Matches Reference 10 perfectly) */}
          <div 
            style={diagonalClipHeroStyle}
            className="relative rounded-3xl bg-gradient-to-tr from-blue-900/40 via-zinc-950 to-indigo-950/40 p-10 sm:p-14 text-center space-y-8 border border-zinc-800 shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-blue-600/10 rounded-full blur-[50px] pointer-events-none" />

            <div className="max-w-2xl mx-auto space-y-3 relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-white tracking-tight leading-tight">
                Secure, custom AI systems. <br />
                Deploy FixIAI today.
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light max-w-lg mx-auto">
                Contact us to discuss your requirements and design a custom plan for your infrastructure. Deploy in weeks.
              </p>
            </div>

            {/* Inset visual white input panel (Reference 10 style) */}
            <div className="max-w-md mx-auto relative z-10 text-left bg-white p-3 rounded-full border border-zinc-200 shadow-lg">
              {!submittedEmail ? (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (email) setSubmittedEmail(true);
                  }}
                  className="flex items-center"
                >
                  <input 
                    type="email" 
                    placeholder="Your corporate e-mail..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-grow bg-transparent px-4 py-2 text-xs sm:text-sm text-zinc-900 focus:outline-none placeholder-zinc-400 font-sans"
                  />
                  <button 
                    type="submit"
                    className="w-10 h-10 bg-zinc-950 text-white rounded-full flex items-center justify-center hover:bg-zinc-800 transition-colors flex-shrink-0 shadow-md"
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

            {/* Security labels footer (Reference 10) */}
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

            {/* Subtle floating star watermark in bottom corner */}
            <div className="absolute bottom-4 right-6 opacity-10 pointer-events-none">
              <Star className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Premium Minimal Footer */}
          <footer className="pt-16 border-t border-zinc-900 grid grid-cols-2 md:grid-cols-6 gap-8 text-left text-xs text-zinc-400">
            
            <div className="col-span-2 space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-display font-semibold text-white text-sm tracking-tight">FixIAI</span>
              </div>
              <p className="text-zinc-500 leading-relaxed font-light text-[11px]">
                Custom AI systems and database integrations. We build secure model pipelines, custom text search engines, and automated workflows.
              </p>
              <div className="text-zinc-650 font-sans text-[10px] uppercase tracking-wider">
                &copy; {new Date().getFullYear()} FixIAI. All rights reserved.
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
      </motion.section>
    </div>
  );
}
