import { Game } from '@/lib/types'

type RecentGamesProps = {
  games: Game[]
  deleteGame: (gameId: string) => Promise<void>
}

export default function RecentGames({ games, deleteGame }: RecentGamesProps) {
  const handleDelete = async (gameId: string) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      await deleteGame(gameId)
    }
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Games</h3>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {games.map((game) => (
            <li key={game.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  Winner: {game.winner} | Date: {new Date(game.date).toLocaleDateString()}
                </p>
                <div>
                  <button
                    onClick={() => handleDelete(game.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Players: {game.players.join(', ')}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Second Places: {game.secondPlaces.join(', ')}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}