import { useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white font-poppins">
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      
      <main className="grow">

        <div className="h-[200vh] bg-linear-to-b from-white to-slate-50 flex items-center justify-center">
          <h1 className="text-slate-300 text-4xl font-black uppercase tracking-widest">
            Content 
          </h1>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App