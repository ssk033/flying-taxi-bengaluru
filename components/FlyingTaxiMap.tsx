"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { useMapEvents } from "react-leaflet"

// Dynamically import the map to avoid SSR issues with Leaflet
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
)
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
)

interface FlyingTaxiMapProps {
  pickupLocation: [number, number] | null
  destination: [number, number] | null
  onLocationSelect: (type: "pickup" | "destination", lat: number, lng: number) => void
}

// Component to handle map click events
function MapClickHandler({ 
  pickupLocation, 
  destination, 
  onLocationSelect 
}: { 
  pickupLocation: [number, number] | null
  destination: [number, number] | null
  onLocationSelect: (type: "pickup" | "destination", lat: number, lng: number) => void
}) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng
      
      // Determine which location to set based on current state
      if (!pickupLocation) {
        onLocationSelect("pickup", lat, lng)
      } else if (!destination) {
        onLocationSelect("destination", lat, lng)
      } else {
        // If both are set, clicking resets and sets pickup
        onLocationSelect("pickup", lat, lng)
      }
    },
  })
  
  return null
}

export default function FlyingTaxiMap({ pickupLocation, destination, onLocationSelect }: FlyingTaxiMapProps) {
  const [isClient, setIsClient] = useState(false)
  const [L, setL] = useState<any>(null)
  
  useEffect(() => {
    setIsClient(true)
    import("leaflet").then((leaflet) => {
      const LModule = leaflet.default
      setL(LModule)
      
      // Fix for default marker icons in Next.js
      delete (LModule.Icon.Default.prototype as any)._getIconUrl
      LModule.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      })
    })
    
    import("leaflet/dist/leaflet.css")
  }, [])
  
  // Bengaluru center coordinates
  const bengaluruCenter: [number, number] = [12.9716, 77.5946]

  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-800">
        <p className="text-slate-400">Loading map...</p>
      </div>
    )
  }

  const createIcon = (color: string) => {
    if (!L) return undefined
    return new L.Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    })
  }

  // Calculate center for map view when both locations are set
  const mapCenter = pickupLocation && destination
    ? [(pickupLocation[0] + destination[0]) / 2, (pickupLocation[1] + destination[1]) / 2] as [number, number]
    : bengaluruCenter

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={mapCenter}
        zoom={pickupLocation && destination ? 13 : 12}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        key={`${pickupLocation?.[0]}-${destination?.[0]}`} // Force re-render when locations change
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler
          pickupLocation={pickupLocation}
          destination={destination}
          onLocationSelect={onLocationSelect}
        />
        
        {pickupLocation && destination && (
          <Polyline
            positions={[pickupLocation, destination]}
            pathOptions={{ color: "#3b82f6", weight: 3, dashArray: "10, 10" }}
          />
        )}
        
        {pickupLocation && (
          <Marker position={pickupLocation} icon={createIcon("red")}>
            <Popup>Pickup Location</Popup>
          </Marker>
        )}
        
        {destination && (
          <Marker position={destination} icon={createIcon("green")}>
            <Popup>Destination</Popup>
          </Marker>
        )}
      </MapContainer>
      
      <div className="absolute top-4 left-4 bg-white dark:bg-slate-900 p-3 rounded-lg shadow-lg z-[1000] border border-slate-200 dark:border-slate-700">
        <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Instructions:</p>
        <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
          <li>• Click on map to set pickup location</li>
          <li>• Click again to set destination</li>
          <li>• Click on map again to reset and start over</li>
        </ul>
      </div>
    </div>
  )
}
