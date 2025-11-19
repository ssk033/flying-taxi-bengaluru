export interface TaxiTier {
  id: string
  name: string
  description: string
  pricePerKm: number
  capacity: number
  speed: string
}

export const TAXI_TIERS: TaxiTier[] = [
  {
    id: "economy",
    name: "Economy",
    description: "Basic service, standard speed",
    pricePerKm: 500,
    capacity: 2,
    speed: "Standard"
  },
  {
    id: "premium",
    name: "Premium",
    description: "Enhanced comfort, faster service",
    pricePerKm: 750,
    capacity: 3,
    speed: "Fast"
  },
  {
    id: "luxury",
    name: "Luxury",
    description: "Premium experience, highest speed",
    pricePerKm: 1000,
    capacity: 4,
    speed: "Fastest"
  }
]

/**
 * Calculate total fare based on distance and selected tier
 * @param distance Distance in kilometers
 * @param tierId Selected tier ID
 * @returns Total fare in rupees
 */
export function calculateFare(distance: number, tierId: string): number {
  const tier = TAXI_TIERS.find(t => t.id === tierId)
  if (!tier) return 0
  
  const totalFare = distance * tier.pricePerKm
  // Apply minimum fare of ₹200 for very short distances
  return Math.max(totalFare, 200)
}

/**
 * Get tier by ID
 */
export function getTierById(tierId: string): TaxiTier | undefined {
  return TAXI_TIERS.find(t => t.id === tierId)
}

