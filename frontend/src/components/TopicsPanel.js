'use client';

import { useState, useEffect, useRef } from 'react'
import { aiApi } from '../lib/api'
import TopicCard from './TopicCard'
import { BookOpen, Loader2, AlertCircle, ArrowLeft, Lightbulb, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'

export default function TopicsPanel({ rawText }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [explanation, setExplanation] = useState(null)
  const [expLoading, setExpLoading] = useState(false)
  
  const hasFetched = useRef(false)

  useEffect(() => {
    if (!rawText || hasFetched.current) return
    hasFetched.current = true

    const fetchTopics = async () => {
      const cached = sessionStorage.getItem(`topics_${rawText.length}`)
      if (cached) {
        setData(JSON.parse(cached))
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const response = await aiApi.extractTopics(rawText)
        sessionStorage.setItem(`topics_${rawText.length}`, JSON.stringify(response))
        setData(response)
      } catch (err) {
        setError('Failed to extract topics. Please try again later.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTopics()
  }, [rawText])

  if (loading) {
    return (
      <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
        <div className="relative w-20 h-20 mb-8">
          <div className="absolute inset-0 rounded-2xl border-4 border-brand-500/10 border-t-brand-500 animate-spin" />
          <img src="/logo.png" className="absolute inset-0 w-full h-full object-contain p-4" alt="Loading" />
        </div>
        <h3 className="text-xl font-display font-bold mb-2 text-slate-900">Structuring Content</h3>
        <p className="text-slate-400 font-body font-medium">SlideMind AI is creating a study flow from your slides...</p>
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

  if (!data?.topics || data.topics.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-4" />
        <p className="text-slate-400 font-body font-medium">No distinct topics could be identified from these slides.</p>
      </div>
    )
  }

  const handleTopicClick = async (topic) => {
    setSelectedTopic(topic)
    setExplanation(null)
    setExpLoading(true)
    try {
      const response = await aiApi.explain(rawText, topic.title)
      setExplanation(response)
    } catch (err) {
      console.error(err)
      setExplanation({ explanation: "Failed to load explanation." })
    } finally {
      setExpLoading(false)
    }
  }

  if (selectedTopic) {
    return (
      <div className="space-y-6 flex flex-col w-full h-full">
        <button 
          onClick={() => setSelectedTopic(null)}
          className="text-slate-400 hover:text-brand-600 flex items-center gap-2 transition-all mb-4 w-fit hover:-translate-x-1 font-bold uppercase tracking-wider text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Topics
        </button>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 md:p-12 border-brand-500/10 shadow-2xl"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center shadow-sm">
              <BookOpen className="w-6 h-6 text-brand-600" />
            </div>
            <h2 className="text-3xl font-display font-bold text-slate-900">{selectedTopic.title}</h2>
          </div>
          
          {expLoading ? (
             <div className="flex flex-col items-center justify-center py-20 text-center">
               <div className="relative w-22 h-22 mb-8">
                 <div className="absolute inset-0 rounded-2xl border-4 border-brand-500/10 border-t-brand-500 animate-spin" />
                 <img src="/logo.png" className="absolute inset-0 w-full h-full object-contain p-5" alt="Loading" />
               </div>
               <p className="text-slate-400 font-body font-bold uppercase tracking-widest text-xs">Generating deep-dive explanation...</p>
             </div>
          ) : (
            <div className="space-y-10">
              <div>
                <h4 className="flex items-center gap-2 font-display text-blue-600 font-bold tracking-wider uppercase text-sm mb-6">
                  <Sparkles className="w-4 h-4" /> Detailed Explanation
                </h4>
                <div className="prose prose-slate prose-brand max-w-none text-slate-600 font-body font-medium leading-relaxed prose-headings:text-slate-900 prose-headings:font-display prose-a:text-brand-600">
                  <ReactMarkdown>{explanation?.explanation || ''}</ReactMarkdown>
                </div>
              </div>

              {explanation?.examples && explanation.examples.length > 0 && (
                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
                  <h4 className="flex items-center gap-2 font-display text-emerald-600 font-bold tracking-wider uppercase text-sm mb-6 relative z-10">
                    <Lightbulb className="w-5 h-5" /> Real World Examples
                  </h4>
                  <ul className="space-y-4 relative z-10">
                    {explanation.examples.map((ex, i) => (
                      <li key={i} className="flex gap-4 items-start text-slate-700 font-body font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0 shadow-sm"></span>
                        {ex}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-6 flex flex-col w-full h-full">
      <div className="flex items-center gap-3 mb-4 text-brand-600">
        <BookOpen className="w-6 h-6" />
        <h2 className="section-title text-xl uppercase tracking-widest text-slate-900">
          Extracted Topics <span className="text-brand-600">({data.total_topics})</span>
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <AnimatePresence>
          {data.topics.map((topic, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <TopicCard 
                title={topic.title} 
                summary={topic.summary} 
                keyConcepts={topic.key_concepts || []} 
                onClick={() => handleTopicClick(topic)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
