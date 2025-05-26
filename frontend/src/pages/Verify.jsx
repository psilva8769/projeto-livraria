import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const Verify = () => {

  const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext)
  const [searchParams, setSearchParams] = useSearchParams()
  const [isVerifying, setIsVerifying] = useState(true)
  const [verificationStatus, setVerificationStatus] = useState('processing')

  const success = searchParams.get('success')
  const orderId = searchParams.get('orderId')

  // verificar pagamento (Apenas para fins de teste. O método seguro é usando webhook, mas é um processo longo e não pode ser coberto em um único tutorial)
  const verifyPayment = async () => {
    try {
      if (!token) {
        setVerificationStatus('error')
        setIsVerifying(false)
        return null
      }
      
      const response = await axios.post(backendUrl + '/api/order/verifystripe', { success, orderId }, { headers: { token } })
      
      if (response.data.success) {
        setVerificationStatus('success')
        setCartItems({})
        setTimeout(() => {
          navigate('/orders')
        }, 2000)
      } else {
        setVerificationStatus('error')
        setTimeout(() => {
          navigate('/')
        }, 3000)
      }
    } catch (error) {
      console.log(error)
      setVerificationStatus('error')
      toast.error(error.message)
      setTimeout(() => {
        navigate('/')
      }, 3000)
    } finally {
      setIsVerifying(false)
    }
  }

  useEffect(()=>{
    verifyPayment()
  }, [token])

  return (
    <section className='min-h-screen bg-gradient-to-br from-cream/20 via-white to-primary/10 flexCenter'>
      <div className='max-padd-container flexCenter'>
        <div className='bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 p-12 shadow-xl text-center max-w-md w-full'>
          {isVerifying || verificationStatus === 'processing' ? (
            <>
              <div className='w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-secondary to-tertiary rounded-full flexCenter'>
                <div className='w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin'></div>
              </div>
              <h2 className='h2 text-navy mb-4'>Verificando Pagamento</h2>
              <p className='text-tertiary leading-relaxed'>
                Aguarde enquanto verificamos seu pagamento. Isso pode levar alguns segundos...
              </p>
            </>
          ) : verificationStatus === 'success' ? (
            <>
              <div className='w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flexCenter'>
                <svg className='w-10 h-10 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
                </svg>
              </div>
              <h2 className='h2 text-navy mb-4'>Pagamento Confirmado!</h2>
              <p className='text-tertiary leading-relaxed mb-6'>
                Seu pagamento foi processado com sucesso. Você será redirecionado para seus pedidos em breve.
              </p>
              <div className='w-full bg-gray-200 rounded-full h-2'>
                <div className='bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full animate-pulse' style={{width: '100%'}}></div>
              </div>
            </>
          ) : (
            <>
              <div className='w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-400 to-red-600 rounded-full flexCenter'>
                <svg className='w-10 h-10 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </div>
              <h2 className='h2 text-navy mb-4'>Erro na Verificação</h2>
              <p className='text-tertiary leading-relaxed mb-6'>
                Houve um problema ao verificar seu pagamento. Você será redirecionado para a página inicial.
              </p>
              <div className='w-full bg-gray-200 rounded-full h-2'>
                <div className='bg-gradient-to-r from-red-400 to-red-600 h-2 rounded-full animate-pulse' style={{width: '100%'}}></div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default Verify
