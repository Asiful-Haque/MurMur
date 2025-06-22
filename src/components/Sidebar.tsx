'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Home,
  BarChart2,
  Settings,
} from 'lucide-react'

export default function Sidebar({ onSelectPage }) {
  const [clicked, setClicked] = useState(false)
  const [role, setRole] = useState<string | null>(null)


  useEffect(() => {
    const storedRole = localStorage.getItem('role')
    setRole(storedRole)
  }, [])

  return (
    <div
      className={`h-screen bg-gradient-to-br from-blue-600 to-blue-200 text-white transition-all duration-300 ${
        clicked ? 'w-18' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between p-4">
        {!clicked && <h2 className="text-xl font-bold">My App</h2>}
        <button onClick={() => setClicked(!clicked)}>
          {clicked ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>
      <nav className="p-4 space-y-4">
        <button
          onClick={() => onSelectPage('home')}
          className="flex items-center gap-3 hover:bg-blue-600 p-2 rounded w-full text-left"
        >
          <Home size={20} />
          {!clicked && <span>Home</span>}
        </button>
        {role === 'admin' && (
          <button
            onClick={() => onSelectPage('AI Model')}
            className="flex items-center gap-3 hover:bg-blue-600 p-2 rounded w-full text-left"
          >
            <BarChart2 size={20} />
            {!clicked && <span>AI Model</span>}
          </button>
        )}

        {role === 'sales' && (
          <button
            onClick={() => onSelectPage('settings')}
            className="flex items-center gap-3 hover:bg-blue-600 p-2 rounded w-full text-left"
          >
            <Settings size={20} />
            {!clicked && <span>Settings</span>}
          </button>
        )}
      </nav>
    </div>
  )
}
