import React, { useContext } from 'react'
import Title from './Title'
import { ShopContext } from '../context/ShopContext'

const CartTotal = () => {

    const { currency, getCartAmount, delivery_charges } = useContext(ShopContext)

    return (
        <div className='w-full bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300'>
            {/* Título */}
            <Title title1={'Carrinho'} title2={'Total'} title1Styles={'h3'} />
            
            <div className='space-y-4 mt-6'>
                <div className='flexBetween py-3 px-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl'>
                    <h5 className='h5 text-tertiary'>Subtotal:</h5>
                    <p className='h5 font-semibold text-navy'>{currency}{getCartAmount()}.00</p>
                </div>
                
                <div className='flexBetween py-3 px-4 bg-gradient-to-r from-secondary/5 to-tertiary/5 rounded-xl'>
                    <h5 className='h5 text-tertiary'>Frete:</h5>
                    <p className='h5 font-semibold text-navy'>{getCartAmount() === 0 ? "0.00" : `${currency}${delivery_charges}.00`}</p>
                </div>
                
                <div className='flexBetween py-4 px-4 bg-gradient-to-r from-navy/10 to-secondary/10 rounded-xl border-2 border-secondary/20'>
                    <h5 className='h5 font-bold text-navy'>Total:</h5>
                    <p className='h5 font-bold text-accent'>{currency}{getCartAmount() === 0 ? "0.00" : getCartAmount() + delivery_charges}.00</p>
                </div>
            </div>
        </div>
    )
}

export default CartTotal