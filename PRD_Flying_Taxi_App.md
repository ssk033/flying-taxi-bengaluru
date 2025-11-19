# Product Requirements Document: Flying Taxi Web App

## 1. Overview

### 1.1 Product Vision
A web-based application that enables residents of Bengaluru to book autonomous flying taxis for point-to-point travel, reducing ground traffic congestion in the city.

### 1.2 Product Description
The Flying Taxi Web App is an MVP that allows users to select a pickup location and destination on an interactive map, choose from different service tiers, and book a flying taxi. The app calculates pricing based on distance and facilitates seamless booking of autonomous aerial transportation.

## 2. Problem Statement

Bengaluru faces severe traffic congestion, leading to:
- Increased travel times
- Environmental pollution
- Reduced productivity
- Poor quality of life for commuters

By introducing flying taxi services, we aim to:
- Reduce ground-level traffic congestion
- Provide faster point-to-point transportation
- Offer an alternative mode of urban mobility

## 3. Target Users

### Primary Users
- Urban commuters in Bengaluru seeking faster transportation
- Professionals needing to travel across the city for work
- Residents looking for convenient travel options

## 4. Goals & Objectives

### Primary Goals
1. Enable users to book flying taxis through a simple web interface
2. Provide transparent, distance-based pricing
3. Offer multiple service tiers to cater to different user needs
4. Reduce traffic congestion in Bengaluru

### Success Metrics (MVP)
- Number of successful bookings
- User registration and active usage
- Average booking completion rate
- User satisfaction with booking process

## 5. Core Features (MVP)

### 5.1 Map Interface
- **Interactive Map**: Powered by Leaflet.js showing Bengaluru city map
- **Location Selection**: 
  - Users can select pickup location (start point)
  - Users can select destination
  - Both locations must be within Bengaluru city limits
- **Route Visualization**: Display straight-line or optimized aerial route between pickup and destination

### 5.2 Taxi Tier Selection
- **Multiple Tiers**: Users can choose from different flying taxi tiers
- **Tier Information**: Each tier displays:
  - Tier name/level
  - Basic description
  - Capacity (number of passengers)
- **Tier Options** (Example):
  - Economy: Basic service, standard speed
  - Premium: Enhanced comfort, faster service
  - Luxury: Premium experience, highest speed

### 5.3 Distance Calculation
- **Automatic Calculation**: System calculates straight-line distance between pickup and destination
- **Display**: Show calculated distance to user
- **Unit**: Display in kilometers (km)

### 5.4 Pricing
- **Distance-Based Pricing**: 
  - Base price per kilometer varies by tier
  - Total fare = (Distance in km) × (Price per km for selected tier)
- **Price Display**: 
  - Show estimated fare before booking
  - Display breakdown: distance × rate per km = total fare
- **Tier Pricing** (Example):
  - Economy: ₹X per km
  - Premium: ₹Y per km (Y > X)
  - Luxury: ₹Z per km (Z > Y)

### 5.5 Booking
- **Booking Flow**:
  1. Select pickup location on map
  2. Select destination on map
  3. View calculated distance
  4. Select taxi tier
  5. View estimated fare
  6. Confirm booking
- **Booking Confirmation**: 
  - Display booking confirmation with:
    - Booking ID
    - Pickup location
    - Destination
    - Selected tier
    - Distance
    - Total fare
    - Estimated arrival time (if applicable)

## 6. User Flow

### 6.1 Booking Flow
1. **Landing Page**: User opens the web app
2. **Map View**: Interactive map of Bengaluru is displayed
3. **Select Pickup**: User clicks on map or enters address to set pickup location
4. **Select Destination**: User clicks on map or enters address to set destination
5. **View Distance**: System calculates and displays distance
6. **Choose Tier**: User selects desired flying taxi tier
7. **View Price**: System calculates and displays total fare
8. **Confirm Booking**: User reviews and confirms booking
9. **Confirmation**: Booking confirmation page is displayed

## 7. Pricing Model

### 7.1 Distance-Based Pricing Structure
- Pricing is calculated as: **Total Fare = Distance (km) × Rate per km (tier-specific)**
- Minimum fare may apply for very short distances
- Maximum distance limit may apply per booking

### 7.2 Tier Pricing (Example - to be finalized)
- **Economy Tier**: ₹500 per km
- **Premium Tier**: ₹750 per km
- **Luxury Tier**: ₹1000 per km

## 8. Geographic Scope

### 8.1 Service Area
- **Primary Coverage**: Bengaluru city limits
- **Boundary Restrictions**: 
  - Pickup and destination must be within Bengaluru
  - System should validate locations are within service area
- **Map Coverage**: Leaflet.js map should focus on Bengaluru region

## 9. Constraints & Assumptions

### 9.1 Constraints
- Service limited to Bengaluru city only
- Web app only (no mobile app in MVP)
- No real-time tracking in MVP
- No payment integration in MVP (assume cash/separate payment)
- No user authentication required in MVP (optional for future)

### 9.2 Assumptions
- Users have internet connectivity
- Users can interact with web-based maps
- Flying taxis are autonomous (no driver required)
- Regulatory approvals for flying taxis are in place
- Infrastructure for flying taxi operations exists

## 10. Out of Scope (MVP)

The following features are explicitly excluded from MVP:
- User accounts/login system
- Payment gateway integration
- Real-time taxi tracking
- Booking history
- Cancellation/refund functionality
- Multiple passenger booking
- Scheduled bookings
- Reviews and ratings
- Customer support chat
- Mobile applications

## 11. Future Enhancements (Post-MVP)

- User authentication and profiles
- Payment integration
- Real-time tracking of booked taxi
- Booking history
- Cancellation and refund policies
- Scheduled/advance bookings
- Multiple passenger selection
- Reviews and ratings system

## 12. Design Considerations

### 12.1 User Experience
- Simple, intuitive interface
- Clear visual feedback for map interactions
- Prominent display of pricing information
- Easy-to-understand booking confirmation

### 12.2 Map Requirements
- Leaflet.js integration for Bengaluru map
- Clear markers for pickup and destination
- Route visualization between points
- Zoom and pan functionality
- Address search/geocoding capability

## 13. Success Criteria

### MVP Launch Criteria
- Users can successfully select pickup and destination on map
- Distance calculation is accurate
- Pricing calculation works correctly for all tiers
- Booking confirmation is generated successfully
- App functions smoothly within Bengaluru boundaries

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Status**: Draft

