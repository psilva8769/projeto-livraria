import React, { useContext } from 'react'
import { TbTrash } from 'react-icons/tb'
import { FaMinus, FaPlus } from 'react-icons/fa6'
import Title from '../components/Title'
import { ShopContext } from '../context/ShopContext'
import CartTotal from '../components/CartTotal'
import Footer from '../components/Footer'

const Cart = () => {

    const { books, navigate, currency, cartItems, getCartAmount, updateQuantity } = useContext(ShopContext)

    return (
        <section className='min-h-screen bg-gradient-to-br from-cream/20 via-white to-primary/10'>
            <div className='max-padd-container pt-32 pb-20'>
                {/* Title */}
                <Title title1={'Carrinho'} title2={'Lista'} title1Styles={'h3'} />
                
                {/* Cart Items */}
                <div className='mt-12 space-y-6'>
                    {books.map((item) => {
                        if (cartItems[item._id] > 0) {
                            return (
                                <div key={item._id} className='bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6 rounded-2xl group'>
                                    <div className='flex gap-x-6'>
                                        <div className='flex items-start gap-6'>
                                            <div className='relative overflow-hidden rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300'>
                                                <img src={item.image} alt="itemImg" className='w-20 h-28 object-cover group-hover:scale-105 transition-transform duration-300' />
                                                <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                                            </div>
                                        </div>
                                        <div className='flex flex-col w-full'>
                                            <h5 className='h5 !my-0 line-clamp-1 text-navy group-hover:text-secondary transition-colors duration-300'>{item.name}</h5>
                                            <div className='flex items-start justify-between mt-4'>
                                                <div className='space-y-4'>
                                                    <p className='text-tertiary bg-primary/20 px-3 py-1 rounded-full text-sm inline-block'>{item.category}</p>
                                                    <div className='flex items-center bg-gradient-to-r from-primary/20 to-secondary/10 rounded-2xl p-2 border border-gray-200/50 shadow-sm'>
                                                        <button onClick={() => updateQuantity(item._id, cartItems[item._id] - 1)} className='p-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 text-secondary hover:text-navy'>
                                                            <FaMinus className='text-xs' />
                                                        </button>
                                                        <p className='px-4 font-semibold text-navy min-w-[3rem] text-center'>{cartItems[item._id]}</p>
                                                        <button onClick={() => updateQuantity(item._id, cartItems[item._id] + 1)} className='p-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 text-secondary hover:text-navy'>
                                                            <FaPlus className='text-xs' />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className='text-right'>
                                                    <h4 className='h4 text-accent mb-4'>{currency}{item.price}</h4>
                                                    <button onClick={() => updateQuantity(item._id, 0)} className='p-3 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-xl transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg' title="Remover">
                                                        <TbTrash className='text-xl' />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        return null;
                    })}
                    
                    {/* Empty cart message */}
                    {getCartAmount() === 0 && (
                        <div className='flexCenter flex-col gap-6 py-20'>
                            <div className='w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flexCenter'>
                                <div className='text-4xl text-gray-400'>🛒</div>
                            </div>
                            <div className='text-center'>
                                <h3 className='h3 text-navy mb-2'>Seu carrinho está vazio</h3>
                                <p className='text-tertiary mb-6'>Adicione alguns livros incríveis ao seu carrinho para continuar</p>
                                <button onClick={() => navigate('/shop')} className='btn-outline'>
                                    Continuar Comprando
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Cart Summary */}
                {getCartAmount() > 0 && (
                    <div className='flex justify-center mt-20'>
                        <div className='w-full sm:w-[500px]'>
                            <CartTotal />
                            <button onClick={() => navigate('/place-order')} className='w-full mt-8 bg-gradient-to-r from-secondary to-tertiary hover:from-tertiary hover:to-accent text-white py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold text-lg'>
                                Finalizar Compra
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