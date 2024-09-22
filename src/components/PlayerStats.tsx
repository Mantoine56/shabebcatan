import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpDown } from 'lucide-react'
import { Stats, normalizePlayerName } from '@/lib/types'

export default function PlayerStats({ stats }: { stats: Stats }) {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table')  // Changed default to 'table'
  const [sortColumn, setSortColumn] = useState<'name' | 'wins' | 'secondPlace' | 'participations' | 'winPercentage' | 'secondPlacePercentage'>('wins')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const sortedPlayers = Object.entries(stats).map(([player, playerStats]) => ({
    name: normalizePlayerName(player),
    ...playerStats,
    winPercentage: (playerStats.wins / playerStats.participations) * 100 || 0,
    secondPlacePercentage: (playerStats.secondPlace / playerStats.participations) * 100 || 0
  })).sort((a, b) => {
    if (sortColumn === 'name') {
      return sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    } else {
      return sortDirection === 'asc' 
        ? a[sortColumn] - b[sortColumn]
        : b[sortColumn] - a[sortColumn]
    }
  })

  const handleSort = (column: typeof sortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('desc')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Player Stats</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1 rounded-md ${viewMode === 'cards' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
          >
            Cards
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 rounded-md ${viewMode === 'table' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
          >
            Table
          </button>
        </div>
      </div>
      {viewMode === 'cards' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedPlayers.map((player) => (
            <motion.div
              key={player.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6 space-y-4"
            >
              <h3 className="text-xl font-semibold">{player.name}</h3>
              <div className="space-y-2">
                <p>Wins: <span className="font-semibold text-green-600">{player.wins}</span></p>
                <p>Second Place: <span className="font-semibold text-blue-600">{player.secondPlace}</span></p>
                <p>Participations: <span className="font-semibold">{player.participations}</span></p>
                <p>Win %: <span className="font-semibold text-green-600">{player.winPercentage.toFixed(2)}%</span></p>
                <p>2nd Place %: <span className="font-semibold text-blue-600">{player.secondPlacePercentage.toFixed(2)}%</span></p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                {['name', 'wins', 'secondPlace', 'participations', 'winPercentage', 'secondPlacePercentage'].map((column) => (
                  <th
                    key={column}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort(column as typeof sortColumn)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column === 'name' ? 'Player' : column === 'winPercentage' ? 'Win %' : column === 'secondPlacePercentage' ? '2nd Place %' : column}</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedPlayers.map((player) => (
                <tr key={player.name}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{player.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.wins}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.secondPlace}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.participations}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.winPercentage.toFixed(2)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.secondPlacePercentage.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}