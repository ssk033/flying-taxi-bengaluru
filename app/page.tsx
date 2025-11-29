"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import FlyingTaxiMap from "@/components/FlyingTaxiMap"
import TierSelector from "@/components/TierSelector"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { calculateDistance, isWithinBengaluru } from "@/lib/distance"
import { calculateFare, getTierById } from "@/lib/pricing"
import { MapPin, Navigation, Route, IndianRupee, Plane } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [pickupLocation, setPickupLocation] = useState<[number, number] | null>(null)
  const [destination, setDestination] = useState<[number, number] | null>(null)
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const [pickupAddress, setPickupAddress] = useState<string>("")
  const [destinationAddress, setDestinationAddress] = useState<string>("")

  const handleLocationSelect = (type: "pickup" | "destination", lat: number, lng: number) => {
    // Validate location is within Bengaluru
    if (!isWithinBengaluru(lat, lng)) {
      alert("Please select a location within Bengaluru city limits.")
      return
    }

    if (type === "pickup") {
      setPickupLocation([lat, lng])
      setDestination(null)
      setDestinationAddress("")
      setSelectedTier(null)
      // Reverse geocode to get address (simplified - in production, use a geocoding service)
      setPickupAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`)
    } else {
      setDestination([lat, lng])
      // Reverse geocode to get address (simplified - in production, use a geocoding service)
      setDestinationAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`)
    }
  }

  const distance = pickupLocation && destination
    ? calculateDistance(pickupLocation[0], pickupLocation[1], destination[0], destination[1])
    : null

  const fare = distance && selectedTier ? calculateFare(distance, selectedTier) : 0

  const handleBooking = () => {
    if (!pickupLocation || !destination || !selectedTier) {
      alert("Please select pickup location, destination, and taxi tier before booking.")
      return
    }

    const bookingId = `BK-${Date.now()}`
    const params = new URLSearchParams({
      bookingId,
      pickup: pickupAddress || `${pickupLocation[0]}, ${pickupLocation[1]}`,
      destination: destinationAddress || `${destination[0]}, ${destination[1]}`,
      tier: selectedTier,
      distance: distance?.toString() || "0",
      fare: fare.toString(),
    })

    router.push(`/booking?${params.toString()}`)
  }

  const handleReset = () => {
    setPickupLocation(null)
    setDestination(null)
    setSelectedTier(null)
    setPickupAddress("")
    setDestinationAddress("")
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <nav className="bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Flying Taxi Bengaluru</h1>
              <p className="text-xs text-slate-400">Book your autonomous flying taxi</p>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-900 border-slate-800 h-[600px]">
              <CardContent className="p-0 h-full">
                <FlyingTaxiMap
                  pickupLocation={pickupLocation}
                  destination={destination}
                  onLocationSelect={handleLocationSelect}
                />
              </CardContent>
            </Card>
          </div>

          {/* Booking Panel */}
          <div className="space-y-6">
            {/* Location Summary */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white text-lg">Trip Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-start gap-3 mb-2">
                    <div className="p-2 bg-red-500 rounded-lg">
                      <MapPin className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-400 text-xs mb-1">Pickup Location</p>
                      <p className="text-white text-sm font-medium">
                        {pickupAddress || (pickupLocation ? `${pickupLocation[0].toFixed(4)}, ${pickupLocation[1].toFixed(4)}` : "Not selected")}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-start gap-3 mb-2">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <Navigation className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-400 text-xs mb-1">Destination</p>
                      <p className="text-white text-sm font-medium">
                        {destinationAddress || (destination ? `${destination[0].toFixed(4)}, ${destination[1].toFixed(4)}` : "Not selected")}
                      </p>
                    </div>
                  </div>
                </div>

                {distance !== null && (
                  <div className="bg-slate-800 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Route className="h-4 w-4 text-blue-400" />
                      <div className="flex-1">
                        <p className="text-slate-400 text-xs">Distance</p>
                        <p className="text-white font-semibold">{distance} km</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tier Selection */}
            {pickupLocation && destination && (
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                  <TierSelector
                    selectedTier={selectedTier}
                    onTierSelect={setSelectedTier}
                    distance={distance}
                  />
                </CardContent>
              </Card>
            )}

            {/* Fare Summary */}
            {selectedTier && distance && (
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Fare Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Distance</span>
                    <span className="text-white font-medium">{distance} km</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Tier</span>
                    <span className="text-white font-medium capitalize">{selectedTier}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Rate per km</span>
                    <span className="text-white font-medium">
                      ₹{getTierById(selectedTier)?.pricePerKm || 0}
                    </span>
                  </div>
                  <div className="border-t border-slate-700 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">Total Fare</span>
                      <span className="text-blue-500 text-xl font-bold flex items-center gap-1">
                        <IndianRupee className="h-5 w-5" />
                        {fare.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleBooking}
                disabled={!pickupLocation || !destination || !selectedTier}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg"
              >
                Book Flying Taxi
              </Button>
              
              {(pickupLocation || destination) && (
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Reset Selection
                </Button>
              )}
            </div>

            {/* Info Card */}
            <Card className="bg-blue-900/20 border-blue-700">
              <CardContent className="p-4">
                <p className="text-blue-200 text-sm">
                  <strong>Note:</strong> This service is available only within Bengaluru city limits nowhere else. 
                  Your autonomous flying taxi will arrive at your pickup location shortly after booking.Thanks.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
