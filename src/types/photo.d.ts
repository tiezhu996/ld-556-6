export interface Photo {
  id: string
  uploaderId: string
  memberId: string
  imageUrl: string
  caption: string
  year: number
  location: string
  people: string[]
  isRestored: boolean
  restoredUrl: string
}
