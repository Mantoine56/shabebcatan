import { useEffect, useReducer } from 'react'
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { gameReducer, initialState } from '@/lib/gameReducer'
import { Game } from '@/lib/types'

export default function useGames() {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  useEffect(() => {
    const gamesQuery = query(collection(db, 'games'), orderBy('date', 'desc'))
    const unsubscribe = onSnapshot(gamesQuery, (snapshot) => {
      const games = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Game))
      dispatch({ type: 'SET_GAMES', payload: games })
    })

    return () => unsubscribe()
  }, [])

  const addGame = async (game: Omit<Game, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'games'), game)
      console.log('Game added with ID: ', docRef.id)
    } catch (error) {
      console.error('Error adding game: ', error)
      throw error
    }
  }

  const editGame = async (id: string, updatedGame: Partial<Omit<Game, 'id'>>) => {
    try {
      await updateDoc(doc(db, 'games', id), updatedGame)
      console.log('Game updated with ID: ', id)
      // Dispatch EDIT_GAME action
      dispatch({ type: 'EDIT_GAME', payload: { id, ...updatedGame } as Game })
    } catch (error) {
      console.error('Error updating game: ', error)
      throw error
    }
  }

  const removeGame = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'games', id))
      console.log('Game removed with ID: ', id)
    } catch (error) {
      console.error('Error removing game: ', error)
      throw error
    }
  }

  return { state, addGame, editGame, removeGame }
}