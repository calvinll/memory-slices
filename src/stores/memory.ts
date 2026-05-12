import { defineStore } from 'pinia'
import type { MemoryCard, Mood } from '@/types/memory'

const STORAGE_KEY = 'memory_slices_cards'

export const useMemoryStore = defineStore('memory', {
  state: () => ({
    cards: [] as MemoryCard[],
    loaded: false,
  }),
  actions: {
    load() {
      if (this.loaded) return
      const cards = uni.getStorageSync(STORAGE_KEY) as MemoryCard[] | undefined
      this.cards = Array.isArray(cards) ? cards : []
      this.loaded = true
    },
    persist() {
      uni.setStorageSync(STORAGE_KEY, this.cards)
    },
    addCard(payload: { imagePath?: string; text: string; mood: Mood }) {
      const card: MemoryCard = {
        id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
        createdAt: Date.now(),
        imagePath: payload.imagePath,
        text: payload.text,
        mood: payload.mood,
      }
      this.cards.unshift(card)
      this.persist()
      return card
    },
  },
})
