'use client';

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Book, Layout, MessageSquare, Brain } from 'lucide-react'
import TopicCard from '../../components/TopicCard'
import SummaryPanel from '../../components/SummaryPanel'
import TopicsPanel from '../../components/TopicsPanel'
import ChatAssistant from '../../components/ChatAssistant'
import QuizPanel from '../../components/QuizPanel'
import { useRouter } from 'next/navigation'

export default function LearnPage() {
  const [doc, setDoc] = useState(null)
  const [activeTab, setActiveTab] = useState('summary')
  const router = useRouter()

  useEffect(() => {
    const savedDoc = sessionStorage.getItem('currentDocument')
    if (savedDoc) {
      setDoc(JSON.parse(savedDoc))
    }
  }, [])

  if (!doc) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center mb-8 shadow-sm">
          <Brain className="w-12 h-12 text-brand-200" />
        </div>
        <h2 className="text-3xl font-display font-bold mb-3 text-slate-900">No lecture found</h2>
        <p className="text-slate-500 mb-10 font-medium text-lg">Please upload a document to start learning.</p>
        <a href="/upload" className="btn-primary px-8">Go to Upload</a>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Main Content Area */}
        <div className="flex-1 space-y-10">
          <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="tag mb-4 shadow-sm font-bold uppercase tracking-widest">{doc.filename}</div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900">{doc.filename.split('.')[0]}</h1>
              <p className="text-slate-400 mt-2 font-body font-bold uppercase tracking-widest text-xs">Extracted {doc.total_slides} content slides</p>
            </div>
            
            <div className="flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
              <TabButton 
                active={activeTab === 'summary'} 
                onClick={() => setActiveTab('summary')}
                icon={<Layout className="w-4 h-4" />}
                label="Summary" 
              />
              <TabButton 
                active={activeTab === 'topics'} 
                onClick={() => setActiveTab('topics')}
                icon={<Book className="w-4 h-4" />}
                label="Topics" 
              />
              <TabButton 
                active={activeTab === 'quiz'} 
                onClick={() => setActiveTab('quiz')}
                icon={<Brain className="w-4 h-4" />}
                label="Take Quiz" 
              />
            </div>
          </header>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
          {activeTab === 'summary' && doc.raw_text && <SummaryPanel rawText={doc.raw_text} docId={doc.id} />}
          {activeTab === 'topics' && doc.raw_text && <TopicsPanel rawText={doc.raw_text} docId={doc.id} />}
          {activeTab === 'quiz' && doc.raw_text && <QuizPanel rawText={doc.raw_text} />}
          </motion.div>
        </div>

        {/* Sidebar AI Chat */}
        <div className="w-full lg:w-[400px] sticky top-24 h-fit">
          <ChatAssistant context={doc.raw_text} />
        </div>
      </div>
    </div>
  )
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300
        ${active ? 'bg-white text-brand-600 shadow-md ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'}`}
    >
      {icon}
      {label}
    </button>
  )
}
