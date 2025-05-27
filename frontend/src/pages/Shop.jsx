import React, { useContext } from 'react'
import { RiSearch2Line } from 'react-icons/ri'
import { categories } from '../assets/data'
import { LuSettings2 } from "react-icons/lu"
import Title from '../components/Title'
import { ShopContext } from '../context/ShopContext'
import Item from '../components/Item'
import Footer from '../components/Footer'

const Shop = () => {
  const { 
    books, 
    setFilterCategory, 
    setSortOrder, 
    addToCart 
  } = useContext(ShopContext)

  const handleCategoryChange = (category) => {
    setFilterCategory(category)
  }

  const handleSortChange = (e) => {
    setSortOrder(e.target.value)
  }

  return (
<section data-testid="shop-page" className='max-padd-container bg-white'>
      <div className='pt-28'>
        {/* Search box */}
        <div className='w-full max-w-2xl flexCenter'>
          <div className='inline-flex items-center justify-center bg-primary overflow-hidden w-full rounded-full p-4 px-5'>
            <div className='text-lg cursor-pointer'><RiSearch2Line /></div>
            <input 
              type="text" 
              placeholder='Search here...' 
              className='border-none outline-none w-full text-sm pl-4 bg-primary' 
            />
            <div className='flexCenter cursor-pointer text-lg border-l pl-2'><LuSettings2 /></div>
          </div>
        </div>

        {/* Categories filter */}
        <div className='mt-12 mb-16'>
          <h4 className='h4 mb-4 hidden sm:flex'>Categories:</h4>
          <div className='flexCenter sm:flexStart flex-wrap gap-x-12 gap-y-4'>
            {categories.map((cat) => (
              <label key={cat.name}>
                <input 
                  type="checkbox"
                  value={cat.name}
                  aria-label={cat.name}
                  onChange={() => handleCategoryChange(cat.name)}
                  className='hidden peer'
                />
                <div className='flexCenter flex-col gap-2 peer-checked:text-secondaryOne cursor-pointer'>
                  <div className='bg-primary h-20 w-20 flexCenter rounded-full'>
                    <img src={cat.image} alt={cat.name} className='object-cover h-10 w-10' />
                  </div>
                  <span className='medium-14'>{cat.name}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Books container */}
        <div className='mt-8'>
          {/* title and sort */}
          <div className='flexBetween !items-start gap-7 flex-wrap pb-16 max-sm:flexCenter text-center'>
            <Title title1={'Our'} title2={'Book List'} titleStyles={'pb-0 text-start'} paraStyles={'!block'} />
            <div className='flexCenter gap-x-2'>
              <label htmlFor="sort" className='hidden sm:flex medium-16'>Sort by:</label>
              <select
                id="sort"
                onChange={handleSortChange}
                aria-label="sort by"
                className='text-sm p-2.5 outline-none bg-primary text-gray-30 rounded'
              >
                <option value="relevant">Relevant</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Books */}
          <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8'>
            {books.map((book) => (
              <Item key={book._id} book={book} />
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </section>
  )
}

export default Shop
