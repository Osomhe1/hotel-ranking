import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Hotel } from '../types'
import HotelBrandFilter from './HotelBrandFilter'

interface HotelListProps {
  hotels: Hotel[]
  handleDelete: (id: number) => void
  handleSortChange: (sortOption: string) => void
  brands: string[]
  filterByBrand: (brand: string) => void
  locations: string[]
  filterByLocation: (location: string) => void
}

const HotelList: React.FC<HotelListProps> = ({
  hotels,
  handleDelete,
  handleSortChange,
  brands,
  filterByBrand,
  locations,
  filterByLocation,
}) => {
  const navigate = useNavigate()
  const [selectedSort, setSelectedSort] = React.useState('popularity')

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value
    setSelectedSort(selected)
    handleSortChange(selected)
  }

  const handleHotelClick = (id: number) => {
    navigate(`/hotel/${id}`)
  }

  return (
    <div className='container mx-auto p-4 flex flex-col lg:flex-row'>
      {/* Sidebar with Brand Filter and Sorting Options */}
      <div className='w-full lg:w-1/4 p-4 max-h-96 bg-white shadow-md rounded-md mb-6 lg:mb-0 lg:mr-4'>
        <HotelBrandFilter brands={brands} filterByBrand={filterByBrand} />

        {/* Location Filter Dropdown */}
        <div className='mt-6'>
          <h2 className='text-xl font-bold mb-4'>Filter by Location</h2>
          <select
            onChange={(e) => filterByLocation(e.target.value)}
            className='border p-2 w-full rounded-md'
          >
            <option value=''>All Locations</option>
            {locations?.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div className='mt-6'>
          <label className='block text-lg font-bold mb-2'>Sort By:</label>
          <select
            value={selectedSort}
            onChange={handleDropdownChange}
            className='border px-4 py-2 rounded-md w-full text-gray-800'
          >
            <option value='distance'>Distance from city centre</option>
            <option value='popularity'>Popularity</option>
            <option value='class_descending'>Stars (5 to 0)</option>
            <option value='class_ascending'>Stars (0 to 5)</option>
            <option value='bayesian_review_score'>Guest review score</option>
            <option value='price'>Price (low to high)</option>
          </select>
        </div>
      </div>

      {/* Hotel Listings */}
      <div className='w-full lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
        {hotels.length === 0 ? (
          <div className='text-center text-gray-500'>No hotels found</div>
        ) : (
          hotels?.map((hotel, index) => (
            <div
              key={hotel.id}
              className='relative bg-white shadow-md rounded-lg overflow-hidden flex flex-col items-start mb-6 hover:shadow-xl transition-shadow duration-300 ease-in-out'
              data-aos='zoom-in'
              data-aos-delay={`${index * 100}`}
            >
              {/* Hotel Image */}
              <div
                className='w-full cursor-pointer'
                onClick={() => handleHotelClick(hotel.id)}
              >
                {hotel.image_url ? (
                  <img
                    src={hotel.image_url}
                    alt={hotel.hotel_name}
                    className='w-full h-48 object-cover rounded-t-lg'
                    loading='lazy'
                  />
                ) : (
                  <div className='w-full h-48 bg-gray-300 flex items-center justify-center rounded-t-lg'>
                    <span className='text-gray-500'>No Image Available</span>
                  </div>
                )}
              </div>

              {/* Hotel Information */}
              <div className='w-full p-4'>
                <h3 className='text-xl font-bold text-gray-900'>
                  {hotel.hotel_name}
                </h3>
                <p className='text-gray-700 my-2'>
                  <span className='font-bold'>Location:</span> {hotel.city},{' '}
                  {hotel.country}
                </p>
                <p className='text-gray-700 my-2'>
                  <span className='font-bold'>Address:</span> {hotel.address}
                </p>
                <p className='text-gray-700 my-2'>
                  <span className='font-bold'>Brand:</span> {hotel.brand}
                </p>
                <p className='text-green-600 font-bold text-xl mb-4'>
                  Price: ${hotel.min_total_price.toFixed(2)}
                </p>

                {/* Rating Badge */}
                <div className='absolute top-4 right-4 bg-green-500 text-white text-sm px-3 py-1 rounded-lg'>
                  {hotel.review_score || 'N/A'}
                </div>

                {/* Action Buttons */}
                <div className='mt-4 flex justify-between w-full'>
                  <button
                    onClick={() => handleHotelClick(hotel.id)}
                    className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors'
                  >
                    View Details
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(hotel.id)
                    }}
                    className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors'
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default HotelList
