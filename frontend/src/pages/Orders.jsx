import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import Title from '../components/Title'
import Footer from '../components/Footer'

const Orders = () => {

  const { backendUrl, token, currency } = useContext(ShopContext)
  const [orderData, setOrderData] = useState([])

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null
      }
      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } })
      if (response.data.success) {
        let allOrdersItem = []
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            allOrdersItem.push(item)
          })
        })
        setOrderData(allOrdersItem.reverse())
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadOrderData()
  }, [token])
  return (
    <section className='min-h-screen bg-gradient-to-br from-cream/20 via-white to-primary/10'>
      <div className='max-padd-container pt-32 pb-20'>
        {/* Título */}
        <Title title1={'Lista de'} title2={'Pedidos'} title1Styles={'h3'} />
        
        {/* Container */}
        <div className='mt-12 space-y-6'>
          {orderData.length > 0 ? (
            orderData.map((item, i) => (
              <div key={i} className='bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6 rounded-2xl group'>
                <div className='flex gap-x-6'>
                  {/* Imagem */}
                  <div className='flex-shrink-0'>
                    <div className='relative overflow-hidden rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300'>
                      <img src={item.image} alt="orderItemImg" width={80} height={100} className='object-cover aspect-[4/5] rounded-xl group-hover:scale-105 transition-transform duration-300' />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                    </div>
                  </div>
                  
                  {/* Informações do pedido */}
                  <div className='flex-1 min-w-0'>
                    <h5 className='h5 capitalize line-clamp-1 text-navy group-hover:text-secondary transition-colors duration-300 mb-4'>{item.name}</h5>
                    
                    <div className='space-y-4'>
                      {/* Preço e quantidade */}
                      <div className='flex flex-wrap gap-4'>
                        <div className='bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-2 rounded-xl border border-gray-200/50'>
                          <span className='text-sm font-medium text-tertiary'>Preço: </span>
                          <span className='font-semibold text-navy'>{currency}{item.price}</span>
                        </div>
                        <div className='bg-gradient-to-r from-secondary/10 to-tertiary/10 px-4 py-2 rounded-xl border border-gray-200/50'>
                          <span className='text-sm font-medium text-tertiary'>Quantidade: </span>
                          <span className='font-semibold text-navy'>{item.quantity}</span>
                        </div>
                        <div className='bg-gradient-to-r from-tertiary/10 to-accent/10 px-4 py-2 rounded-xl border border-gray-200/50'>
                          <span className='text-sm font-medium text-tertiary'>Pagamento: </span>
                          <span className='font-semibold text-navy'>{item.paymentMethod}</span>
                        </div>
                      </div>
                      
                      {/* Data */}
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-medium text-tertiary'>Data do Pedido: </span>
                        <span className='text-tertiary'>{new Date(item.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status e botão */}
                  <div className='flex flex-col gap-4 items-end'>
                    <div className='flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-200/50 shadow-sm'>
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === 'Pendente' ? 'bg-yellow-400' :
                        item.status === 'Processando' ? 'bg-blue-400' :
                        item.status === 'Enviado' ? 'bg-orange-400' :
                        item.status === 'Entregue' ? 'bg-green-400' : 'bg-secondary'
                      } animate-pulse`}></div>
                      <p className='font-medium text-navy'>{item.status}</p>
                    </div>
                    <button 
                      onClick={loadOrderData} 
                      className='bg-gradient-to-r from-secondary to-tertiary hover:from-tertiary hover:to-accent text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-medium text-sm'
                    >
                      Rastrear Pedido
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='flexCenter flex-col gap-6 py-20'>
              <div className='w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flexCenter'>
                <div className='text-4xl text-gray-400'>📦</div>
              </div>
              <div className='text-center'>
                <h3 className='h3 text-navy mb-2'>Nenhum pedido encontrado</h3>
                <p className='text-tertiary mb-6'>Você ainda não fez nenhum pedido. Explore nossa loja e encontre livros incríveis!</p>
                <button onClick={() => window.location.href = '/shop'} className='btn-outline'>
                  Ir às Compras
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </section>
  )
}

export default Orders
