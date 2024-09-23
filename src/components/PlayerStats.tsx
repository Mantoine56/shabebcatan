import { useState, useMemo } from 'react'
import { ArrowUpDown } from 'lucide-react'

type PlayerStat = {
  name: string
  totalGames: number
  totalWins: number
  totalSecondPlace: number
  winPercentage: number
  secondPlacePercentage: number
}

export default function PlayerStats({ stats }: { stats: Record<string, { totalGames: number, totalWins: number, totalSecondPlace: number }> }) {
  const [sortColumn, setSortColumn] = useState<keyof PlayerStat>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const handleSort = (column: keyof PlayerStat) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const sortedPlayers = useMemo(() => {
    return Object.entries(stats).map(([name, data]) => ({
      name,
      totalGames: data.totalGames,
      totalWins: data.totalWins,
      totalSecondPlace: data.totalSecondPlace,
      winPercentage: (data.totalWins / data.totalGames) * 100,
      secondPlacePercentage: (data.totalSecondPlace / data.totalGames) * 100
    })).sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [stats, sortColumn, sortDirection])

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            {['name', 'totalGames', 'totalWins', 'totalSecondPlace', 'winPercentage', 'secondPlacePercentage'].map((column) => (
              <th
                key={column}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort(column as keyof PlayerStat)}
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
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.totalGames}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.totalWins}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.totalSecondPlace}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.winPercentage.toFixed(2)}%</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.secondPlacePercentage.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}