import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'

function App() {
  return (
    <Router>
      <div className="font-inter">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Add other routes like /shop, /cart here */}
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
