'use client';

import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { LogOut, User as UserIcon, LogIn } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 border-b border-slate-200/60 bg-white/80 backdrop-blur-md z-[100]">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-xl overflow-hidden group-hover:shadow-glow-blue transition-all duration-300">
            <img 
              src="/logo.png" 
              alt="SlideMind AI Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xl font-display font-black tracking-tight text-slate-900">
            Slide<span className="text-brand-600">Mind</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="/upload">Dashboard & History</NavLink>
          <NavLink href="/learn">Study Mode</NavLink>
          
          {user ? (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-6 h-6 rounded-lg bg-brand-500 flex items-center justify-center text-white">
                  <UserIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-bold text-slate-700">{user.full_name?.split(' ')[0]}</span>
              </div>
              <button 
                onClick={logout}
                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors">
                Log In
              </Link>
              <Link href="/signup" className="btn-primary py-2 px-5 text-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, children }) {
  return (
    <Link 
      href={href} 
      className="text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors"
    >
      {children}
    </Link>
  )
}
