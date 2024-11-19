import { useMemo, useState } from 'react'
import { Game, Player } from '@/lib/types'
import { Trophy, Flame, Star, TrendingUp, Medal, Crown } from 'lucide-react'
import LightboxModal from './LightboxModal'

type StreakCardProps = {
  title: string
  value: string | number
  icon: React.ReactNode
  description?: string
  player?: string
  date?: string
  onClick?: () => void
}

type StreakType = 
  | 'currentStreak'
  | 'longestWinStreak'
  | 'consecutiveGames'
  | 'perfectGame'
  | 'secondPlaceStreak'
  | 'dominantPeriod'

type StreakDetailProps = {
  games: Game[]
  streakType: StreakType
  period?: number
  title: string
}

const StreakDetail = ({ games, streakType, period, title }: StreakDetailProps) => {
  const sortedGames = [...games].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const calculateStreaks = () => {
    switch (streakType) {
      case 'longestWinStreak': {
        const winStreaks = new Map<string, { streak: number; endDate: string }[]>()
        
        sortedGames.forEach((game, index) => {
          let streak = 1
          let i = index + 1
          while (i < sortedGames.length && sortedGames[i].winner === game.winner) {
            streak++
            i++
          }
          if (streak > 1) {
            const playerStreaks = winStreaks.get(game.winner) || []
            playerStreaks.push({ streak, endDate: game.date })
            winStreaks.set(game.winner, playerStreaks)
          }
        })

        return Array.from(winStreaks.entries())
          .map(([player, streaks]) => ({
            player,
            longestStreak: Math.max(...streaks.map(s => s.streak)),
            streakCount: streaks.length,
            lastStreakDate: streaks[0].endDate
          }))
          .sort((a, b) => b.longestStreak - a.longestStreak)
      }

      case 'consecutiveGames': {
        const playedStreaks = new Map<string, { streak: number; endDate: string }[]>()
        
        sortedGames.forEach((game, index) => {
          game.players.forEach(player => {
            let streak = 1
            let i = index + 1
            while (i < sortedGames.length && sortedGames[i].players.includes(player)) {
              streak++
              i++
            }
            if (streak > 1) {
              const playerStreaks = playedStreaks.get(player) || []
              playerStreaks.push({ streak, endDate: game.date })
              playedStreaks.set(player, playerStreaks)
            }
          })
        })

        return Array.from(playedStreaks.entries())
          .map(([player, streaks]) => ({
            player,
            longestStreak: Math.max(...streaks.map(s => s.streak)),
            streakCount: streaks.length,
            lastStreakDate: streaks[0].endDate
          }))
          .sort((a, b) => b.longestStreak - a.longestStreak)
      }

      case 'secondPlaceStreak': {
        const secondPlaceStreaks = new Map<string, { streak: number; endDate: string }[]>()
        
        sortedGames.forEach((game, index) => {
          game.secondPlaces.forEach(player => {
            let streak = 1
            let i = index + 1
            while (i < sortedGames.length && sortedGames[i].secondPlaces.includes(player)) {
              streak++
              i++
            }
            if (streak > 1) {
              const playerStreaks = secondPlaceStreaks.get(player) || []
              playerStreaks.push({ streak, endDate: game.date })
              secondPlaceStreaks.set(player, playerStreaks)
            }
          })
        })

        return Array.from(secondPlaceStreaks.entries())
          .map(([player, streaks]) => ({
            player,
            longestStreak: Math.max(...streaks.map(s => s.streak)),
            streakCount: streaks.length,
            lastStreakDate: streaks[0].endDate
          }))
          .sort((a, b) => b.longestStreak - a.longestStreak)
      }

      case 'dominantPeriod': {
        if (!period) return []
        const periodGames = sortedGames.slice(0, period)
        const playerStats = new Map<string, number>()
        
        periodGames.forEach(game => {
          playerStats.set(game.winner, (playerStats.get(game.winner) || 0) + 1)
        })

        return Array.from(playerStats.entries())
          .map(([player, wins]) => ({
            player,
            wins,
            winRate: (wins / period * 100).toFixed(1),
            gamesPlayed: periodGames.filter(g => g.players.includes(player)).length
          }))
          .sort((a, b) => b.wins - a.wins)
      }

      case 'perfectGame': {
        const perfectGames = new Map<string, number>()
        
        sortedGames.forEach(game => {
          if (game.secondPlaces.length === 0) {
            perfectGames.set(game.winner, (perfectGames.get(game.winner) || 0) + 1)
          }
        })

        return Array.from(perfectGames.entries())
          .map(([player, count]) => ({
            player,
            perfectGames: count,
            lastPerfectGame: sortedGames.find(g => g.winner === player && g.secondPlaces.length === 0)?.date
          }))
          .sort((a, b) => b.perfectGames - a.perfectGames)
      }

      default:
        return []
    }
  }

  const stats = calculateStreaks()

  const renderTable = () => {
    switch (streakType) {
      case 'longestWinStreak':
      case 'consecutiveGames':
      case 'secondPlaceStreak':
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Longest Streak</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Streaks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Achieved</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.map((stat, index) => (
                <tr key={stat.player} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stat.player}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.longestStreak}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.streakCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(stat.lastStreakDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )

      case 'dominantPeriod':
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wins</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Win Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Games Played</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.map((stat, index) => (
                <tr key={stat.player} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stat.player}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.wins}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.winRate}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.gamesPlayed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )

      case 'perfectGame':
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perfect Games</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Perfect Game</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.map((stat, index) => (
                <tr key={stat.player} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stat.player}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.perfectGames}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stat.lastPerfectGame ? new Date(stat.lastPerfectGame).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )

      default:
        return null
    }
  }

  return (
    <div className="overflow-x-auto">
      <h4 className="text-lg font-semibold mb-4">{title}</h4>
      {renderTable()}
    </div>
  )
}

