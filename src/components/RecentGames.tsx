import { useState } from 'react'
import { Game } from '@/lib/types'
import EditGame from './EditGame'

interface RecentGamesProps {
  games: Game[]
  editGame: (id: string, updatedGame: Partial<Omit<Game, 'id'>>) => Promise<void>
  removeGame: (id: string) => Promise<void>
}

export default function RecentGames({ games, editGame, removeGame }: RecentGamesProps) {
  const [editingGame, setEditingGame] = useState<Game | null>(null)

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Recent Games</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Winner</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Second Place</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Players</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {games.slice(0, 20).map((game) => (
              <tr key={game.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(game.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                  {game.winner}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                  {game.secondPlaces.join(', ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {game.players.join(', ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setEditingGame(game)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this game?')) {
                        removeGame(game.id)
                      }
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editingGame && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <EditGame
              game={editingGame}
              editGame={editGame}
              onClose={() => setEditingGame(null)}
            />
          </div>
        </div>
      )}
    </div>
  )
}