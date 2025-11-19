# Flying Taxi Bengaluru

A web-based application that enables residents of Bengaluru to book autonomous flying taxis for point-to-point travel, reducing ground traffic congestion in the city.

## Features

- 🗺️ Interactive map interface using Leaflet.js
- 📍 Click-to-select pickup and destination locations
- ✈️ Three-tier taxi selection (Economy, Premium, Luxury)
- 📏 Automatic distance calculation
- 💰 Transparent, distance-based pricing
- ✅ Simple booking confirmation flow

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Tech Stack

- **Framework**: Next.js 15
- **Maps**: Leaflet.js with react-leaflet
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Lucide React

## Project Structure

```
├── app/
│   ├── booking/          # Booking confirmation page
│   ├── page.tsx         # Main booking interface
│   └── layout.tsx        # Root layout
├── components/
│   ├── FlyingTaxiMap.tsx   # Interactive map component
│   ├── TierSelector.tsx     # Taxi tier selection
│   └── ui/                  # Reusable UI components
└── lib/
    ├── distance.ts      # Distance calculation utilities
    └── pricing.ts       # Pricing and tier definitions
```

## Pricing Tiers

- **Economy**: ₹500 per km
- **Premium**: ₹750 per km  
- **Luxury**: ₹1000 per km

Minimum fare: ₹200

## Service Area

Currently available only within Bengaluru city limits.

## License

Private project
