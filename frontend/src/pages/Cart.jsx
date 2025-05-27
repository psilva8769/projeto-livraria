import React, { useContext } from 'react'
import { TbTrash } from 'react-icons/tb'
import { FaMinus, FaPlus } from 'react-icons/fa6'
import Title from '../components/Title'
import { ShopContext } from '../context/ShopContext'
import CartTotal from '../components/CartTotal'
import Footer from '../components/Footer'

const Cart = () => {
    const { 
        books, 
        navigate, 
        currency, 
        cartItems, 
        getCartAmount, 
        updateQuantity 
    } = useContext(ShopContext)

    const cartItemsList = books.filter(item => cartItems[item._id] > 0)

    return (
        <section data-testid="cart-section" className='max-padd-container'>
            <div className='pt-28'>
                {/* Title */}
                <div data-testid="cart-title">
                    <Title title1={'Cart'} title2={'List'} title1Styles={'h3'} />
                </div>
                
                {/* Cart Items */}
                <div data-testid="cart-items" className='mt-6'>
                    {cartItemsList.length > 0 ? (
                        cartItemsList.map((item) => (
                            <div 
                                key={item._id} 
                                data-testid={`cart-item-${item._id}`}
                                className='bg-white p-2 mt-3 rounded-lg'
                            >
                                <div className='flex gap-x-3'>
                                    <div className='flex items-start gap-6'>
                                        <img 
                                            data-testid={`cart-item-image-${item._id}`}
                                            src={item.image} 
                                            alt={`${item.name} thumbnail`} 
                                            className='w-14 rounded' 
                                        />
                                    </div>
                                    <div className='flex flex-col w-full'>
                                        <h5 
                                            data-testid={`cart-item-name-${item._id}`}
                                            className='h5 !my-0 line-clamp-1'
                                        >
                                            {item.name}
                                        </h5>
                                        <div className='flex items-start justify-between'>
                                            <div>
                                                <p 
                                                    data-testid={`cart-item-category-${item._id}`}
                                                    className='mb-1.5'
                                                >
                                                    {item.category}
                                                </p>
                                                <div 
                                                    data-testid={`cart-item-quantity-${item._id}`}
                                                    className='flex items-center ring-1 ring-slate-900/5 rounded-full overflow-hidden bg-primary'
                                                >
                                                    <button 
                                                        data-testid={`decrease-quantity-${item._id}`}
                                                        onClick={() => updateQuantity(item._id, cartItems[item._id] - 1)} 
                                                        className='p-1.5 bg-white rounded-full shadow-md'
                                                    >
                                                        <FaMinus className='text-xs' />
                                                    </button>
                                                    <p className='px-2'>{cartItems[item._id]}</p>
                                                    <button 
                                                        data-testid={`increase-quantity-${item._id}`}
                                                        onClick={() => updateQuantity(item._id, cartItems[item._id] + 1)} 
                                                        className='p-1.5 bg-white rounded-full shadow-md'
                                                    >
                                                        <FaPlus className='text-xs' />
                                                    </button>
                                                </div>
                                            </div>
                                            <h4 
                                                data-testid={`cart-item-price-${item._id}`}
                                                className='h4'
                                            >
                                                {currency}{item.price}
                                            </h4>
                                            <button
                                                data-testid={`remove-item-${item._id}`}
                                                onClick={() => updateQuantity(item._id, 0)}
                                                className='cursor-pointer'
                                            >
                                                <TbTrash className='text-xl text-secondary' />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div data-testid="empty-cart-message" className="text-center py-8">
                            Your cart is empty
                        </div>
                    )}
                </div>

                {/* Cart Summary */}
                {cartItemsList.length > 0 && (
                    <div data-testid="cart-summary" className='flex mt-20'>
                        <div className='w-full sm:w-[450px]'>
                            <CartTotal />
                            <button 
                                data-testid="checkout-button"
                                onClick={() => navigate('/place-order')} 
                                className='btn-secondaryOne mt-7'
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </section>
    )
}

export default Cart
