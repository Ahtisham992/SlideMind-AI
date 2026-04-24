'use client';

import { useState, useEffect, useRef } from 'react'
import { quizApi } from '../lib/api'
import { Brain, CheckCircle2, XCircle, Loader2, ArrowRight, RotateCcw, Sparkles, Settings } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function QuizPanel() {
  const [doc, setDoc] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedOpt, setSelectedOpt] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(false)
  const [quizFinished, setQuizFinished] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  
  // Config state
  const [difficulty, setDifficulty] = useState('medium')
  const [numQuestions, setNumQuestions] = useState(5)

  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    const savedDoc = sessionStorage.getItem('currentDocument')
    if (savedDoc) {
      setDoc(JSON.parse(savedDoc))
    }
  }, [])

  const startQuiz = () => {
    if (!doc) return
    setQuizStarted(true)
    generateQuiz(doc.raw_text, difficulty, numQuestions)
  }

  const generateQuiz = async (text, diff, num) => {
    setLoading(true)
    try {
      const response = await quizApi.generate(text, diff, num)
      setQuestions(response.questions)
    } catch (error) {
      console.error('Quiz error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (label) => {
    if (showResult) return
    setSelectedOpt(label)
    setShowResult(true)
    if (label === questions[currentIdx].correct_answer) {
      setScore(prev => prev + 1)
    }
  }

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1)
      setSelectedOpt(null)
      setShowResult(false)
    } else {
      setQuizFinished(true)
    }
  }

  const resetQuiz = () => {
    setCurrentIdx(0)
    setSelectedOpt(null)
    setShowResult(false)
    setScore(0)
    setQuizFinished(false)
    setQuizStarted(false)
    setQuestions([])
  }

  if (!quizStarted) {
    return (
      <div className="glass-card p-12 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8 text-brand-600">
          <Settings className="w-6 h-6" />
          <h2 className="text-2xl font-display font-bold text-slate-900">Quiz Configuration</h2>
        </div>

        <div className="space-y-8">
          <div>
            <label className="block text-slate-500 font-body mb-4 text-xs font-bold uppercase tracking-wider">Select Difficulty</label>
            <div className="flex gap-4">
              {['easy', 'medium', 'hard'].map(level => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`flex-1 py-3 px-4 rounded-2xl font-bold capitalize transition-all border-2
                    ${difficulty === level 
                      ? 'bg-brand-50 border-brand-500 text-brand-600' 
                      : 'border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-500 font-body mb-4 text-xs font-bold uppercase tracking-wider">Number of Questions</label>
            <div className="flex gap-4">
              {[5, 10, 15].map(num => (
                <button
                  key={num}
                  onClick={() => setNumQuestions(num)}
                  className={`flex-1 py-3 px-4 rounded-2xl font-bold transition-all border-2
                    ${numQuestions === num 
                      ? 'bg-blue-50 border-blue-500 text-blue-600' 
                      : 'border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
                >
                  {num} Questions
                </button>
              ))}
            </div>
          </div>
          
          <button onClick={startQuiz} className="btn-primary w-full justify-center h-14 mt-8 text-lg group">
            Start Exam
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="glass-card p-20 flex flex-col items-center justify-center text-center">
        <div className="relative w-24 h-24 mb-10">
          <div className="absolute inset-0 rounded-3xl border-4 border-brand-500/10 border-t-brand-500 animate-spin" />
          <img src="/logo.png" className="absolute inset-0 w-full h-full object-contain p-5" alt="Loading" />
        </div>
        <h3 className="text-xl font-display font-bold mb-2 text-slate-900">Generating Your Quiz</h3>
        <p className="text-slate-400 font-body font-medium">SlideMind AI is crafting questions from your lecture content...</p>
      </div>
    )
  }

  if (quizFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 text-center shadow-2xl"
      >
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-4xl font-display font-bold mb-2 text-slate-900">Quiz Complete!</h2>
        <p className="text-slate-500 mb-8 font-body text-lg font-medium">
          You scored <span className="text-brand-600 font-bold">{score}</span> out of <span className="text-slate-900 font-bold">{questions.length}</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={resetQuiz} className="btn-secondary">
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
          <a href="/learn" className="btn-primary">
            Back to Learning
          </a>
        </div>
      </motion.div>
    )
  }

  if (!questions.length) return null

  const currentQ = questions[currentIdx]

  return (
    <div className="glass-card overflow-hidden shadow-2xl">
      {/* Progress Bar */}
      <div className="h-2 bg-slate-100 w-full">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          className="h-full bg-brand-500 shadow-glow-blue"
        />
      </div>

      <div className="p-8 md:p-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-brand-600 font-display font-bold uppercase tracking-widest text-xs">
            <Brain className="w-4 h-4" />
            Question {currentIdx + 1} of {questions.length}
          </div>
          <div className="text-slate-400 font-mono text-sm font-bold bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
            SCORE: {score}
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-display font-bold mb-10 leading-snug text-slate-900">
          {currentQ.question}
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOpt === opt.label
            const isCorrect = opt.label === currentQ.correct_answer
            
            let btnClass = "text-left p-6 rounded-2xl border-2 transition-all duration-300 font-body relative group h-full font-medium"
            if (!showResult) {
              btnClass += " border-slate-100 bg-white text-slate-700 hover:border-brand-500 hover:bg-brand-50/30 hover:shadow-sm"
            } else {
              if (isCorrect) btnClass += " border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
              else if (isSelected) btnClass += " border-red-500 bg-red-50 text-red-700 shadow-sm"
              else btnClass += " border-slate-50 opacity-40 grayscale"
            }

            return (
              <button 
                key={opt.label}
                onClick={() => handleAnswer(opt.label)}
                disabled={showResult}
                className={btnClass}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors
                    ${isSelected ? 'bg-current text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-brand-100 group-hover:text-brand-600'}`}>
                    {opt.label}
                  </span>
                  <span className="flex-1">{opt.text}</span>
                  {showResult && isCorrect && <CheckCircle2 className="w-6 h-6" />}
                  {showResult && isSelected && !isCorrect && <XCircle className="w-6 h-6" />}
                </div>
              </button>
            )
          })}
        </div>

        <AnimatePresence>
          {showResult && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-10 pt-10 border-t border-slate-100"
            >
              <div className="bg-brand-50/50 p-8 rounded-3xl border border-brand-100 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
                <h4 className="font-display font-bold text-brand-700 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Explanation
                </h4>
                <p className="text-slate-600 font-body font-medium leading-relaxed relative z-10">
                  {currentQ.explanation}
                </p>
              </div>

              <button onClick={handleNext} className="btn-primary w-full justify-center h-16 text-xl shadow-lg">
                {currentIdx < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                <ArrowRight className="w-6 h-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
