import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import { FOOTER_CONTACT_INFO, FOOTER_LINKS, SOCIALS } from '../assets/data'

const Footer = () => {
  return (
    <footer className='mb-4 relative'>
      {/* Background gradients */}
      <div className='absolute inset-0 bg-gradient-to-br from-secondary/5 via-navy/5 to-tertiary/5 rounded-tr-3xl rounded-tl-3xl'></div>
      
      <div className='relative rounded-tr-3xl rounded-tl-3xl pt-12 xl:pt-20 pb-8 border-t border-gray-20/20'>
        <div className='text-center mb-12'>
          <h3 className='h3 bg-gradient-to-r from-secondary to-navy bg-clip-text text-transparent mb-4'>
            Descubra livros que despertam sua imaginação
          </h3>
          <p className='text-gray-50 max-w-2xl mx-auto leading-relaxed'>
            Junte-se à nossa comunidade de leitores apaixonados e receba as últimas novidades, recomendações personalizadas e ofertas exclusivas.
          </p>
        </div>
        
        <hr className='my-8 bg-gradient-to-r from-transparent via-gray-20/30 to-transparent h-[1px] border-none' />
        
        {/* container */}
        <div className='flex justify-between flex-wrap gap-8'>
          <div className='max-w-sm'>
            {/* logo */}
            <Link to={'/'} className='flex-1 flex items-center justify-start mb-6 group'>
              <img src={logo} alt="" height={40} width={40} className='hidden sm:flex mr-3 group-hover:scale-110 transition-transform duration-300' />
              <h4 className='bold-24 bg-gradient-to-r from-secondary to-navy bg-clip-text text-transparent'>Bacala</h4>
            </Link>
            
            <p className='py-4 text-gray-50 leading-relaxed'>
              Sua biblioteca digital moderna. Conectamos você aos melhores livros e autores, criando experiências de leitura únicas e transformadoras.
            </p>
            
            <div className='relative mb-6'>
              <div className='flexBetween pl-4 h-[3.5rem] bg-white/80 backdrop-blur-sm w-full max-w-[333px] rounded-2xl ring-1 ring-gray-20/30 shadow-lg'>
                <input 
                  type="email" 
                  placeholder='Digite seu e-mail' 
                  className='bg-transparent border-none outline-none flex-1 text-tertiary placeholder:text-gray-30' 
                />
                <button className='btn-secondaryOne relative right-[8px] shadow-md hover:shadow-lg'>
                  Inscrever-se
                </button>
              </div>
            </div>
            
            {/* Newsletter benefits */}
            <div className='flex flex-col gap-2 text-sm text-gray-50'>
              <div className='flex items-center gap-2'>
                <span className='w-2 h-2 bg-secondaryOne rounded-full'></span>
                <span>Recomendações personalizadas</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='w-2 h-2 bg-sage rounded-full'></span>
                <span>Ofertas exclusivas para assinantes</span>
              </div>
            </div>
          </div>          <div className='flex justify-between flex-wrap gap-8'>
            {FOOTER_LINKS.map((col) => (
              <FooterColumn key={col.title} title={col.title}>
                <ul className='flex flex-col gap-4 regular-14 text-gray-50'>
                  {col.links.map((link) => (
                    <Link to='/' key={link} className='hover:text-secondary transition-colors duration-200 hover:translate-x-1 transform'>{link}</Link>
                  ))}
                </ul>
              </FooterColumn>
            ))}
            
            <div className='flex flex-col gap-5'>
              <FooterColumn title={FOOTER_CONTACT_INFO.title}>
                {FOOTER_CONTACT_INFO.links.map((link) => (
                  <Link to='/' key={link.label} className='flex gap-4 md:flex-col lg:flex-row hover:text-secondary transition-colors duration-200 group'>
                    <p className='text-gray-50'>{link.label}:</p>
                    <p className='bold-15 text-tertiary group-hover:text-secondary'>{link.value}</p>
                  </Link>
                ))}
              </FooterColumn>
            </div>
            
            <div className='flex'>
              <FooterColumn title={SOCIALS.title}>
                <ul className='flex gap-4'>
                  {SOCIALS.links.map((link) => (
                    <Link to='/' key={link.id} className='text-xl text-gray-50 hover:text-secondary transition-all duration-200 hover:scale-110 transform p-2 rounded-full hover:bg-secondary/10'>
                      {link.icon}
                    </Link>
                  ))}
                </ul>
              </FooterColumn>
            </div>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className='mt-12 pt-8 border-t border-gray-20/20'>
          <div className='flexBetween flex-wrap gap-4'>
            <p className='text-gray-50 text-sm'>
              © 2024 Bacala. Todos os direitos reservados. Feito com ❤️ para os amantes de livros.
            </p>
            <div className='flex gap-6 text-sm text-gray-50'>
              <Link to='/' className='hover:text-secondary transition-colors'>Privacidade</Link>
              <Link to='/' className='hover:text-secondary transition-colors'>Termos</Link>
              <Link to='/' className='hover:text-secondary transition-colors'>Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

const FooterColumn = ({ title, children }) => {
  return (
    <div className='flex flex-col gap-5'>
      <h4 className='bold-18 whitespace-nowrap text-tertiary'>{title}</h4>
      {children}
    </div>
  )
}
