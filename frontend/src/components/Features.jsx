import React from 'react'
import filter from "../assets/features/filter.png"
import rating from "../assets/features/rating.png"
import wishlist from "../assets/features/wishlist.png"
import secure from "../assets/features/secure.png"

const Features = () => {
  return (
    <section className='max-padd-container py-16'>
      <div className='max-padd-container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 gap-y-12'>
        <div className='flexCenter flex-col gap-3'>
          <img src={filter} alt="featureIcon" height={44} width={44} />
          <div className='flexCenter flex-col'>
            <h5 className='h5'>Busca Avançada e Filtros</h5>
            <hr className='w-8 bg-secondary h-1 rounded-full border-none'/>
          </div>
          <p className='text-center'>Encontre livros facilmente por título, autor, gênero ou faixa de preço.</p>
        </div>
        <div className='flexCenter flex-col gap-3'>
          <img src={rating} alt="featureIcon" height={44} width={44} />
          <div className='flexCenter flex-col'>
            <h5 className='h5'>Avaliações e Comentários</h5>
            <hr className='w-8 bg-secondary h-1 rounded-full border-none'/>
          </div>
          <p className='text-center'>Clientes podem compartilhar opiniões, avaliar livros e ajudar outros leitores.</p>
        </div>
        <div className='flexCenter flex-col gap-3'>
          <img src={wishlist} alt="featureIcon" height={44} width={44} />
          <div className='flexCenter flex-col'>
            <h5 className='h5'>Lista de Desejos e Favoritos</h5>
            <hr className='w-8 bg-secondary h-1 rounded-full border-none'/>
          </div>
          <p className='text-center'>Salve livros na lista de desejos para comprar depois ou acessar facilmente.</p>
        </div>
        <div className='flexCenter flex-col gap-3'>
          <img src={secure} alt="featureIcon" height={44} width={44} />
          <div className='flexCenter flex-col'>
            <h5 className='h5'>Pagamentos Online Seguros</h5>
            <hr className='w-8 bg-secondary h-1 rounded-full border-none'/>
          </div>
          <p className='text-center'>Finalize sua compra com diversas opções de pagamento seguras.</p>
        </div>
      </div>
    </section>
  )
}

export default Features