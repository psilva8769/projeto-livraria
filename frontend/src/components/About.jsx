import React from 'react'
import Title from './Title'
import { TbTruckReturn } from 'react-icons/tb'
import { Link } from 'react-router-dom'
import about from '../assets/book_1.png'

const About = () => {
  return (
    <section data-testid="about-section" className="max-padd-container py-16 bg-white">
      <div data-testid="about-container" className="flexCenter flex-col gap-16 xl:gap-8 xl:flex-row">
        <div data-testid="about-content" className="flex-1">
          <div data-testid="about-title" className="flex items-center gap-2 mb-6">
            <h2 className="h2">About Us</h2>
          </div>

          <div data-testid="about-description" className="text-lg text-gray-600 mb-8">
            Welcome to our bookstore, where stories come to life and knowledge finds its home.
          </div>

          <div data-testid="about-mission" className="mb-8">
            <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
            <p className="text-gray-600">
              To inspire, educate, and connect readers through carefully curated books and exceptional service.
            </p>
          </div>

          <div data-testid="about-values" className="mb-8">
            <h3 className="text-xl font-semibold mb-3">Our Values</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>Quality Literature</li>
              <li>Customer Satisfaction</li>
              <li>Community Engagement</li>
            </ul>
          </div>

          <div data-testid="about-commitment" className="mb-8">
            <h3 className="text-xl font-semibold mb-3">Commitment to Excellence</h3>
            <p className="text-gray-600">
              We're dedicated to providing the best reading experience through our carefully selected collection.
            </p>
          </div>

          <div data-testid="about-stats" className="grid md:grid-cols-3 gap-8 mb-8">
            <div data-testid="stat-item-0" className="text-center">
              <div className="text-2xl font-bold text-secondary">1000+</div>
              <div className="text-gray-600">Books Available</div>
            </div>
            <div data-testid="stat-item-1" className="text-center">
              <div className="text-2xl font-bold text-secondary">500+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div data-testid="stat-item-2" className="text-center">
              <div className="text-2xl font-bold text-secondary">10+</div>
              <div className="text-gray-600">Years of Excellence</div>
            </div>
          </div>

          <Link to="/contact" data-testid="contact-button" className="btn-secondaryOne">
            Contact Us
          </Link>
        </div>

        <div data-testid="about-image-container" className="flex-1 flexCenter">
          <div className="bg-secondaryOne flexCenter p-24 max-h-[33rem] max-w-[33rem] rounded-3xl">
            <img
              data-testid="about-image"
              src={about}
              alt="aboutImg"
              className="shadow-2xl shadow-slate-900/50 rounded-lg"
              width={244}
              height={244}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
