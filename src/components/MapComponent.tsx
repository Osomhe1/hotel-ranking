// MapComponent.tsx
import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

interface Hotel {
  hotel_name: string
  lat: number
  lon: number
}

interface MapComponentProps {
  hotels: Hotel[]
}

const MapComponent: React.FC<MapComponentProps> = ({ hotels }) => {
  return (
    <div className='w-full max-w-7xl mx-auto my-8'>
      <h2 className='text-2xl font-bold mb-4'>Hotel Location</h2>
      <MapContainer center={[51.505, -0.09]} zoom={3} className='h-96 w-full'>
        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
        {hotels.map((hotel, index) => (
          <Marker key={index} position={[hotel.lat, hotel.lon]}>
            <Popup>{hotel.hotel_name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default MapComponent
