import React from 'react'
import Title from './Title'
import { TbTruckReturn, TbShield, TbHeadset } from 'react-icons/tb'
import about from '../assets/book_1.png'

const About = () => {
  return (
    <section className='max-padd-container py-16 xl:py-28 relative'>
      <div className='absolute inset-0 bg-gradient-to-br from-sage/10 via-transparent to-primary/5'></div>
      
      {/* container */}
      <div className='flexCenter flex-col gap-16 xl:gap-12 xl:flex-row relative z-10'>
        {/* Left side */}
        <div className='flex-1'>
          <Title title1={"Descubra as "} title2={"principais vantagens da nossa loja!"} titleStyles={'pb-12'} paraStyles={'!block'}/>
          <div className='flex flex-col items-start gap-y-8'>
            <div className='flexCenter gap-x-6 group'>
              <div className='h-16 min-w-16 bg-gradient-to-br from-secondary to-tertiary flexCenter rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110'>
                <TbTruckReturn className='text-2xl text-white'/>
              </div>
              <div className='group-hover:translate-x-2 transition-transform duration-300'>
                <h4 className='medium-18 text-navy mb-2'>Processo de Devolução Fácil</h4>
                <p className='text-tertiary leading-relaxed'>Não ficou satisfeito? Oferecemos um processo de devolução simples e sem complicações dentro de 30 dias.</p>
              </div>
            </div>
            
            <div className='flexCenter gap-x-6 group'>
              <div className='h-16 min-w-16 bg-gradient-to-br from-tertiary to-accent flexCenter rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110'>
                <TbShield className='text-2xl text-white'/>
              </div>
              <div className='group-hover:translate-x-2 transition-transform duration-300'>
                <h4 className='medium-18 text-navy mb-2'>Opções de Pagamento Seguras</h4>
                <p className='text-tertiary leading-relaxed'>Seus dados estão protegidos com criptografia SSL e oferecemos múltiplas opções de pagamento confiáveis.</p>
              </div>
            </div>
            
            <div className='flexCenter gap-x-6 group'>
              <div className='h-16 min-w-16 bg-gradient-to-br from-accent to-sage flexCenter rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110'>
                <TbHeadset className='text-2xl text-white'/>
              </div>
              <div className='group-hover:translate-x-2 transition-transform duration-300'>
                <h4 className='medium-18 text-navy mb-2'>Atendimento ao Cliente em Tempo Real</h4>
                <p className='text-tertiary leading-relaxed'>Nossa equipe está sempre disponível para ajudar você com qualquer dúvida ou problema que possa surgir.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side */}
        <div className='flex-1 flexCenter'>
          <div className='relative bg-gradient-to-br from-primary/20 via-secondary/10 to-tertiary/20 flexCenter p-20 max-h-[35rem] max-w-[35rem] rounded-3xl backdrop-blur-sm border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105'>
            <div className='absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl'></div>
            <img src={about} alt="aboutImg" height={244} width={244} className='relative z-10 shadow-2xl shadow-navy/30 rounded-2xl hover:rotate-2 transition-transform duration-500' />
            
            {/* Floating elements */}
            <div className='absolute top-4 right-4 w-8 h-8 bg-secondary/30 rounded-full animate-float'></div>
            <div className='absolute bottom-8 left-6 w-6 h-6 bg-tertiary/30 rounded-full animate-float' style={{animationDelay: '1s'}}></div>
            <div className='absolute top-1/2 left-4 w-4 h-4 bg-accent/30 rounded-full animate-float' style={{animationDelay: '2s'}}></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About