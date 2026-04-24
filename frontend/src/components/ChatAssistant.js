'use client';

import { useState, useRef, useEffect } from 'react'
import { aiApi } from '../lib/api'
import { Send, User, Bot, Loader2, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { motion, AnimatePresence } from 'framer-motion'

export default function ChatAssistant({ context }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await aiApi.chat(input, context, messages)
      setMessages(prev => [...prev, { role: 'assistant', content: response.answer }])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error processing your request.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card flex flex-col h-[650px] shadow-2xl overflow-hidden border-slate-200/60 relative">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center shadow-sm">
            <Sparkles className="w-6 h-6 text-brand-600" />
          </div>
          <div>
            <h3 className="font-display font-bold text-slate-900 leading-none">SlideMind AI</h3>
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Assistant Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 p-6 space-y-6 overflow-y-auto font-body scroll-smooth bg-slate-50/30"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
              <Bot className="w-10 h-10 text-slate-200" />
            </div>
            <p className="text-slate-400 text-sm font-medium">
              I've read your slides. Ask me anything about them!
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              key={i} 
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center shadow-sm
                ${msg.role === 'user' ? 'bg-brand-500' : 'bg-white border border-slate-100'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-brand-600" />}
              </div>
              
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed font-medium shadow-sm
                ${msg.role === 'user' 
                  ? 'bg-brand-500 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}`}>
                <ReactMarkdown className="markdown-chat font-body">{msg.content}</ReactMarkdown>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loading && (
          <div className="flex gap-4">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5 text-brand-600" />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
              <Loader2 className="w-4 h-4 text-brand-500 animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-5 bg-white border-t border-slate-100">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask a question..." 
            className="input-field pr-14 h-14"
          />
          <button 
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-500 text-white rounded-xl flex items-center justify-center hover:bg-brand-600 transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-lg"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
