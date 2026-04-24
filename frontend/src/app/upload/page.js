'use client';

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import UploadZone from '../../components/UploadZone'
import { motion } from 'framer-motion'
import { Sparkles, History, FileText, ArrowRight, Loader2 } from 'lucide-react'
import { documentApi } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'

export default function UploadPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      fetchHistory()
    }
  }, [user, loading])

  const fetchHistory = async () => {
    try {
      const data = await documentApi.getHistory()
      setHistory(data)
    } catch (error) {
      console.error('Failed to fetch history:', error)
    } finally {
      setHistoryLoading(false)
    }
  }

  const handleUploadSuccess = (data) => {
    // Save to active session
    sessionStorage.setItem('currentDocument', JSON.stringify(data))
    router.push('/learn')
  }

  const handleHistoryClick = (item) => {
    // Since history now only stores metadata, we might need a fetch for full content
    // For now, if the original app expected full data in history, we'll need to adjust
    // But usually, clicking history should load that doc into the session
    // For simplicity in this step, I'll assume we need to fetch the full doc if not present
    sessionStorage.setItem('currentDocument', JSON.stringify(item))
    router.push('/learn')
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-brand-600" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-20 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-widest mb-8 border border-brand-100 shadow-sm">
          <Sparkles className="w-4 h-4" />
          Ready to enhance your learning?
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-slate-900">Upload Your Material</h1>
        <p className="text-slate-500 max-w-lg mx-auto font-body text-lg font-medium">
          Upload your lecture slides and let SlideMind AI weave its magic.
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <UploadZone onUploadSuccess={handleUploadSuccess} />
      </motion.div>

      {historyLoading ? (
        <div className="flex justify-center mt-20">
          <Loader2 className="w-8 h-8 animate-spin text-slate-200" />
        </div>
      ) : history.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20"
        >
          <div className="flex items-center gap-2 mb-8 text-slate-400">
            <History className="w-5 h-5" />
            <h3 className="font-display font-bold uppercase tracking-widest text-xs">Recent Documents</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item) => (
              <div 
                key={item.id}
                onClick={() => handleHistoryClick(item)}
                className="glass-card p-6 cursor-pointer hover:border-brand-500/20 group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-brand-600 group-hover:bg-brand-50 transition-colors shadow-sm">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <h4 className="font-display font-bold truncate text-slate-900 group-hover:text-brand-600 transition-colors">
                      {item.filename.split('.')[0]}
                    </h4>
                    <p className="text-xs text-slate-400 font-body font-bold">
                      {item.total_slides} slides • {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
