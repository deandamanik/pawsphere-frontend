import { useState } from 'react'
import Navbar from './components/Navbar'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  return (
    <div className="min-h-screen bg-white font-poppins">
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      
      <main>
      </main>
    </div>
  )
}

export default App