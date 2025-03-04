export type DestinationData = {
  id: number
  name: string
  position: [number, number, number]
  color: string
  radius: number
  texture: {
    color: string
    bump?: string
  }
  emission: number
  description: string
}
