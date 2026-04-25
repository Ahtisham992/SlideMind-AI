'use client';

import { useState, useEffect, useRef } from 'react'
import { aiApi } from '../lib/api'
import { Sparkles, CheckCircle, Loader2, AlertCircle, Brain } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SummaryPanel({ rawText, docId }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (!rawText || hasFetched.current) return
    hasFetched.current = true

    const fetchSummary = async () => {
      // Check cache first
      const cached = sessionStorage.getItem(`summary_${rawText.length}`)
      if (cached) {
        setData(JSON.parse(cached))
        setLoading(false)
        return
      }

      try {
        const response = await aiApi.summarize(rawText, 'standard', docId)
        sessionStorage.setItem(`summary_${rawText.length}`, JSON.stringify(response))
        setData(response)
      } catch (err) {
        setError('Failed to generate summary. Please try again later.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [rawText])

  if (loading) {
    return (
      <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
        <div className="relative w-20 h-20 mb-8">
          <div className="absolute inset-0 rounded-2xl border-4 border-brand-500/10 border-t-brand-500 animate-spin" />
          <img src="/logo.png" className="absolute inset-0 w-full h-full object-contain p-4" alt="Loading" />
        </div>
        <p className="text-slate-400 font-body font-medium">SlideMind AI is analyzing your content...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-card p-12 flex flex-col items-center justify-center text-center border-red-100">
        <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
        <p className="text-slate-600 font-body font-medium">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card p-8 border-brand-500/10"
      >
        <div className="flex items-center gap-2 mb-6 text-brand-600">
          <Sparkles className="w-5 h-5" />
          <h2 className="section-title text-xl uppercase tracking-widest">Executive Summary</h2>
        </div>
        
        <p className="text-xl text-slate-700 leading-relaxed font-body mb-8 font-medium">
          {data?.summary}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data?.key_points?.map((point, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100"
            >
              <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
              <span className="text-slate-600 font-body font-medium">{point}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* AI Recommended Section */}
      {data?.ai_recommended && data.ai_recommended.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 border-amber-200 bg-gradient-to-br from-amber-50 to-white shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6 text-amber-600">
            <Brain className="w-5 h-5" />
            <h2 className="section-title text-xl uppercase tracking-widest text-amber-700">AI Recommended Exam Focus</h2>
          </div>
          <ul className="space-y-4">
            {data.ai_recommended.map((rec, i) => (
              <li key={i} className="flex gap-4 items-start text-slate-700 font-body font-medium">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                {rec}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      <div className="flex flex-wrap gap-2">
        {data?.topics?.map((topic, i) => (
          <span key={i} className="tag-cyan font-display uppercase tracking-wider text-[10px] px-4 py-1.5 font-bold">
            {topic}
          </span>
        ))}
      </div>
    </div>
  )
}
