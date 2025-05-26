import React from 'react'
import { Link } from 'react-router-dom'
import bg from "../assets/bg.png"
import pencil from "../assets/pencil.png"

const Hero = () => {
    return (
        <section className='max-padd-container py-20 xl:py-36 relative overflow-hidden'>
            {/* Background gradient */}
            <div className='absolute inset-0 bg-gradient-to-br from-primary via-muted to-cream opacity-60'></div>
            
            <div className='flexCenter gap-12 flex-col xl:flex-row relative z-10'>
                {/* left side */}
                <div className='flex flex-1 flex-col pt-12 xl:pt-32'>
                    <div className='inline-flex items-center gap-2 bg-secondaryOne/10 text-secondary px-4 py-2 rounded-full mb-6'>
                        <span className='w-2 h-2 bg-secondaryOne rounded-full animate-pulse'></span>
                        <span className='text-sm font-medium'>Biblioteca Digital Moderna</span>
                    </div>
                    
                    <h1 className='h1 max-w-[46rem] leading-tight'>
                        Descubra 
                        <span className='inline-flex items-center mx-3'>
                            <span className='inline-flex items-center justify-center p-5 h-16 w-16 bg-gradient-to-br from-secondary to-navy text-white -rotate-[31deg] rounded-2xl shadow-lg'>
                                L
                            </span>
                            <span className='bg-gradient-to-r from-secondary via-navy to-secondaryOne bg-clip-text text-transparent'>ivros</span>
                        </span> 
                        <img src={pencil} alt="pencilImg" height={49} width={49} className='inline-flex relative bottom-2 filter drop-shadow-lg' /> 
                        Que <span className='bg-gradient-to-r from-sage to-secondaryOne bg-clip-text text-transparent'>Inspiram</span> o Seu Mundo
                    </h1>
                    
                    <p className='text-gray-50 leading-relaxed text-lg max-w-[500px] mb-8'>
                        Explore um mundo de histórias, conhecimento e inspiração. Descubra livros que despertam sua imaginação, ampliam sua perspectiva e enriquecem sua jornada. De clássicos atemporais a obras-primas modernas.
                    </p>
                    
                    <div className='flex gap-4 items-center'>
                        <Link to={'/shop'} className='btn-secondaryOne text-lg px-8 py-4 shadow-lg hover:shadow-xl'>
                            Explorar Agora
                        </Link>
                        <div className='flex items-center gap-2 text-gray-50'>
                            <div className='flex -space-x-2'>
                                <div className='w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-navy border-2 border-white'></div>
                                <div className='w-8 h-8 rounded-full bg-gradient-to-br from-sage to-secondaryOne border-2 border-white'></div>
                                <div className='w-8 h-8 rounded-full bg-gradient-to-br from-gold to-accent border-2 border-white'></div>
                            </div>
                            <span className='text-sm'>+1000 leitores satisfeitos</span>
                        </div>
                    </div>
                </div>                {/* Right side */}
                <div className='flex flex-1 relative z-10 top-12'>
                    <div className='relative'>
                        {/* Decorative elements */}
                        <div className='absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-secondaryOne/20 to-sage/20 rounded-full blur-xl'></div>
                        <div className='absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-secondary/20 to-navy/20 rounded-full blur-xl'></div>
                        
                        <div className='relative bg-gradient-to-br from-white/50 to-cream/50 backdrop-blur-sm rounded-3xl p-6 shadow-2xl'>
                            <img src={bg} alt="" height={588} width={588} className='rounded-2xl shadow-lg' />
                        </div>
                        
                        {/* Floating badges */}
                        <div className='absolute top-8 -left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg'>
                            <span className='text-sm font-medium text-secondary'>📚 Novos Títulos</span>
                        </div>
                        <div className='absolute bottom-8 -right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg'>
                            <span className='text-sm font-medium text-secondary'>⭐ Mais Vendidos</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero