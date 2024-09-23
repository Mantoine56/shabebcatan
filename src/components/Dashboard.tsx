import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import ChartCard from './ChartCard'
import RecentGames from './RecentGames'
import { Stats, Game } from '@/lib/types'

type DashboardProps = {
  stats: Stats
  recentGames: Game[]
  deleteGame: (gameId: string) => Promise<void>
}

export default function Dashboard({ stats, recentGames, deleteGame }: DashboardProps) {
  const winPercentageData = useMemo(() => {
    return Object.entries(stats).map(([player, playerStats]) => ({
      name: player,
      percentage: playerStats.totalGames > 0 ? (playerStats.totalWins / playerStats.totalGames) * 100 : 0
    })).sort((a, b) => b.percentage - a.percentage).slice(0, 5)
  }, [stats])

  const secondPlacePercentageData = useMemo(() => {
    return Object.entries(stats).map(([player, playerStats]) => ({
      name: player,
      percentage: playerStats.totalGames > 0 ? (playerStats.totalSecondPlace / playerStats.totalGames) * 100 : 0
    })).sort((a, b) => b.percentage - a.percentage).slice(0, 5)
  }, [stats])

  const mostGamesPlayedData = useMemo(() => {
    return Object.entries(stats).map(([player, playerStats]) => ({
      name: player,
      gamesPlayed: playerStats.totalGames
    })).sort((a, b) => b.gamesPlayed - a.gamesPlayed).slice(0, 5)
  }, [stats])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ChartCard title="Top 5 Win Percentages" data={winPercentageData} dataKey="percentage" />
        <ChartCard title="Top 5 Second Place Percentages" data={secondPlacePercentageData} dataKey="percentage" />
        <ChartCard title="Most Games Played" data={mostGamesPlayedData} dataKey="gamesPlayed" />
      </div>
      <RecentGames games={recentGames} deleteGame={deleteGame} />
    </div>
  )
}