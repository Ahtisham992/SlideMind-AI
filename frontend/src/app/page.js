'use client';

import { demoDocument } from '../lib/demoData'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, BookOpen, BrainCircuit } from 'lucide-react'

export default function Home() {
  const router = useRouter();

  const handleExploreDemo = () => {
    sessionStorage.setItem('currentDocument', JSON.stringify(demoDocument));
    router.push('/learn');
  };

  return (
    <div className="relative overflow-hidden bg-slate-50/50">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <section className="relative min-h-[85vh] flex flex-col items-center justify-center max-w-7xl mx-auto px-6 py-20">
        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-72 h-72 bg-brand-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-xs font-bold uppercase tracking-widest mb-10 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            AI-Powered Learning has evolved
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl lg:text-9xl font-display font-bold leading-[1.1] text-slate-900 mb-8"
          >
            Study <span className="gradient-text">Smarter</span>,<br />Not Harder.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-2xl text-slate-500 max-w-3xl font-body font-medium mb-12 leading-relaxed"
          >
            SlideMind AI transforms your lecture slides into structured knowledge. 
            Get instant summaries, practice quizzes, and 24/7 AI tutoring.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <Link href="/upload" className="btn-primary group text-xl h-16 px-12 rounded-2xl shadow-xl hover:shadow-brand-500/20 transition-all">
              Transform Your Slides
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
            <button 
              onClick={handleExploreDemo}
              className="btn-secondary text-xl h-16 px-12 rounded-2xl"
            >
              Explore Demo
            </button>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-32">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
        >
          <FeatureCard 
            icon={<BrainCircuit className="w-7 h-7 text-brand-600" />}
            title="Intelligent Summaries"
            desc="Extract core concepts and exam-critical points automatically from your slides."
          />
          <FeatureCard 
            icon={<Sparkles className="w-7 h-7 text-blue-500" />}
            title="AI Chat Tutor"
            desc="Ask questions specifically about your lecture content and get instant answers."
          />
          <FeatureCard 
            icon={<BookOpen className="w-7 h-7 text-indigo-600" />}
            title="Smart Quizzes"
            desc="Test your knowledge with custom AI-generated practice exams tailored to your material."
          />
        </motion.div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="glass-card p-8 text-left hover:border-brand-500/20 transition-all group hover:-translate-y-1">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 font-display text-slate-900">{title}</h3>
      <p className="text-slate-500 leading-relaxed font-body font-medium">{desc}</p>
    </div>
  )
}
