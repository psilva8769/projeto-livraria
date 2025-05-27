import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Verify = () => {
  const { navigate, backendUrl } = useContext(ShopContext)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)
    
    try {      const response = await axios.post(backendUrl + '/api/user/verify', { code })
      if (response.data.success) {
        setSuccess('Verification successful')
        toast.success('Email verified successfully')
        navigate('/login')
      } else {
        setError(response.data.message || 'Verification failed')
        toast.error(response.data.message || 'Verification failed')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Verification failed'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setError('')
    setSuccess('')
    setIsLoading(true)
    
    try {
      const response = await axios.post(backendUrl + '/api/user/resend-code')
      if (response.data.success) {
        setSuccess('Verification code resent')
        toast.success('Verification code resent successfully')
      } else {
        setError(response.data.message || 'Failed to resend code')
        toast.error(response.data.message || 'Failed to resend code')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to resend code'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
<section data-testid="verify-page" className='absolute top-0 left-0 h-full w-full z-50 bg-white'>
      <div className='flexCenter h-full'>
        <form data-testid="verify-form" onSubmit={handleVerify} className='flex flex-col items-center w-[90%] sm:max-w-md gap-y-5'>
          <div className='w-full text-center mb-4'>
            <h3 data-testid="verify-title" className='bold-36'>Verify Email</h3>
            <p className='regular-16 text-gray-30'>Enter the verification code sent to your email</p>
          </div>

          {error && (
            <div data-testid="error-message" className="w-full text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          {success && (
            <div data-testid="success-message" className="w-full text-green-500 text-sm text-center">
              {success}
            </div>
          )}

          <div className='w-full'>
            <input 
              data-testid="code-input"
              type="text" 
              placeholder="Enter verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className='w-full px-3 py-2 ring-1 ring-slate-900/10 rounded bg-primary'
              required
            />
          </div>

          <button
            data-testid="verify-button"
            type="submit"
            disabled={isLoading}
            className='btn-dark w-full mt-2 !py-[7px] !rounded disabled:opacity-50'
          >
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </button>

          <button
            data-testid="resend-button"
            type="button"
            onClick={handleResend}
            disabled={isLoading}
            className='underline text-gray-600 hover:text-secondaryOne disabled:opacity-50'
          >
            Resend verification code
          </button>
        </form>
      </div>
    </section>
  )
}

export default Verify
