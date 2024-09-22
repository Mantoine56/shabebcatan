import { useMemo } from 'react'
import ChartCard from './ChartCard'
import RecentGames from './RecentGames'
import { Game, Stats } from '@/lib/types'

interface DashboardProps {
  games: Game[]
  stats: Stats
  editGame: (id: string, updatedGame: Partial<Omit<Game, 'id'>>) => Promise<void>
  removeGame: (id: string) => Promise<void>
}

export default function Dashboard({ games, stats, editGame, removeGame }: DashboardProps) {
  const winPercentageData = useMemo(() => {
    return Object.entries(stats).map(([player, playerStats]) => ({
      name: player,
      percentage: playerStats.participations > 0 ? (playerStats.wins / playerStats.participations) * 100 : 0
    })).sort((a, b) => b.percentage - a.percentage).slice(0, 5)
  }, [stats])

  const secondPlaceData = useMemo(() => {
    return Object.entries(stats).map(([player, playerStats]) => ({
      name: player,
      secondPlace: playerStats.secondPlace
    })).sort((a, b) => b.secondPlace - a.secondPlace).slice(0, 5)
  }, [stats])

  const mostGamesPlayedData = useMemo(() => {
    return Object.entries(stats).map(([player, playerStats]) => ({
      name: player,
      gamesPlayed: playerStats.participations
    })).sort((a, b) => b.gamesPlayed - a.gamesPlayed).slice(0, 5)
  }, [stats])

  const last10GamesWinPercentageData = useMemo(() => {
    const last10Games = games.slice(-10)
    const playerWins: { [key: string]: number } = {}
    const playerParticipations: { [key: string]: number } = {}

    last10Games.forEach(game => {
      game.players.forEach(player => {
        playerParticipations[player] = (playerParticipations[player] || 0) + 1
        if (player === game.winner) {
          playerWins[player] = (playerWins[player] || 0) + 1
        }
      })
    })

    return Object.entries(playerParticipations).map(([player, participations]) => ({
      name: player,
      percentage: (playerWins[player] || 0) / participations * 100
    })).sort((a, b) => b.percentage - a.percentage).slice(0, 5)
  }, [games])

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <ChartCard title="Highest Win Percentage" data={winPercentageData} dataKey="percentage" />
        <ChartCard title="Most 2nd Place Finishes" data={secondPlaceData} dataKey="secondPlace" />
        <ChartCard title="Most Games Played" data={mostGamesPlayedData} dataKey="gamesPlayed" />
        <ChartCard title="Best Win % (Last 10 Games)" data={last10GamesWinPercentageData} dataKey="percentage" />
      </div>
      <RecentGames games={games} editGame={editGame} removeGame={removeGame} />
    </div>
  )
}