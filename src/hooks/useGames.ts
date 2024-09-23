import { useEffect, useState } from 'react'
import { doc, getDoc, updateDoc, collection, addDoc, query, orderBy, limit, getDocs, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Stats, Player, Game } from '@/lib/types'

export default function useGames() {
  const [stats, setStats] = useState<Stats>({})
  const [recentGames, setRecentGames] = useState<Game[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      const docRef = doc(db, 'stats', 'aggregate')
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setStats(docSnap.data().players)
      }
    }

    const fetchRecentGames = async () => {
      const gamesRef = collection(db, 'games')
      const q = query(gamesRef, orderBy('date', 'desc'), limit(20))
      const querySnapshot = await getDocs(q)
      const games = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Game))
      setRecentGames(games)
    }

    fetchStats()
    fetchRecentGames()
  }, [])

  const updateStats = async (currentStats: Stats, game: Game, isAdding: boolean) => {
    game.players.forEach(player => {
      if (!currentStats[player]) {
        currentStats[player] = { totalGames: 0, totalWins: 0, totalSecondPlace: 0 }
      }
      currentStats[player].totalGames += isAdding ? 1 : -1
      if (player === game.winner) currentStats[player].totalWins += isAdding ? 1 : -1
      if (game.secondPlaces.includes(player)) currentStats[player].totalSecondPlace += isAdding ? 1 : -1
    })
    return currentStats
  }

  const addGame = async (winner: Player, secondPlaces: Player[], players: Player[]) => {
    const docRef = doc(db, 'stats', 'aggregate')
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      let currentStats = docSnap.data().players as Stats
      const newGame: Omit<Game, 'id'> = {
        date: new Date().toISOString(),
        players,
        winner,
        secondPlaces
      }
      currentStats = await updateStats(currentStats, newGame as Game, true)
      await updateDoc(docRef, { players: currentStats })
      setStats(currentStats)

      // Add the game to the 'games' collection
      const gameDocRef = await addDoc(collection(db, 'games'), newGame)
      setRecentGames(prevGames => [{id: gameDocRef.id, ...newGame}, ...prevGames.slice(0, 19)])
    }
  }

  const deleteGame = async (gameId: string) => {
    const gameRef = doc(db, 'games', gameId)
    const gameSnap = await getDoc(gameRef)
    if (gameSnap.exists()) {
      const game = { id: gameId, ...gameSnap.data() } as Game
      const docRef = doc(db, 'stats', 'aggregate')
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        let currentStats = docSnap.data().players as Stats
        currentStats = await updateStats(currentStats, game, false)
        await updateDoc(docRef, { players: currentStats })
        setStats(currentStats)
      }
      await deleteDoc(gameRef)
      setRecentGames(prevGames => prevGames.filter(game => game.id !== gameId))
    }
  }

  return { stats, recentGames, addGame, deleteGame }
}