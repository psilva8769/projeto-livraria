import React from 'react'
import { Link } from 'react-router-dom'
import bg from "../assets/bg.png"
import pencil from "../assets/pencil.png"

const Hero = () => {
    return (
        <section className='max-padd-container py-20 xl:py-36'>
            <div className='flexCenter gap-12 flex-col xl:flex-row'>
                {/* left side */}
                <div className='flex flex-1 flex-col pt-12 xl:pt-32'>
                    <h1 className='h1 max-w-[46rem]'>Descubra <span className='inline-flex'><span className='inline-flex items-center justify-center p-5 h-16 w-16 bg-secondary text-white -rotate-[31deg] rounded-full'>L</span>ivros</span> <img src={pencil} alt="pencilImg" height={49} width={49} className='inline-flex relative bottom-2' /> Que Inspiram o Seu Mundo</h1>
                    <p>Explore um mundo de histórias, conhecimento e inspiração. Descubra livros que despertam sua imaginação, ampliam sua perspectiva e enriquecem sua jornada. De clássicos atemporais a obras-primas modernas, encontre a leitura perfeita para cada momento.</p>
                    <div className='mt-6'>
                        <Link to={'/store'} className='btn-secondaryOne'>Explorar Agora</Link>
                    </div>
                </div>
                {/* Right side */}
                <div className='flex flex-1 relative z-10 top-12'>
                    <div>
                        <img src={bg} alt="" height={588} width={588} />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero