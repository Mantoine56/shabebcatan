'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, User, PlusCircle, Menu, X } from 'lucide-react'
import Dashboard from './Dashboard'
import NewGame from './NewGame'
import PlayerStats from './PlayerStats'
import NavButton from './NavButton'
import MobileNavButton from './MobileNavButton'
import useGames from '@/hooks/useGames'
import { Player } from '@/lib/types'

export default function CatanStatsTracker() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { stats, recentGames, addGame, deleteGame } = useGames()

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard stats={stats} recentGames={recentGames} deleteGame={deleteGame} />
      case 'playerStats':
        return <PlayerStats stats={stats} />
      case 'newGame':
        return <NewGame addGame={addGame} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-semibold">Catan Stats Tracker</h1>
          <nav className="hidden md:flex space-x-4">
            <NavButton icon={<BarChart3 className="w-5 h-5" />} label="Dashboard" onClick={() => setActiveTab('dashboard')} active={activeTab === 'dashboard'} />
            <NavButton icon={<User className="w-5 h-5" />} label="Player Stats" onClick={() => setActiveTab('playerStats')} active={activeTab === 'playerStats'} />
          </nav>
          <button
            onClick={() => setActiveTab('newGame')}
            className="hidden md:flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            <span>New Game</span>
          </button>
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <MobileNavButton label="Dashboard" onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }} active={activeTab === 'dashboard'} />
              <MobileNavButton label="Player Stats" onClick={() => { setActiveTab('playerStats'); setMobileMenuOpen(false); }} active={activeTab === 'playerStats'} />
              <MobileNavButton label="New Game" onClick={() => { setActiveTab('newGame'); setMobileMenuOpen(false); }} active={activeTab === 'newGame'} />
            </div>
          </div>
        )}
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}