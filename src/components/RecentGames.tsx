import { useState } from 'react'
import { Game } from '@/lib/types'
import PaginationControls from './PaginationControls'

type RecentGamesProps = {
  games: Game[]
  deleteGame: (gameId: string) => Promise<void>
}

export default function RecentGames({ games, deleteGame }: RecentGamesProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const handleDelete = async (gameId: string) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      await deleteGame(gameId)
    }
  }

  const totalPages = Math.ceil(games.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentGames = games.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1) // Reset to first page when changing page size
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Games</h3>
        <p className="mt-1 text-sm text-gray-500">
          Showing {startIndex + 1}-{Math.min(endIndex, games.length)} of {games.length} games
        </p>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {currentGames.map((game) => (
            <li key={game.id} className="px-4 py-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-gray-900">
                    Winner: {game.winner}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(game.date).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(game.id)}
                  className="text-red-600 hover:text-red-900 text-sm self-start sm:self-center"
                >
                  Delete
                </button>
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Players:</span> {game.players.join(', ')}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Second Places:</span> {game.secondPlaces.join(', ')}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {games.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  )
}