const StreakCard = ({ title, value, icon, description, player, date, onClick }: StreakCardProps) => (
  <div 
    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-start justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-3xl font-bold text-blue-600 mb-2">{value}</p>
        {player && (
          <p className="text-sm text-gray-600 mb-1">
            Player: <span className="font-medium">{player}</span>
          </p>
        )}
        {date && (
          <p className="text-sm text-gray-600 mb-1">
            Last achieved: <span className="font-medium">{date}</span>
          </p>
        )}
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>
      <div className="text-blue-500">
        {icon}
      </div>
    </div>
  </div>
)

type StreaksProps = {
  games: Game[]
}

export default function Streaks({ games }: StreaksProps) {
  const [selectedStreak, setSelectedStreak] = useState<{
    type: StreakType;
    period?: number;
    title: string;
    description?: string;
  } | null>(null)

  const streakStats = useMemo(() => {
    const sortedGames = [...games].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    // Current Streaks
    const currentStreaks = new Map<string, number>()
    const lastWinner = sortedGames[0]?.winner
    let currentStreak = 0
    
    for (const game of sortedGames) {
      if (game.winner === lastWinner) {
        currentStreak++
      } else {
        break
      }
    }
    if (lastWinner) {
      currentStreaks.set(lastWinner, currentStreak)
    }

    // Longest Win Streak
    const winStreaks = new Map<string, number>()
    let maxWinStreak = { player: '', streak: 0, endDate: '' }
    
    sortedGames.forEach((game, index) => {
      let streak = 1
      let i = index + 1
      while (i < sortedGames.length && sortedGames[i].winner === game.winner) {
        streak++
        i++
      }
      if (streak > (winStreaks.get(game.winner) || 0)) {
        winStreaks.set(game.winner, streak)
        if (streak > maxWinStreak.streak) {
          maxWinStreak = { 
            player: game.winner, 
            streak, 
            endDate: game.date 
          }
        }
      }
    })

    // Most Second Places
    const secondPlaceStreaks = new Map<string, number>()
    let maxSecondStreak = { player: '', streak: 0, endDate: '' }
    
    sortedGames.forEach((game, index) => {
      game.secondPlaces.forEach(player => {
        let streak = 1
        let i = index + 1
        while (i < sortedGames.length && sortedGames[i].secondPlaces.includes(player)) {
          streak++
          i++
        }
        if (streak > (secondPlaceStreaks.get(player) || 0)) {
          secondPlaceStreaks.set(player, streak)
          if (streak > maxSecondStreak.streak) {
            maxSecondStreak = {
              player,
              streak,
              endDate: game.date
            }
          }
        }
      })
    })

    // Most Consecutive Games
    const playedStreaks = new Map<string, number>()
    let maxPlayedStreak = { player: '', streak: 0, endDate: '' }
    
    sortedGames.forEach((game, index) => {
      game.players.forEach(player => {
        let streak = 1
        let i = index + 1
        while (i < sortedGames.length && sortedGames[i].players.includes(player)) {
          streak++
          i++
        }
        if (streak > (playedStreaks.get(player) || 0)) {
          playedStreaks.set(player, streak)
          if (streak > maxPlayedStreak.streak) {
            maxPlayedStreak = {
              player,
              streak,
              endDate: game.date
            }
          }
        }
      })
    })

    // Most Recent Perfect Game (Win with no second places)
    let perfectGame = null
    for (const game of sortedGames) {
      if (game.secondPlaces.length === 0) {
        perfectGame = {
          player: game.winner,
          date: game.date
        }
        break
      }
    }

    // Most Dominant Period (Most wins in last 10, 20, and 30 games)
    const dominantPeriods = [10, 20, 30].map(period => {
      const periodGames = sortedGames.slice(0, period)
      const periodWins = new Map<string, number>()
      periodGames.forEach(game => {
        periodWins.set(game.winner, (periodWins.get(game.winner) || 0) + 1)
      })
      let topPlayer = { player: '', wins: 0 }
      periodWins.forEach((wins, player) => {
        if (wins > topPlayer.wins) {
          topPlayer = { player, wins }
        }
      })
      return { period, ...topPlayer }
    })

    return {
      currentStreak: lastWinner ? { player: lastWinner, streak: currentStreak } : null,
      longestWinStreak: maxWinStreak,
      longestSecondStreak: maxSecondStreak,
      longestPlayedStreak: maxPlayedStreak,
      perfectGame,
      dominantPeriods
    }
  }, [games])

  return (
    <>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Catan Streaks & Records</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Current Win Streak */}
          {streakStats.currentStreak && streakStats.currentStreak.streak > 1 && (
            <StreakCard
              title="Current Win Streak 🔥"
              value={streakStats.currentStreak.streak}
              icon={<Flame size={24} />}
              player={streakStats.currentStreak.player}
              description="Consecutive wins in recent games"
              onClick={() => setSelectedStreak({
                type: 'currentStreak',
                title: "Current Win Streak Details",
                description: "Statistics for the current win streak"
              })}
            />
          )}

          {/* Longest Win Streak */}
          <StreakCard
            title="Longest Win Streak"
            value={streakStats.longestWinStreak.streak}
            icon={<Trophy size={24} />}
            player={streakStats.longestWinStreak.player}
            date={new Date(streakStats.longestWinStreak.endDate).toLocaleDateString()}
            description="Most consecutive wins ever"
            onClick={() => setSelectedStreak({
              type: 'longestWinStreak',
              title: "Longest Win Streak Details",
              description: "Statistics for the longest win streak"
            })}
          />

          {/* Most Consecutive Games */}
          <StreakCard
            title="Most Consecutive Games"
            value={streakStats.longestPlayedStreak.streak}
            icon={<TrendingUp size={24} />}
            player={streakStats.longestPlayedStreak.player}
            date={new Date(streakStats.longestPlayedStreak.endDate).toLocaleDateString()}
            description="Most games played in a row"
            onClick={() => setSelectedStreak({
              type: 'consecutiveGames',
              title: "Most Consecutive Games Details",
              description: "Statistics for the most consecutive games played"
            })}
          />

          {/* Perfect Game */}
          {streakStats.perfectGame && (
            <StreakCard
              title="Perfect Game"
              value="Winner"
              icon={<Star size={24} />}
              player={streakStats.perfectGame.player}
              date={new Date(streakStats.perfectGame.date).toLocaleDateString()}
              description="Won without any second places"
              onClick={() => setSelectedStreak({
                type: 'perfectGame',
                title: "Perfect Game Details",
                description: "Statistics for the perfect game"
              })}
            />
          )}

          {/* Most Second Places */}
          <StreakCard
            title="Second Place Streak"
            value={streakStats.longestSecondStreak.streak}
            icon={<Medal size={24} />}
            player={streakStats.longestSecondStreak.player}
            date={new Date(streakStats.longestSecondStreak.endDate).toLocaleDateString()}
            description="Most consecutive second place finishes"
            onClick={() => setSelectedStreak({
              type: 'secondPlaceStreak',
              title: "Second Place Streak Details",
              description: "Statistics for the second place streak"
            })}
          />

          {/* Dominant Periods */}
          {streakStats.dominantPeriods.map(({ period, player, wins }) => (
            <StreakCard
              key={`dominant-${period}`}
              title={`Most Wins (Last ${period} Games)`}
              value={wins}
              icon={<Crown size={24} />}
              player={player}
              description={`Most victories in the last ${period} games played`}
              onClick={() => setSelectedStreak({
                type: 'dominantPeriod',
                period,
                title: `Last ${period} Games Details`,
                description: `Statistics for the last ${period} games played`
              })}
            />
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={selectedStreak !== null}
        onClose={() => setSelectedStreak(null)}
        title={selectedStreak?.title || ""}
      >
        {selectedStreak && (
          <StreakDetail
            games={games}
            streakType={selectedStreak.type}
            period={selectedStreak.period}
            title={selectedStreak.description || ''}
          />
        )}
      </LightboxModal>
    </>
  )
}
