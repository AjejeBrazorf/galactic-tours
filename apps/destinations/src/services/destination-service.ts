import type { Destination } from '@galactic-tours/messaging'

import mockData from '../data/destinations.json'

export interface DestinationService {
  getDestinations(): Promise<Destination[]>
  getDestinationById(id: string): Promise<Destination>
  searchDestinations(query: string): Promise<Destination[]>
}

export class MockDestinationService implements DestinationService {
  private destinations: Destination[]

  constructor() {
    this.destinations = mockData.map((item) => ({
      ...item,
      id: String(item.id),
      position: item.position as [number, number, number],
    }))
  }

  async getDestinations(): Promise<Destination[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [...this.destinations]
  }

  async getDestinationById(id: string): Promise<Destination> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const destination = this.destinations.find((d) => d.id === id)
    if (!destination) {
      throw new Error(`Destination with ID ${id} not found`)
    }

    return { ...destination }
  }

  async searchDestinations(query: string): Promise<Destination[]> {
    await new Promise((resolve) => setTimeout(resolve, 400))

    const lowercaseQuery = query.toLowerCase()
    return this.destinations.filter(
      (d) =>
        d.name.toLowerCase().includes(lowercaseQuery) ||
        d.description?.toLowerCase().includes(lowercaseQuery) ||
        (d.tags || []).some(
          (tag: string) =>
            typeof tag === 'string' &&
            tag.toLowerCase().includes(lowercaseQuery)
        )
    )
  }
}

export const destinationService = new MockDestinationService()
