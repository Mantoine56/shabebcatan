import { useState, useMemo } from 'react'
import { ArrowUpDown, Trophy } from 'lucide-react'

type PlayerStat = {
  name: string
  totalGames: number
  totalWins: number
  totalSecondPlace: number
  winPercentage: number
  secondPlacePercentage: number
}

export default function PlayerStats({ stats }: { stats: Record<string, { totalGames: number, totalWins: number, totalSecondPlace: number }> }) {
  const [sortColumn, setSortColumn] = useState<keyof PlayerStat>('winPercentage')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const handleSort = (column: keyof PlayerStat) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection(column === 'name' ? 'asc' : 'desc')
    }
  }

  const sortedPlayers = useMemo(() => {
    return Object.entries(stats).map(([name, data]) => ({
      name,
      totalGames: data.totalGames,
      totalWins: data.totalWins,
      totalSecondPlace: data.totalSecondPlace,
      winPercentage: data.totalGames > 0 ? (data.totalWins / data.totalGames) * 100 : 0,
      secondPlacePercentage: data.totalGames > 0 ? (data.totalSecondPlace / data.totalGames) * 100 : 0
    })).sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [stats, sortColumn, sortDirection])

  const topPerformers = useMemo(() => {
    const maxValues = {
      totalGames: Math.max(...sortedPlayers.map(p => p.totalGames)),
      totalWins: Math.max(...sortedPlayers.map(p => p.totalWins)),
      totalSecondPlace: Math.max(...sortedPlayers.map(p => p.totalSecondPlace)),
      winPercentage: Math.max(...sortedPlayers.map(p => p.winPercentage)),
      secondPlacePercentage: Math.max(...sortedPlayers.map(p => p.secondPlacePercentage))
    }
    return maxValues
  }, [sortedPlayers])

  const getSortIcon = (column: keyof PlayerStat) => {
    if (column === sortColumn) {
      return (
        <ArrowUpDown 
          size={14} 
          className={`transform ${sortDirection === 'desc' ? 'rotate-180' : ''} text-blue-500`}
        />
      )
    }
    return <ArrowUpDown size={14} className="text-gray-400" />
  }

  const getColumnLabel = (column: string) => {
    switch (column) {
      case 'name': return 'Player'
      case 'totalGames': return 'G'
      case 'totalWins': return 'W'
      case 'totalSecondPlace': return '2nd'
      case 'winPercentage': return 'Win %'
      case 'secondPlacePercentage': return '2nd %'
      default: return column
    }
  }

  const getMobileColumnLabel = (column: string) => {
    switch (column) {
      case 'name': return 'Player'
      case 'totalGames': return 'G'
      case 'totalWins': return 'W'
      case 'totalSecondPlace': return '2nd'
      case 'winPercentage': return 'Win%'
      case 'secondPlacePercentage': return '2nd%'
      default: return column
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            {['name', 'totalGames', 'totalWins', 'totalSecondPlace', 'winPercentage', 'secondPlacePercentage'].map((column) => (
              <th
                key={column}
                className={`px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap ${
                  column === 'name' ? 'min-w-[100px]' : 'w-[60px] sm:w-auto'
                }`}
                onClick={() => handleSort(column as keyof PlayerStat)}
              >
                <div className="flex items-center space-x-1">
                  <span className="hidden sm:inline">{getColumnLabel(column)}</span>
                  <span className="sm:hidden">{getMobileColumnLabel(column)}</span>
                  {getSortIcon(column as keyof PlayerStat)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedPlayers.map((player) => (
            <tr 
              key={player.name}
              className="hover:bg-blue-50 transition-colors duration-150 ease-in-out"
            >
              <td className="px-2 sm:px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {player.name}
              </td>
              <td className="px-2 sm:px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <span>{player.totalGames}</span>
                  {player.totalGames === topPerformers.totalGames && player.totalGames > 0 && (
                    <Trophy size={14} className="text-yellow-500" />
                  )}
                </div>
              </td>
              <td className="px-2 sm:px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <span>{player.totalWins}</span>
                  {player.totalWins === topPerformers.totalWins && player.totalWins > 0 && (
                    <Trophy size={14} className="text-yellow-500" />
                  )}
                </div>
              </td>
              <td className="px-2 sm:px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <span>{player.totalSecondPlace}</span>
                  {player.totalSecondPlace === topPerformers.totalSecondPlace && player.totalSecondPlace > 0 && (
                    <Trophy size={14} className="text-yellow-500" />
                  )}
                </div>
              </td>
              <td className="px-2 sm:px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <span className={player.winPercentage === topPerformers.winPercentage && player.winPercentage > 0 ? 'font-medium' : ''}>
                    {player.winPercentage.toFixed(1)}%
                  </span>
                  {player.winPercentage === topPerformers.winPercentage && player.winPercentage > 0 && (
                    <Trophy size={14} className="text-yellow-500" />
                  )}
                </div>
              </td>
              <td className="px-2 sm:px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <span>{player.secondPlacePercentage.toFixed(1)}%</span>
                  {player.secondPlacePercentage === topPerformers.secondPlacePercentage && player.secondPlacePercentage > 0 && (
                    <Trophy size={14} className="text-yellow-500" />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}