'use client';

import { BookOpen, ChevronRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function TopicCard({ title, summary, keyConcepts, onClick }) {
  // Fallback for demo cards if props aren't provided
  const displayTitle = title || "Key Concept"
  const displaySummary = summary || "Detailed breakdown of this specific topic extracted from your slides."
  const displayConcepts = keyConcepts || ["Concept A", "Concept B", "Example 1"]

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="glass-card p-6 border-slate-100 hover:border-brand-500/20 group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-brand-50 transition-colors shadow-sm">
          <BookOpen className="w-6 h-6 text-slate-400 group-hover:text-brand-600" />
        </div>
        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
      </div>

      <h3 className="text-lg font-display font-bold mb-2 text-slate-900 group-hover:text-brand-600 transition-colors">
        {displayTitle}
      </h3>
      
      <p className="text-sm text-slate-500 font-body mb-6 line-clamp-2 font-medium">
        {displaySummary}
      </p>

      <div className="flex flex-wrap gap-2">
        {displayConcepts.slice(0, 3).map((concept, i) => (
          <span key={i} className="text-[10px] bg-slate-100 px-3 py-1.5 rounded-lg text-slate-600 font-bold uppercase tracking-wider">
            {concept}
          </span>
        ))}
        {displayConcepts.length > 3 && (
          <span className="text-[10px] text-slate-400 font-bold self-center ml-1">
            +{displayConcepts.length - 3} more
          </span>
        )}
      </div>
    </motion.div>
  )
}
