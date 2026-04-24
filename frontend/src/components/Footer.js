'use client';

import Link from 'next/link'
import { Sparkles, Github, Twitter, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-display font-bold text-slate-900 tracking-tight">
                SlideMind<span className="text-brand-600">AI</span>
              </span>
            </Link>
            <p className="text-slate-500 font-body text-sm leading-relaxed mb-6">
              Transforming the way students and professionals learn from lecture content through the power of advanced AI.
            </p>
            <div className="flex gap-4">
              <SocialLink icon={<Twitter className="w-4 h-4" />} href="#" />
              <SocialLink icon={<Github className="w-4 h-4" />} href="#" />
              <SocialLink icon={<Linkedin className="w-4 h-4" />} href="#" />
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-display font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">Product</h4>
            <ul className="space-y-4">
              <FooterLink href="/upload">Upload Slides</FooterLink>
              <FooterLink href="/learn">Study Mode</FooterLink>
              <FooterLink href="#">Quiz Generator</FooterLink>
              <FooterLink href="#">AI Chat Tutor</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">Resources</h4>
            <ul className="space-y-4">
              <FooterLink href="#">Documentation</FooterLink>
              <FooterLink href="#">Tutorials</FooterLink>
              <FooterLink href="#">Blog</FooterLink>
              <FooterLink href="#">API Status</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-2 text-slate-500 text-sm">
                <Mail className="w-4 h-4 text-brand-500" />
                support@slidemind.ai
              </li>
              <li className="text-slate-500 text-sm leading-relaxed">
                Available for custom enterprise solutions and school integrations.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs font-medium">
            © {currentYear} SlideMind AI. All rights reserved.
          </p>
          <div className="flex gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <Link href="#" className="hover:text-brand-600 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-brand-600 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, children }) {
  return (
    <li>
      <Link href={href} className="text-slate-500 hover:text-brand-600 transition-colors text-sm font-medium">
        {children}
      </Link>
    </li>
  )
}

function SocialLink({ icon, href }) {
  return (
    <a 
      href={href} 
      className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-brand-50 hover:text-brand-600 transition-all shadow-sm"
    >
      {icon}
    </a>
  )
}
