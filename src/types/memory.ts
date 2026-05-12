export type Mood = 'happy' | 'sad' | 'calm'

export interface MemoryCard {
  id: string
  createdAt: number
  imagePath?: string
  text: string
  mood: Mood
}
