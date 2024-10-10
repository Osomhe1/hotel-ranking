/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../hooks/api'
import Loader from './Loader'
import MapComponent from './MapComponent'
import { toast } from 'react-toastify'

interface HotelDetailData {
  name: string
  address: string
  country: string
  city: string
  main_photo_url: string
  review_score: string
  review_score_word: string
  location: {
    latitude: number
    longitude: number
  }
  hotel_facilities: string
  description_translations: Array<{
    description: string
    languagecode: string
  }>
  checkin: {
    from: string
    to: string
    '24_hour_available': number
  }
}

const HotelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>() // Get the hotel ID from the URL
  const [hotel, setHotel] = useState<HotelDetailData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const response = await api.get('/hotels/data', {
          params: { hotel_id: id, locale: 'en-gb' },
        })
        setHotel(response.data) // Set hotel data to state
        setLoading(false)
      } catch (error: any) {
        toast.error('Error fetching hotel details:', error)
        setLoading(false)
      }
    }

    fetchHotelDetails()
  }, [id])

  if (loading) {
    return <Loader />
  }

  if (!hotel) {
    return <div className='text-center mt-6'>Hotel not found.</div>
  }

  const hotelLocation = [
    {
      hotel_name: hotel.name,
      lat: hotel.location.latitude,
      lon: hotel.location.longitude,
    },
  ]

  return (
    <div className='w-full'>
      {/* Hero Section */}
      <div
        className='relative h-96 bg-center bg-cover flex items-center justify-center'
        style={{ backgroundImage: `url(${hotel.main_photo_url})` }}
      >
        <h1 className='text-5xl text-white font-bold bg-opacity-50 bg-black px-4 py-2 rounded'>
          Room Details
        </h1>
      </div>

      {/* Breadcrumb */}
      <div className='py-4 px-8 bg-gray-100 text-sm'>
        <a href='/' className='text-blue-500'>
          Home
        </a>{' '}
        / <span>Room Details</span>
      </div>

      {/* Room Details Section */}
      <div className='container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Main Room Image & Booking Section */}
        <div className='lg:col-span-2'>
          <img
            src={hotel.main_photo_url}
            alt={hotel.name}
            className='w-full h-96 object-cover mb-6 rounded-lg'
          />
          <div className='bg-white p-6 rounded-lg shadow-lg'>
            <h2 className='text-2xl font-bold mb-4'>{hotel.name}</h2>
            <p className='text-gray-600 mb-4'>
              <strong>Address:</strong> {hotel.address}, {hotel.city},{' '}
              {hotel.country}
            </p>
            <p className='text-gray-600 mb-4'>
              <strong>Rating:</strong> {hotel.review_score} (
              {hotel.review_score_word})
            </p>
            <p className='text-gray-600'>
              {hotel.description_translations
                .filter((desc) => desc.languagecode === 'en-gb')
                .map((desc, index) => (
                  <span key={index} className='block mb-2'>
                    {desc.description}
                  </span>
                ))}
            </p>
          </div>
        </div>

        {/* Booking Section */}
        <div className='bg-white p-6 rounded-lg shadow-lg'>
          <h3 className='text-xl font-bold mb-4'>Booking</h3>
          <div className='space-y-4'>
            {/* Check-In Information */}
            <div className='bg-gray-100 p-4 rounded-lg mt-6'>
              <h3 className='text-xl font-bold mb-2'>Check-In Information</h3>
              <p className='text-gray-600'>
                <strong>From:</strong> {hotel.checkin.from}
              </p>
              <p className='text-gray-600'>
                <strong>To:</strong> {hotel.checkin.to}
              </p>
              <p className='text-gray-600'>
                <strong>24-Hour Check-In:</strong>{' '}
                {hotel.checkin['24_hour_available'] ? 'Yes' : 'No'}
              </p>
            </div>
            <div>
              <label className='block text-gray-700'>Adults</label>
              <input
                type='number'
                value='2'
                className='w-full border px-4 py-2 rounded mt-1'
                readOnly
              />
            </div>
            <div>
              <label className='block text-gray-700'>Children</label>
              <input
                type='number'
                value='2'
                className='w-full border px-4 py-2 rounded mt-1'
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Room Details */}
      <div className='container mx-auto px-6 py-12'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* House Rules */}
          <div>
            <h3 className='text-2xl font-bold mb-4'>House Rules</h3>
            <p className='text-gray-600 mb-4'>
              Professionally deliver fully researched scenarios with turnkey
              communities.
            </p>
            <ul className='list-disc list-inside text-gray-600'>
              <li>Check-in from 9:00 AM - anytime</li>
              <li>Early check-in subject to availability</li>
              <li>Check-out before noon</li>
            </ul>
          </div>

          {/* Amenities Section */}
          <div>
            <h3 className='text-2xl font-bold mb-4'>Amenities</h3>
            <ul className='space-y-2'>
              <li className='flex items-center'>
                <span className='text-xl'>🛏️</span>{' '}
                <span className='ml-2 text-gray-600'>2 - 5 Persons</span>
              </li>
              <li className='flex items-center'>
                <span className='text-xl'>🌐</span>{' '}
                <span className='ml-2 text-gray-600'>Free WiFi Available</span>
              </li>
              <li className='flex items-center'>
                <span className='text-xl'>🏊</span>{' '}
                <span className='ml-2 text-gray-600'>Swimming Pools</span>
              </li>
              <li className='flex items-center'>
                <span className='text-xl'>🍳</span>{' '}
                <span className='ml-2 text-gray-600'>Breakfast</span>
              </li>
              <li className='flex items-center'>
                <span className='text-xl'>📏</span>{' '}
                <span className='ml-2 text-gray-600'>250 SQFT Rooms</span>
              </li>
              <li className='flex items-center'>
                <span className='text-xl'>🏋️</span>{' '}
                <span className='ml-2 text-gray-600'>Gym facilities</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <MapComponent hotels={hotelLocation} />
    </div>
  )
}

export default HotelDetail
