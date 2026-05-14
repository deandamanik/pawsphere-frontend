import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-8">
      <section id="center" className="flex flex-col items-center justify-center text-center py-16">
        <div className="relative mb-8 flex items-center justify-center">
          <img src={heroImg} className="relative z-10" width="170" height="179" alt="Hero" />
          <img 
            src={reactLogo} 
            className="absolute -top-4 -right-8 w-16 h-16 animate-spin-slow opacity-80" 
            alt="React logo" 
          />
          <img 
            src={viteLogo} 
            className="absolute -bottom-4 -left-8 w-16 h-16 hover:drop-shadow-[0_0_2em_#646cffaa] transition-filter" 
            alt="Vite logo" 
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Get started
          </h1>
          <p className="text-slate-400 text-lg">
            Edit <code className="bg-slate-800 px-2 py-1 rounded text-cyan-300">src/App.jsx</code> and save to test <code className="text-purple-400 font-mono">HMR</code>
          </p>
        </div>

        <button
          type="button"
          className="mt-10 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all rounded-lg font-medium shadow-lg shadow-indigo-500/20"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="h-px w-full bg-linear-to-r from-transparent via-slate-700 to-transparent my-12"></div>

      <section id="next-steps" className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 py-8">
        {/* Documentation */}
        <div id="docs" className="space-y-4 p-6 rounded-2xl border border-slate-800 bg-slate-800/30">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h2 className="text-2xl font-semibold">Documentation</h2>
          </div>
          <p className="text-slate-400">Your questions, answered</p>
          <ul className="grid grid-cols-1 gap-3">
            <li>
              <a href="https://vite.dev/" target="_blank" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group">
                <img className="w-5 h-5 group-hover:scale-110 transition-transform" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group">
                <img className="w-5 h-5 group-hover:scale-110 transition-transform" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>

        <div id="social" className="space-y-4 p-6 rounded-2xl border border-slate-800 bg-slate-800/30">
          <h2 className="text-2xl font-semibold">Connect with us</h2>
          <p className="text-slate-400">Join the Vite community</p>
          <ul className="flex flex-wrap gap-4">
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank" className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full block transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section id="spacer" className="h-32"></section>
    </div>
  )
}

export default App