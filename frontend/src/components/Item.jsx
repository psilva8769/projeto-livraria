import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'

const Item = ({ book }) => {
    if (!book) {
        return null
    }

    const { currency, addToCart, cartItems } = useContext(ShopContext)
    const { _id, name = '', image = '', author = '', category = '', price = 0, description } = book
    const [imgSrc, setImgSrc] = useState(image)

    const handleImageError = () => {
        setImgSrc('/fallback-image.jpg')
    }

    return (
        <div data-testid="item-container" className="w-full">
            {/* Image container */}
            <div 
                data-testid="item-image-container"
                className="flexCenter bg-primary rounded-3xl p-4 h-[200px]"
            >
                <img 
                    data-testid="item-image"
                    src={imgSrc} 
                    alt={name || 'Book cover'}
                    onError={handleImageError}
                    className="h-full object-contain"
                />
            </div>

            {/* Content */}
            <div className="mt-4 space-y-2">
                <h3 
                    data-testid="item-name"
                    className="bold-18 line-clamp-2"
                >
                    {name}
                </h3>
                <p 
                    data-testid="item-author"
                    className="regular-14 text-gray-30"
                >
                    {author}
                </p>
                <p 
                    data-testid="item-category"
                    className="regular-14 text-gray-30"
                >
                    {category}
                </p>
                <p 
                    data-testid="item-price"
                    className="medium-16"
                >
                    {`${currency}${price}`}
                </p>
                
                {description && (
                    <p 
                        data-testid="item-description" 
                        className="regular-14 text-gray-30 line-clamp-2"
                    >
                        {description}
                    </p>
                )}

                <button
                    data-testid="add-to-cart-button"
                    onClick={() => _id && addToCart(_id)}
                    className="flexCenter rounded cursor-pointer bg-secondaryOne text-white px-4 py-2 w-full"
                    disabled={!_id}
                >
                    Add to Cart
                    {cartItems && _id && cartItems[_id] > 0 && (
                        <span 
                            data-testid="cart-quantity" 
                            className="ml-2 bg-white text-secondaryOne rounded-full px-2 py-0.5 text-xs"
                        >
                            {cartItems[_id]}
                        </span>
                    )}
                </button>
            </div>
        </div>
    )
}

export default Item
