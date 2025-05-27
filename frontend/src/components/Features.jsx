import React from 'react'
import filter from "../assets/features/filter.png"
import rating from "../assets/features/rating.png"
import wishlist from "../assets/features/wishlist.png"
import secure from "../assets/features/secure.png"

const Features = () => {
  return (
    <section className='max-padd-container py-20 relative'>
      <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-3xl'></div>
      
      <div className='max-padd-container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-16 relative z-10'>
        <div className='flexCenter flex-col gap-4 group'>
          <div className='relative p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110'>
            <img src={filter} alt="featureIcon" height={44} width={44} className='filter transition-all duration-300 group-hover:brightness-110' />
            <div className='absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300'></div>
          </div>
          <div className='flexCenter flex-col'>
            <h5 className='h5 text-center text-navy group-hover:text-secondary transition-colors duration-300'>Busca Avançada e Filtros</h5>
            <hr className='w-12 bg-gradient-to-r from-secondary to-tertiary h-1 rounded-full border-none group-hover:w-16 transition-all duration-300'/>
          </div>
          <p className='text-center text-tertiary leading-relaxed'>Encontre livros facilmente por título, autor, gênero ou faixa de preço.</p>
        </div>
        
        <div className='flexCenter flex-col gap-4 group'>
          <div className='relative p-4 bg-gradient-to-br from-secondary/10 to-tertiary/10 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110'>
            <img src={rating} alt="featureIcon" height={44} width={44} className='filter transition-all duration-300 group-hover:brightness-110' />
            <div className='absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300'></div>
          </div>
          <div className='flexCenter flex-col'>
            <h5 className='h5 text-center text-navy group-hover:text-secondary transition-colors duration-300'>Avaliações e Comentários</h5>
            <hr className='w-12 bg-gradient-to-r from-secondary to-tertiary h-1 rounded-full border-none group-hover:w-16 transition-all duration-300'/>
          </div>
          <p className='text-center text-tertiary leading-relaxed'>Clientes podem compartilhar opiniões, avaliar livros e ajudar outros leitores.</p>
        </div>
        
        <div className='flexCenter flex-col gap-4 group'>
          <div className='relative p-4 bg-gradient-to-br from-tertiary/10 to-accent/10 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110'>
            <img src={wishlist} alt="featureIcon" height={44} width={44} className='filter transition-all duration-300 group-hover:brightness-110' />
            <div className='absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300'></div>
          </div>
          <div className='flexCenter flex-col'>
            <h5 className='h5 text-center text-navy group-hover:text-secondary transition-colors duration-300'>Lista de Desejos e Favoritos</h5>
            <hr className='w-12 bg-gradient-to-r from-secondary to-tertiary h-1 rounded-full border-none group-hover:w-16 transition-all duration-300'/>
          </div>
          <p className='text-center text-tertiary leading-relaxed'>Salve livros na lista de desejos para comprar depois ou acessar facilmente.</p>
        </div>
        
        <div className='flexCenter flex-col gap-4 group'>
          <div className='relative p-4 bg-gradient-to-br from-accent/10 to-sage/20 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110'>
            <img src={secure} alt="featureIcon" height={44} width={44} className='filter transition-all duration-300 group-hover:brightness-110' />
            <div className='absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300'></div>
          </div>
          <div className='flexCenter flex-col'>
            <h5 className='h5 text-center text-navy group-hover:text-secondary transition-colors duration-300'>Pagamentos Online Seguros</h5>
            <hr className='w-12 bg-gradient-to-r from-secondary to-tertiary h-1 rounded-full border-none group-hover:w-16 transition-all duration-300'/>
          </div>
          <p className='text-center text-tertiary leading-relaxed'>Finalize sua compra com diversas opções de pagamento seguras.</p>
        </div>
      </div>
    </section>
  )
}

export default Features