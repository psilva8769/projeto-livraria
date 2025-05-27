import React, { useContext } from 'react'
import Title from './Title'
import { ShopContext } from '../context/ShopContext'

const CartTotal = () => {
    const { currency, getCartAmount, delivery_charges } = useContext(ShopContext)

    const subtotal = getCartAmount();
    const shippingFee = subtotal === 0 ? 0 : delivery_charges;
    const total = subtotal + shippingFee;

    const formatAmount = (amount) => `${currency}${amount}.00`;

    return (
        <div data-testid="cart-total-container" className='w-full'>
            {/* Title */}
            <Title title1={'Cart'} title2={'Total'} title1Styles={'h3'} />
            <div data-testid="subtotal-row" className='flexBetween pt-3'>
                <h5 className='h5'>SubTotal:</h5>
                <p data-testid="subtotal-amount" className='h5'>{formatAmount(subtotal)}</p>
            </div>
            <hr role="separator" className='mx-auto h-[1px] w-full bg-gray-900/10 my-1' />
            <div data-testid="shipping-row" className='flexBetween pt-3'>
                <h5 className='h5'>Shipping Fee:</h5>
                <p data-testid="shipping-amount" className='h5'>{subtotal === 0 ? "0.00" : formatAmount(shippingFee)}</p>
            </div>
            <hr role="separator" className='mx-auto h-[1px] w-full bg-gray-900/10 my-1' />
            <div data-testid="total-row" className='flexBetween pt-3'>
                <h5 className='h5'>Total:</h5>
                <p data-testid="total-amount" className='h5'>{formatAmount(total)}</p>
            </div>
            <hr role="separator" className='mx-auto h-[1px] w-full bg-gray-900/10 my-1' />
        </div>
    )
}

export default CartTotal