import React, { useContext, useEffect, useState } from 'react'
import loginImg from "../assets/login.png"
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
  const { token, setToken, setUser, navigate, backendUrl } = useContext(ShopContext)
  const [currState, setCurrState] = useState('Login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const validateForm = () => {
    let isValid = true
    setEmailError('')
    setPasswordError('')

    // Email validation
    if (email) {
      if (!/\S+@\S+\.\S+/.test(email)) {
        setEmailError('Please enter a valid email')
        isValid = false
      }
    } else {
      setEmailError('Email is required')
      isValid = false
    }

    // Password validation
    if (!password) {
      setPasswordError('Password is required')
      isValid = false
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      isValid = false
    }

    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      const endpoint = currState === 'Login' ? '/api/user/login' : '/api/user/register'
      const payload = currState === 'Login' ? { email, password } : { name, email, password }
        
      const response = await axios.post(backendUrl + endpoint, payload)
        if (response.data.success) {
        setToken(response.data.token)
        setUser(response.data.user)
        toast.success(`${currState} successful!`)
        navigate('/')
      } else {
        setError(response.data.message)
        toast.error(response.data.message)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || `${currState} failed`
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }

  useEffect(() => {
    if(token) {
      navigate('/')
    }
  }, [token, navigate])

  return (
<section data-testid="login-page" className="flex gap-8 items-center justify-center min-h-screen bg-white">
      <div className="hidden lg:block flex-1">
        <img
          src={loginImg}
          alt="Login"
          className="w-full h-auto object-cover"
          data-testid="login-image"
        />
      </div>

      <div className="w-full max-w-md p-8">
        <h2 data-testid="login-title" className="text-4xl font-bold mb-6">
          {currState}
        </h2>

        <form data-testid="login-form" onSubmit={handleSubmit} className="space-y-4">
          {currState === 'Sign Up' && (
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                id="name"
                data-testid="name-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-secondary"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              data-testid="email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-secondary"
            />
            {emailError && <p data-testid="email-error" className="text-red-500 mt-1">{emailError}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              id="password"
              data-testid="password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-secondary"
            />
            {passwordError && <p data-testid="password-error" className="text-red-500 mt-1">{passwordError}</p>}
          </div>

          {error && <p data-testid="login-error" className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            data-testid="login-button"
            className="w-full bg-secondary text-white py-2 px-4 rounded-lg hover:opacity-90"
          >
            {currState}
          </button>

          <p className="text-center mt-4">
            {currState === 'Login' ? (
              <>
                Don't have an account?{' '}
                <span
                  onClick={() => setCurrState('Sign Up')}
                  data-testid="signup-link"
                  className="text-secondary cursor-pointer"
                >
                  Sign Up
                </span>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <span
                  onClick={() => setCurrState('Login')}
                  data-testid="login-link"
                  className="text-secondary cursor-pointer"
                >
                  Login
                </span>
              </>
            )}
          </p>
        </form>
      </div>
    </section>
  )
}

export default Login