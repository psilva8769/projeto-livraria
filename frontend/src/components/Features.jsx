import React from 'react'
import filter from "../assets/features/filter.png"
import rating from "../assets/features/rating.png"
import wishlist from "../assets/features/wishlist.png"
import secure from "../assets/features/secure.png"

const Features = () => {
  const features = [
    {
      id: 'search',
      icon: filter,
      title: 'Advanced Search and Filters',
      description: 'Effortlessly search books by title, author, genre, or price range.'
    },
    {
      id: 'reviews',
      icon: rating,
      title: 'User Reviews and Ratings',
      description: 'Customers can share reviews, rate books, and guide future readers.'
    },
    {
      id: 'wishlist',
      icon: wishlist,
      title: 'Wishlist and Favorites',
      description: 'Save books to wishlist for future purchases or easy access.'
    },
    {
      id: 'payments',
      icon: secure,
      title: 'Secure Online Payments',
      description: 'Enjoy seamless checkout with multiple secure payment options.'
    }
  ]

  return (
<section className="max-padd-container py-16" data-testid="features-container">
      <div className="text-center mb-12" data-testid="features-title">
        <h2 className="bold-40 mb-4">
          Why Choose<span className="text-secondaryOne"> Us</span>
        </h2>
        <p className="regular-16 text-gray-30">
          Discover the advantages of shopping with us
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 gap-y-12" data-testid="features-grid">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="bg-primary rounded-2xl p-8 flexCenter flex-col gap-3"
            data-testid={`feature-card-${feature.id}`}
          >
            <img
              data-testid={`feature-image-${feature.id}`}
              src={feature.icon}
              alt="featureIcon"
              className="w-16 h-16"
            />
            <h5 className="bold-20 mt-5 mb-3 text-center" data-testid={`feature-title-${feature.id}`}>
              {feature.title}
            </h5>
            <p className="regular-16 text-gray-30 text-center" data-testid={`feature-description-${feature.id}`}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features
