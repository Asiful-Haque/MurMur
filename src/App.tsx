import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Timeline from './pages/Timeline'
import Profile from './pages/Profile'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Timeline />} />
        <Route path="/profile/:userId" element={<Profile />} />
      </Routes>
    </Router>
  )
}

export default App
