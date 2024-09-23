import { useState } from 'react'
import { Player } from '@/lib/types'

type NewGameProps = {
  addGame: (winner: Player, secondPlaces: Player[], players: Player[]) => Promise<void>
}

export default function NewGame({ addGame }: NewGameProps) {
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([])
  const [winner, setWinner] = useState<Player | null>(null)
  const [secondPlaces, setSecondPlaces] = useState<Player[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const allPlayers: Player[] = ['Antoine', 'Don Jon', 'Chadi', 'Jeff', 'Roudy', 'Roy', 'Mike', 'Mario', 'Nick']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedPlayers.length >= 3 && selectedPlayers.length <= 6 && winner) {
      setIsSubmitting(true)
      setSubmitMessage('')
      try {
        await addGame(winner, secondPlaces, selectedPlayers)
        setSubmitMessage('Game added successfully!')
        setSelectedPlayers([])
        setWinner(null)
        setSecondPlaces([])
      } catch (error) {
        setSubmitMessage('Error adding game. Please try again.')
        console.error('Error adding game:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Add New Game</h2>
        <div className="grid grid-cols-3 gap-4">
          {allPlayers.map((player) => (
            <button
              key={player}
              type="button"
              onClick={() => setSelectedPlayers(prev => 
                prev.includes(player) ? prev.filter(p => p !== player) : [...prev, player]
              )}
              className={`p-2 rounded-md transition-colors ${
                selectedPlayers.includes(player)
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {player}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Winner</label>
          <select
            value={winner || ''}
            onChange={(e) => setWinner(e.target.value as Player)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Select winner</option>
            {selectedPlayers.map((player) => (
              <option key={player} value={player}>{player}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Second Places</label>
          <div className="grid grid-cols-3 gap-2">
            {selectedPlayers.filter(player => player !== winner).map((player) => (
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
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Adding Game...' : 'Add Game'}
      </button>
      {submitMessage && (
        <p className={`text-center ${submitMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {submitMessage}
        </p>
      )}
    </form>
  )
}