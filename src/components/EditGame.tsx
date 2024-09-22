import { useState } from 'react'
import { Player, Game } from '@/lib/types'

interface EditGameProps {
  game: Game
  editGame: (id: string, updatedGame: Partial<Omit<Game, 'id'>>) => Promise<void>
  onClose: () => void
}

export default function EditGame({ game, editGame, onClose }: EditGameProps) {
  const [players, setPlayers] = useState<Player[]>(game.players)
  const [winner, setWinner] = useState<Player>(game.winner)
  const [secondPlaces, setSecondPlaces] = useState<Player[]>(game.secondPlaces)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const allPlayers: Player[] = ['Antoine', 'Don Jon', 'Chadi', 'Jeff', 'Roudy', 'Roy', 'Mike', 'Mario', 'Nick']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (players.length >= 3 && players.length <= 6 && winner && secondPlaces.length > 0) {
      setIsSubmitting(true)
      setSubmitMessage('')
      try {
        await editGame(game.id, {
          players,
          winner,
          secondPlaces,
        })
        setSubmitMessage('Game updated successfully!')
        setTimeout(onClose, 2000)
      } catch (error) {
        setSubmitMessage('Error updating game. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Edit Game</h2>
      <div className="grid grid-cols-3 gap-4">
        {allPlayers.map((player) => (
          <button
            key={player}
            type="button"
            onClick={() => setPlayers(prev => 
              prev.includes(player) ? prev.filter(p => p !== player) : [...prev, player]
            )}
            className={`p-2 rounded-md transition-colors ${
              players.includes(player)
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {player}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Winner</label>
          <select
            value={winner}
            onChange={(e) => setWinner(e.target.value as Player)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {players.map((player) => (
              <option key={player} value={player}>{player}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Second Places</label>
          <div className="grid grid-cols-3 gap-2">
            {players.filter(player => player !== winner).map((player) => (
              <button
                key={player}
                type="button"
                onClick={() => setSecondPlaces(prev => 
                  prev.includes(player) ? prev.filter(p => p !== player) : [...prev, player]
                )}
                className={`p-2 rounded-md transition-colors ${
                  secondPlaces.includes(player)
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {player}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Updating...' : 'Update Game'}
        </button>
      </div>
      {submitMessage && (
        <p className={`text-center ${submitMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {submitMessage}
        </p>
      )}
    </form>
  )
}