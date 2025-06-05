import React, { useState } from 'react'
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'
import Title from '../components/Title'
import Footer from '../components/Footer'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Lidar com o envio do formulário aqui
    console.log('Form submitted:', formData)
    // Resetar formulário
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    })
  }

  return (
    <section className='min-h-screen bg-gradient-to-br from-cream/30 via-white to-sage/20'>
      <div className='max-padd-container pt-32 pb-20'>
        {/* Título */}
        <div className='text-center mb-16'>
          <Title title1={'Entre em'} title2={'Contato'} titleStyles={'pb-4'} />
          <p className='text-tertiary leading-relaxed max-w-2xl mx-auto'>
            Estamos aqui para ajudar! Entre em contato conosco através de qualquer um dos canais abaixo.
          </p>
        </div>

        <div className='grid lg:grid-cols-2 gap-16 xl:gap-20'>
          {/* Informações de Contato */}
          <div className='space-y-12'>
            <div>
              <h3 className='h3 text-navy mb-8'>Informações de Contato</h3>
              <div className='space-y-6'>
                <div className='flex items-center gap-4 group'>
                  <div className='w-14 h-14 bg-gradient-to-br from-secondary to-tertiary rounded-xl flexCenter text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110'>
                    <HiMail className='text-xl' />
                  </div>
                  <div>
                    <h4 className='font-semibold text-navy mb-1'>Email</h4>
                    <p className='text-tertiary'>contato@Look.the.Book.com</p>
                  </div>
                </div>

                <div className='flex items-center gap-4 group'>
                  <div className='w-14 h-14 bg-gradient-to-br from-tertiary to-accent rounded-xl flexCenter text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110'>
                    <HiPhone className='text-xl' />
                  </div>
                  <div>
                    <h4 className='font-semibold text-navy mb-1'>Telefone</h4>
                    <p className='text-tertiary'>(11) 9999-9999</p>
                  </div>
                </div>

                <div className='flex items-center gap-4 group'>
                  <div className='w-14 h-14 bg-gradient-to-br from-accent to-sage rounded-xl flexCenter text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110'>
                    <HiLocationMarker className='text-xl' />
                  </div>
                  <div>
                    <h4 className='font-semibold text-navy mb-1'>Endereço</h4>
                    <p className='text-tertiary'>Rua dos Livros, 123<br />São Paulo - SP</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Redes Sociais */}
            <div>
              <h3 className='h3 text-navy mb-6'>Siga-nos</h3>
              <div className='flex gap-4'>
                {[
                  { icon: FaFacebook, color: 'from-blue-600 to-blue-700' },
                  { icon: FaTwitter, color: 'from-sky-500 to-sky-600' },
                  { icon: FaInstagram, color: 'from-pink-500 to-purple-600' },
                  { icon: FaLinkedin, color: 'from-blue-700 to-blue-800' }
                ].map((social, index) => (
                  <button key={index} className={`w-12 h-12 bg-gradient-to-br ${social.color} rounded-xl flexCenter text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110`}>
                    <social.icon className='text-lg' />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Formulário de Contato */}
          <div className='bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 p-8 shadow-lg hover:shadow-xl transition-all duration-300'>
            <h3 className='h3 text-navy mb-6'>Envie uma Mensagem</h3>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='grid sm:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-navy mb-2'>Nome</label>
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all duration-300 bg-white/50 backdrop-blur-sm'
                    placeholder='Seu nome completo'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-navy mb-2'>Email</label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all duration-300 bg-white/50 backdrop-blur-sm'
                    placeholder='seu@email.com'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-navy mb-2'>Assunto</label>
                <input
                  type='text'
                  name='subject'
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className='w-full px-4 py-3 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all duration-300 bg-white/50 backdrop-blur-sm'
                  placeholder='Assunto da mensagem'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-navy mb-2'>Mensagem</label>
                <textarea
                  name='message'
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className='w-full px-4 py-3 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all duration-300 bg-white/50 backdrop-blur-sm resize-none'
                  placeholder='Escreva sua mensagem aqui...'
                />
              </div>

              <button
                type='submit'
                className='w-full bg-gradient-to-r from-secondary to-tertiary hover:from-tertiary hover:to-accent text-white py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold'
              >
                Enviar Mensagem
              </button>
            </form>
          </div>        </div>
      </div>
      
      <Footer />
    </section>
  )
}

export default Contact