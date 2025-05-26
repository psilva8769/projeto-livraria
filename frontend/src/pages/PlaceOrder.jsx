import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import Footer from '../components/Footer'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

  const { books, navigate, token, cartItems, setCartItems, getCartAmount, delivery_charges, backendUrl } = useContext(ShopContext)
  const [method, setMethod] = useState('cod')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  })

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value

    setFormData(data => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault() // prevents page reload
    try {
      let orderItems = []

      for (const itemId in cartItems) {
        if (cartItems[itemId] > 0) {
          const itemInfo = books.find((book) => book._id === itemId)
          if (itemInfo) {
            orderItems.push({
              ...itemInfo,
              quantity: cartItems[itemId]
            })
          }
        }
      }
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_charges
      }

      switch (method) {
        // api for COD method
        case 'cod':
          const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } })
          console.log(response.data)
          if (response.data.success) {
            setCartItems({})
            navigate('/orders')
          } else {
            toast.error(response.data.message)
          }
          break;

        // api for stripe method
        case 'stripe':
          const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, { headers: { token } })
          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data
            window.location.replace(session_url)
          } else {
            toast.error(responseStripe.data.message)
          }
          break
        default:
          break;
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <section className='min-h-screen bg-gradient-to-br from-cream/20 via-white to-primary/10'>
      {/* Container */}
      <form onSubmit={onSubmitHandler} className='max-padd-container pt-32 pb-20'>
        <div className='flex flex-col xl:flex-row gap-16 xl:gap-20'>
          {/* Left Side */}
          <div className='flex flex-1 flex-col gap-8'>
            <Title title1={'Informações'} title2={'de Entrega'} title1Styles={'h3'} />
            
            <div className='bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 p-8 shadow-lg hover:shadow-xl transition-all duration-300 space-y-6'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-navy mb-2'>Nome</label>
                  <input 
                    onChange={onChangeHandler} 
                    value={formData.firstName} 
                    type="text" 
                    name='firstName' 
                    placeholder='Seu primeiro nome' 
                    className='w-full px-4 py-3 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all duration-300 bg-white/50 backdrop-blur-sm' 
                    required 
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-navy mb-2'>Sobrenome</label>
                  <input 
                    onChange={onChangeHandler} 
                    value={formData.lastName} 
                    type="text" 
                    name='lastName' 
                    placeholder='Seu sobrenome' 
                    className='w-full px-4 py-3 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all duration-300 bg-white/50 backdrop-blur-sm' 
                    required 
                  />
                </div>
              </div>
              
              <div>
                <label className='block text-sm font-medium text-navy mb-2'>E-mail</label>
                <input 
                  onChange={onChangeHandler} 
                  value={formData.email} 
                  type="email" 
                  name='email' 
                  placeholder='seu@email.com' 
                  className='w-full px-4 py-3 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all duration-300 bg-white/50 backdrop-blur-sm' 
                  required 
                />
              </div>
              
              <div>
                <label className='block text-sm font-medium text-navy mb-2'>Telefone</label>
                <input 
                  onChange={onChangeHandler} 
                  value={formData.phone} 
                  type="text" 
                  name='phone' 
                  placeholder='(11) 99999-9999' 
                  className='w-full px-4 py-3 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all duration-300 bg-white/50 backdrop-blur-sm' 
                  required 
                />
              </div>
              
              <div>
                <label className='block text-sm font-medium text-navy mb-2'>Endereço</label>
                <input 
                  onChange={onChangeHandler} 
                  value={formData.street} 
                  type="text" 
                  name='street' 
                  placeholder='Rua, número e complemento' 
                  className='w-full px-4 py-3 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all duration-300 bg-white/50 backdrop-blur-sm' 
                  required 
                />
              </div>
              
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-navy mb-2'>Cidade</label>
                  <input 
                    onChange={onChangeHandler} 
                    value={formData.city} 
                    type="text" 
                    name='city' 
                    placeholder='São Paulo' 
                    className='w-full px-4 py-3 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all duration-300 bg-white/50 backdrop-blur-sm' 
                    required 
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-navy mb-2'>Estado</label>
                  <input 
                    onChange={onChangeHandler} 
                    value={formData.state} 
                    type="text" 
                    name='state' 
                    placeholder='SP' 
                    className='w-full px-4 py-3 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all duration-300 bg-white/50 backdrop-blur-sm' 
                    required 
                  />
                </div>
              </div>
              
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-navy mb-2'>CEP</label>
                  <input 
                    onChange={onChangeHandler} 
                    value={formData.zipcode} 
                    type="text" 
                    name='zipcode' 
                    placeholder='00000-000' 
                    className='w-full px-4 py-3 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all duration-300 bg-white/50 backdrop-blur-sm' 
                    required 
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-navy mb-2'>País</label>
                  <input 
                    onChange={onChangeHandler} 
                    value={formData.country} 
                    type="text" 
                    name='country' 
                    placeholder='Brasil' 
                    className='w-full px-4 py-3 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all duration-300 bg-white/50 backdrop-blur-sm' 
                    required 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className='flex flex-1 flex-col gap-8'>
            <CartTotal />
            
            {/* Payment method */}
            <div className='bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 p-8 shadow-lg hover:shadow-xl transition-all duration-300'>
              <h3 className='h3 text-navy mb-6'>Forma de <span className='bg-gradient-to-r from-secondary to-tertiary bg-clip-text text-transparent'>Pagamento</span></h3>
              <div className='space-y-4'>
                <div 
                  onClick={() => setMethod('stripe')} 
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    method === 'stripe' 
                      ? 'border-secondary bg-gradient-to-r from-secondary/10 to-tertiary/10 shadow-lg' 
                      : 'border-gray-200/50 bg-white/50 hover:border-secondary/50 hover:bg-secondary/5'
                  }`}
                >
                  <div className='flex items-center gap-3'>
                    <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                      method === 'stripe' ? 'border-secondary bg-secondary' : 'border-gray-300'
                    }`}>
                      {method === 'stripe' && <div className='w-full h-full bg-white rounded-full scale-50'></div>}
                    </div>
                    <span className={`font-medium transition-colors duration-300 ${
                      method === 'stripe' ? 'text-secondary' : 'text-tertiary'
                    }`}>Cartão de Crédito</span>
                  </div>
                  <p className='text-sm text-tertiary/70 mt-2 ml-8'>Pagamento seguro via Stripe</p>
                </div>
                
                <div 
                  onClick={() => setMethod('cod')} 
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    method === 'cod' 
                      ? 'border-secondary bg-gradient-to-r from-secondary/10 to-tertiary/10 shadow-lg' 
                      : 'border-gray-200/50 bg-white/50 hover:border-secondary/50 hover:bg-secondary/5'
                  }`}
                >
                  <div className='flex items-center gap-3'>
                    <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                      method === 'cod' ? 'border-secondary bg-secondary' : 'border-gray-300'
                    }`}>
                      {method === 'cod' && <div className='w-full h-full bg-white rounded-full scale-50'></div>}
                    </div>
                    <span className={`font-medium transition-colors duration-300 ${
                      method === 'cod' ? 'text-secondary' : 'text-tertiary'
                    }`}>Dinheiro na Entrega</span>
                  </div>
                  <p className='text-sm text-tertiary/70 mt-2 ml-8'>Pague no momento da entrega</p>
                </div>
              </div>
            </div>
            
            <button 
              type='submit' 
              className='w-full bg-gradient-to-r from-secondary to-tertiary hover:from-tertiary hover:to-accent text-white py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold text-lg'
            >
              Finalizar Pedido
            </button>
          </div>
        </div>
      </form>

      <Footer />
    </section>
  )
}

export default PlaceOrder