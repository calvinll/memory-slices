export type Mood = 'happy' | 'sad' | 'calm' | 'melancholy' | 'angry'

export interface MemoryCard {
  id: string
  createdAt: number
  imagePath?: string
  text: string
  mood: Mood
}
