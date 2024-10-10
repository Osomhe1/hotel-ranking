import React from 'react'

interface HotelBrandFilterProps {
  brands: string[]
  filterByBrand: (brand: string) => void
}

const HotelBrandFilter: React.FC<HotelBrandFilterProps> = ({
  brands,
  filterByBrand,
}) => {
  return (
    <div>
      <h2 className='text-xl font-bold mb-4'>Filter by Brand</h2>
      <select
        onChange={(e) => filterByBrand(e.target.value)}
        className='border p-2 w-full rounded-md'
      >
        <option value=''>All Brands</option>
        {brands?.map((brand, index) => (
          <option key={index} value={brand}>
            {brand}
          </option>
        ))}
      </select>
    </div>
  )
}

export default HotelBrandFilter
