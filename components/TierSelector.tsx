"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TAXI_TIERS, type TaxiTier } from "@/lib/pricing"
import { Users, Zap } from "lucide-react"

interface TierSelectorProps {
  selectedTier: string | null
  onTierSelect: (tierId: string) => void
  distance: number | null
}

export default function TierSelector({ selectedTier, onTierSelect, distance }: TierSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Select Taxi Tier</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TAXI_TIERS.map((tier) => {
          const isSelected = selectedTier === tier.id
          const estimatedFare = distance ? (distance * tier.pricePerKm) : 0
          
          return (
            <Card
              key={tier.id}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "bg-blue-600 border-blue-500 shadow-lg scale-105"
                  : "bg-slate-900 border-slate-800 hover:border-blue-500 hover:bg-slate-850"
              }`}
              onClick={() => onTierSelect(tier.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`text-lg font-bold ${isSelected ? "text-white" : "text-white"}`}>
                    {tier.name}
                  </h4>
                  {isSelected && (
                    <Badge className="bg-white text-blue-600">Selected</Badge>
                  )}
                </div>
                
                <p className={`text-sm mb-4 ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                  {tier.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className={`h-4 w-4 ${isSelected ? "text-blue-200" : "text-slate-500"}`} />
                    <span className={`text-sm ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                      Capacity: {tier.capacity} passengers
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className={`h-4 w-4 ${isSelected ? "text-blue-200" : "text-slate-500"}`} />
                    <span className={`text-sm ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                      Speed: {tier.speed}
                    </span>
                  </div>
                </div>
                
                <div className="border-t border-slate-700 pt-3">
                  <div className="flex items-baseline justify-between">
                    <span className={`text-xs ${isSelected ? "text-blue-200" : "text-slate-500"}`}>
                      Price per km
                    </span>
                    <span className={`text-lg font-bold ${isSelected ? "text-white" : "text-white"}`}>
                      ₹{tier.pricePerKm}
                    </span>
                  </div>
                  {distance && distance > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-700">
                      <div className="flex items-baseline justify-between">
                        <span className={`text-xs ${isSelected ? "text-blue-200" : "text-slate-500"}`}>
                          Est. Fare
                        </span>
                        <span className={`text-xl font-bold ${isSelected ? "text-white" : "text-blue-500"}`}>
                          ₹{Math.max(estimatedFare, 200).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

