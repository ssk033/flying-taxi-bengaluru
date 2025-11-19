"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, MapPin, Navigation, Calendar, IndianRupee } from "lucide-react"

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const bookingId = searchParams.get("bookingId") || `BK-${Date.now()}`
  const pickup = searchParams.get("pickup") || "Not specified"
  const destination = searchParams.get("destination") || "Not specified"
  const tier = searchParams.get("tier") || "Not specified"
  const distance = searchParams.get("distance") || "0"
  const fare = searchParams.get("fare") || "0"
  
  const handleNewBooking = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-900 border-slate-800 shadow-xl">
        <CardHeader className="text-center border-b border-slate-800 pb-6">
          <div className="mx-auto mb-4 p-4 bg-green-600 rounded-full w-20 h-20 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Booking Confirmed!</CardTitle>
          <p className="text-slate-400 mt-2">Your flying taxi has been booked successfully</p>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Booking ID */}
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Booking ID</span>
              <span className="text-white font-mono font-semibold">{bookingId}</span>
            </div>
          </div>
          
          {/* Booking Details */}
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-slate-800 rounded-lg">
              <div className="p-2 bg-red-500 rounded-lg">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-slate-400 text-sm mb-1">Pickup Location</p>
                <p className="text-white font-medium">{pickup}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-slate-800 rounded-lg">
              <div className="p-2 bg-green-500 rounded-lg">
                <Navigation className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-slate-400 text-sm mb-1">Destination</p>
                <p className="text-white font-medium">{destination}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-800 rounded-lg">
                <p className="text-slate-400 text-sm mb-1">Taxi Tier</p>
                <p className="text-white font-semibold capitalize">{tier}</p>
              </div>
              
              <div className="p-4 bg-slate-800 rounded-lg">
                <p className="text-slate-400 text-sm mb-1">Distance</p>
                <p className="text-white font-semibold">{distance} km</p>
              </div>
            </div>
            
            <div className="p-4 bg-blue-600 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-white" />
                  <span className="text-blue-100 text-sm">Total Fare</span>
                </div>
                <span className="text-white text-2xl font-bold">₹{parseFloat(fare).toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          {/* Estimated Arrival */}
          <div className="bg-slate-800 rounded-lg p-4 border border-blue-500">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-slate-400 text-sm">Estimated Arrival</p>
                <p className="text-white font-medium">Your flying taxi will arrive shortly</p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleNewBooking}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Book Another Ride
            </Button>
          </div>
          
          {/* Note */}
          <div className="bg-amber-900/20 border border-amber-700 rounded-lg p-4">
            <p className="text-amber-200 text-sm">
              <strong>Note:</strong> Please be ready at your pickup location. Your autonomous flying taxi will arrive shortly. 
              Payment can be made upon arrival.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

