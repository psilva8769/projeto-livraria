import React, { useContext } from 'react'
import { TbShoppingBagPlus } from 'react-icons/tb'
import { ShopContext } from '../context/ShopContext'

const Item = ({book}) => {

    const {currency, addToCart} = useContext(ShopContext)

  return (
    <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-10'>
        <div className='relative bg-gradient-to-br from-muted to-cream p-6 rounded-t-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300'>
            <div className='absolute inset-0 bg-gradient-to-br from-secondaryOne/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
            <img src={book.image} alt="Imagem do livro" className='w-full h-48 object-cover shadow-xl shadow-slate-900/20 rounded-xl relative z-10 group-hover:shadow-2xl transition-shadow duration-300' />
            
            {/* Botão flutuante de adicionar ao carrinho */}
            <div className='absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0'>
                <span onClick={()=> addToCart(book._id)} className='flexCenter h-10 w-10 bg-white/90 backdrop-blur-sm rounded-full cursor-pointer shadow-lg hover:bg-secondaryOne hover:text-white transition-all duration-200' title="Adicionar ao carrinho">
                    <TbShoppingBagPlus className='text-lg'/>
                </span>
            </div>
        </div>
        
        <div className='p-4'>
            <div className='flexBetween mb-2'>
                <h4 className='h4 line-clamp-1 !my-0 text-tertiary group-hover:text-secondary transition-colors'>{book.name}</h4>
            </div>
            
            <div className='flexBetween items-center mb-3'>
                <div className='flex items-center gap-2'>
                    <span className='px-3 py-1 bg-gradient-to-r from-secondaryOne/20 to-sage/20 text-secondary text-xs font-medium rounded-full'>
                        {book.category}
                    </span>
                </div>
                <h5 className='h5 text-secondary font-bold'>{currency}{book.price}.00</h5>
            </div>
            
            <p className='line-clamp-2 text-gray-50 text-sm leading-relaxed'>{book.description}</p>
            
            {/* Espaço reservado para estrelas de avaliação */}
            <div className='flex items-center gap-1 mt-3 opacity-60'>
                {[...Array(5)].map((_, i) => (
                    <span key={i} className='text-gold text-xs'>⭐</span>
                ))}
                <span className='text-xs text-gray-30 ml-1'>(4.5)</span>
            </div>
        </div>
    </div>
  )
}

export default Item