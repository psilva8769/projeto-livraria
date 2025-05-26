import React from 'react'
import Hero from '../components/Hero'
import NewArrivals from '../components/NewArrivals'
import About from '../components/About'
import PopularBooks from '../components/PopularBooks'
import Features from '../components/Features'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className='relative'>
      {/* Background effects */}
      <div className='absolute inset-0 bg-gradient-to-br from-primary via-muted to-cream opacity-50'></div>
      
      <div className='relative'>
        <Hero />
        
        <div className='bg-white/60 backdrop-blur-sm'>
          <NewArrivals />
        </div>
        
        <div className='bg-gradient-to-br from-cream/50 to-muted/50'>
          <About />
        </div>
        
        <div className='bg-white/80 backdrop-blur-sm'>
          <PopularBooks />
        </div>
        
        <div className='bg-gradient-to-br from-muted/50 to-primary/50'>
          <Features />
        </div>
        
        <div className='max-padd-container bg-white/90 backdrop-blur-sm border-t border-gray-20/20'>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default Home