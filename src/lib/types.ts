export type Player = 'Antoine' | 'Don Jon' | 'Chadi' | 'Jeff' | 'Roudy' | 'Roy' | 'Mike' | 'Mario' | 'Nick'

export interface Game {
  id: string
  date: string
  players: Player[]
  winner: Player
  secondPlaces: Player[]
}

export interface PlayerStats {
  wins: number
  secondPlace: number
  participations: number
}

export interface Stats {
  [key: string]: PlayerStats
}

export interface State {
  games: Game[]
  stats: Stats
}

export type Action =
  | { type: 'SET_GAMES'; payload: Game[] }
  | { type: 'ADD_GAME'; payload: Game }
  | { type: 'EDIT_GAME'; payload: Game }
  | { type: 'REMOVE_GAME'; payload: string }

// Add this helper function
export function normalizePlayerName(name: string): Player {
  const normalized = name.trim().toLowerCase()
  switch (normalized) {
    case 'antoine': return 'Antoine'
    case 'don jon': return 'Don Jon'
    case 'chadi': return 'Chadi'
    case 'jeff': return 'Jeff'
    case 'roudy': return 'Roudy'
    case 'roy': return 'Roy'
    case 'mike': return 'Mike'
    case 'mario': return 'Mario'
    case 'nick': return 'Nick'
    default: throw new Error(`Invalid player name: ${name}`)
  }
}