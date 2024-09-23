import { State, Action, Game, Stats, Player } from './types'

export const initialState: State = {
  games: [],
  stats: {},
}

function calculateStats(games: Game[]): Stats {
  const stats: Stats = {}

  games.forEach(game => {
    game.players.forEach(player => {
      if (!stats[player]) {
        stats[player] = { totalGames: 0, totalWins: 0, totalSecondPlace: 0 }
      }
      stats[player].totalGames++
      if (player === game.winner) {
        stats[player].totalWins++
      }
      if (game.secondPlaces.includes(player)) {
        stats[player].totalSecondPlace++
      }
    })
  })

  return stats
}

export function gameReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_GAMES':
      return {
        ...state,
        games: action.payload,
        stats: calculateStats(action.payload),
      }
    case 'ADD_GAME':
      const newGames = [...state.games, action.payload]
      return {
        ...state,
        games: newGames,
        stats: calculateStats(newGames),
      }
    case 'EDIT_GAME':
      const editedGames = state.games.map(game => 
        game.id === action.payload.id ? action.payload : game
      )
      return {
        ...state,
        games: editedGames,
        stats: calculateStats(editedGames),
      }
    case 'REMOVE_GAME':
      const filteredGames = state.games.filter(game => game.id !== action.payload)
      return {
        ...state,
        games: filteredGames,
        stats: calculateStats(filteredGames),
      }
    default:
      return state
  }
}