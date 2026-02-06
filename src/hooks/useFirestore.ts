import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, where, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { useAuthStore } from '@/store/authStore'
import type { Favorite } from '@/types'

export const useFirestore = () => {
    const user = useAuthStore(state => state.user)
    const [favorites, setFavorites] = useState<number[]>([])

    useEffect(() => {
        if (!user?.id) return

        const favQuery = query(collection(db, 'favorites'), where('userId', '==', user.id))
        const unsubscribeFavs = onSnapshot(favQuery, (snapshot) => {
            const favIds = snapshot.docs.map(doc => doc.data().productId as number)
            setFavorites(favIds)
        })

        return () => {
            unsubscribeFavs()
        }
    }, [user?.id])

    const toggleFavorite = async (productId: number) => {
        if (!user?.id) return

        const docId = `${user.id}_${productId}`
        const docRef = doc(db, 'favorites', docId)

        if (favorites.includes(productId)) {
            await deleteDoc(docRef)
        } else {
            const favorite: Favorite = {
                userId: user.id,
                productId,
                createdAt: Date.now()
            }
            await setDoc(docRef, favorite)
        }
    }

    return { favorites, toggleFavorite }
}
