import React, { useContext, useEffect, useState } from 'react'
import Title from './Title'
import { ShopContext } from '../context/ShopContext'
import Item from './Item'

const PopularBooks = () => {

  const {books} = useContext(ShopContext)
  const [popularBooks, setPopularBooks] = useState([])

  useEffect(()=>{
    const data = books.filter(item => item.popular)
    setPopularBooks(data.slice(0, 5))
  }, [books])

  return (
    <section className='max-padd-container py-20 relative'>
      <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/10 rounded-3xl'></div>
      
      <div className='relative z-10'>
        <Title title1={'Livros'} title2={'Populares'} titleStyles={'pb-16'} paraStyles={'!block'}/>
        
        {/* container */}
        <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 xl:gap-10'>
          {popularBooks.map((book, index)=>(
            <div key={book._id} className='group'>
              <div className={`animate-fadeInUp opacity-0 [animation-fill-mode:forwards]`} style={{animationDelay: `${index * 0.1}s`}}>
                <Item book={book}/>
              </div>
            </div>
          ))}
        </div>
        
        {/* Decorative elements */}
        <div className='absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-secondary/20 to-tertiary/20 rounded-full blur-xl'></div>
        <div className='absolute bottom-10 -left-6 w-16 h-16 bg-gradient-to-br from-accent/20 to-sage/20 rounded-full blur-lg'></div>
      </div>
    </section>
  )
}

export default PopularBooks