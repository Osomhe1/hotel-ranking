/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef, useCallback } from 'react'
import api from '../hooks/api'
import HotelList from './HotelList'
import Loader from './Loader'
import { toast } from 'react-toastify'

interface Hotel {
  id: number
  hotel_name: string
  address: string
  city: string
  country: string
  brand: string
  review_score: number
  min_total_price: number
  lat: number
  lon: number
  image_url: string
}

const Hotel: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [locations, setLocations] = useState<string[]>([])
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0) // Track the current page number
  const [isFetchingMore, setIsFetchingMore] = useState(false) // Track if we are fetching more hotels

  // Reference for the observer element (used for infinite scroll)
  const observerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    fetchHotels(0) // Fetch the first page on initial load
  }, [])

  const fetchHotels = async (pageNumber: number) => {
    try {
      const cityDestId = await getCityDestId('New York')
      if (!cityDestId) {
        toast.error('Failed to retrieve destination ID')
        setLoading(false)
        return
      }

      const response = await api.get('/hotels/search', {
        params: {
          children_ages: '5,0',
          page_number: pageNumber,
          adults_number: '2',
          children_number: '2',
          room_number: '1',
          include_adjacency: 'true',
          units: 'metric',
          categories_filter_ids: 'class::2,class::4,free_cancellation::1',
          checkout_date: '2025-01-19',
          dest_id: cityDestId,
          filter_by_currency: 'AED',
          dest_type: 'city',
          checkin_date: '2025-01-18',
          order_by: 'popularity',
          locale: 'en-gb',
        },
      })

      const hotelData = response.data.result.map((hotel: any) => ({
        id: hotel.hotel_id,
        hotel_name: hotel.hotel_name,
        address: hotel.address,
        city: hotel.city,
        country: hotel.country_trans,
        brand: hotel.hotel_brand || 'Independent',
        review_score: hotel.review_score,
        min_total_price: hotel.min_total_price,
        lat: hotel.latitude,
        lon: hotel.longitude,
        image_url: hotel.main_photo_url || '',
      }))

      setHotels((prev) => [...prev, ...hotelData]) // Append new hotels to the existing list
      setFilteredHotels((prev) => [...prev, ...hotelData])

      if (pageNumber === 0) {
        // For the first page, extract unique brands and locations for filtering
        const uniqueBrands = Array.from(
          new Set(hotelData.map((hotel: { brand: any }) => hotel.brand))
        )
        const uniqueLocations = Array.from(
          new Set(hotelData.map((hotel: { city: any }) => hotel.city))
        )
        setBrands(uniqueBrands)
        setLocations(uniqueLocations)
      }

      setLoading(false)
      setIsFetchingMore(false)
    } catch (error: any) {
      toast.error('Error fetching hotels:', error)
      setLoading(false)
      setIsFetchingMore(false)
    }
  }

  const getCityDestId = async (cityName: string) => {
    try {
      const response = await api.get('/hotels/locations', {
        params: {
          name: cityName,
          locale: 'en-us',
        },
      })
      if (response.data && response.data.length > 0) {
        return response.data[0].dest_id
      }
    } catch (error: any) {
      toast.error('Error fetching city destination ID:', error)
    }
    return null
  }

  const handleDelete = (id: number) => {
    setHotels((prev) => prev.filter((hotel) => hotel.id !== id))
    setFilteredHotels((prev) => prev.filter((hotel) => hotel.id !== id))
  }

  const handleFilterChange = (brand: string, location: string) => {
    let filtered = hotels

    if (brand) {
      filtered = filtered.filter((hotel) => hotel.brand === brand)
    }

    if (location) {
      filtered = filtered.filter((hotel) => hotel.city === location)
    }

    setFilteredHotels(filtered)
  }

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand)
    handleFilterChange(brand, selectedLocation)
  }

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location)
    handleFilterChange(selectedBrand, location)
  }

  const handleSortChange = (sortOption: string) => {
    let sortedHotels = [...filteredHotels]

    switch (sortOption) {
      case 'price':
        sortedHotels.sort((a, b) => a.min_total_price - b.min_total_price)
        break
      case 'bayesian_review_score':
        sortedHotels.sort((a, b) => b.review_score - a.review_score)
        break
      case 'class_descending':
        sortedHotels.sort((a, b) => b.review_score - a.review_score)
        break
      case 'class_ascending':
        sortedHotels.sort((a, b) => a.review_score - b.review_score)
        break
      default:
        sortedHotels = filteredHotels
    }

    setFilteredHotels(sortedHotels)
  }

  // Infinite scroll logic using IntersectionObserver
  const observerCallback = useCallback(
    (entries: [any]) => {
      const [entry] = entries
      if (entry.isIntersecting && !isFetchingMore) {
        setIsFetchingMore(true)
        setPage((prevPage) => prevPage + 1) // Increment page number
        if (entry.target) {
          entry.target.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })
        }
      }
    },
    [isFetchingMore]
  )

  useEffect(() => {
    if (observerRef.current) {
      const observer = new IntersectionObserver(observerCallback, {
        root: null,
        rootMargin: '200px',
        threshold: 0.1,
      })
      observer.observe(observerRef.current)
      return () => {
        if (observerRef.current) observer.unobserve(observerRef.current)
      }
    }
  }, [observerCallback])

  useEffect(() => {
    if (page > 0) fetchHotels(page)
  }, [page])

  return (
    <div className='min-h-screen bg-gray-100 p-4'>
      <h1 className='text-3xl text-black font-bold text-center my-4'>
        Hotel Ranking App
      </h1>
      {loading ? (
        <Loader />
      ) : (
        <>
          <HotelList
            hotels={filteredHotels}
            handleDelete={handleDelete}
            handleSortChange={handleSortChange}
            brands={brands}
            filterByBrand={handleBrandChange}
            locations={locations}
            filterByLocation={handleLocationChange}
          />
          {isFetchingMore && <Loader />}
          <div ref={observerRef} className='w-full h-10'></div>
        </>
      )}
    </div>
  )
}

export default Hotel
