import React from 'react'
import { Link } from 'react-router-dom'
import { RiSearch2Line } from 'react-icons/ri'
import bg from "../assets/bg.png"
import pencil from "../assets/pencil.png"

const STATS = [
  { label: 'Books Available', value: '1000+' },
  { label: 'Happy Customers', value: '500+' },
  { label: 'Book Categories', value: '10+' }
];

const Hero = () => {
  return (
<section 
      data-testid="hero-section" 
      className="max-padd-container py-20 xl:py-36"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div data-testid="hero-flex-container" className="flexCenter gap-12 flex-col xl:flex-row">
        <div data-testid="hero-content" className="md:w-1/2 lg:w-2/5">
          <h1 data-testid="hero-title" className="h1 max-w-[46rem]">
            Discover
            <span className="inline-flex">
              <span data-testid="hero-b-icon" className="inline-flex items-center justify-center p-5 h-16 w-16 bg-secondary text-white -rotate-[31deg] rounded-full">
                B
              </span>
              ooks
            </span>
            that inspire your world
            <img 
              data-testid="pencil-image" 
              src={pencil} 
              alt="pencil decoration" 
              width={49} 
              height={49} 
              className="inline-flex relative bottom-2"
            />
          </h1>

          <p data-testid="hero-description" className="mt-6 text-lg">
            Explore a world of stories, knowledge, and inspiration
          </p>

          <div data-testid="hero-search" className="mt-8 max-w-md">
            <div className="flex items-center bg-white rounded-full p-2 shadow-md">
              <RiSearch2Line className="ml-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search for books..."
                className="ml-2 w-full outline-none"
              />
            </div>
          </div>

          <Link
            to="/store"
            data-testid="hero-cta"
            className="btn-secondaryOne mt-8"
          >
            Explore Now
          </Link>

          <div data-testid="hero-stats" className="mt-12 grid grid-cols-3 gap-8">
            {STATS.map((stat, index) => (
              <div key={stat.label} data-testid={`stat-item-${index}`} className="text-center">
                <div className="text-2xl font-bold text-secondary">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div data-testid="hero-image-container" className="md:w-1/2 lg:w-3/5">
          <img
            data-testid="hero-image"
            src={bg}
            alt="Books and reading"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  )
}

export default Hero
