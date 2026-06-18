import type { StoryCategory } from '@/constants/enums'

export interface Story {
  id: string
  authorId: string
  memberId: string
  title: string
  content: string
  mediaUrls: string[]
  category: StoryCategory
  date: string
  isPublic: boolean
}
