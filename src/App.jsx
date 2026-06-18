import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Contact from './pages/Contact'

function App() {
  return (
    <Router>
      <div className="font-inter">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            {/* Add other routes like /shop, /cart here */}
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
