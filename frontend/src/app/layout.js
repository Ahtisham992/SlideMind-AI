import './globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '../context/AuthContext'

export const metadata = {
  title: 'SlideMind AI | Your Intelligent Study Partner',
  description: 'Transform lecture slides into structured knowledge, summaries, and interactive quizzes.',
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-brand-500/10 selection:text-brand-600" suppressHydrationWarning={true}>
        <Toaster position="bottom-right" />
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen pt-16 relative z-10">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
