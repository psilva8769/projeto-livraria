import React, { useContext, useEffect, useState } from 'react'
import loginImg from "../assets/login.png"
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {

  const { token, setToken, navigate, backendUrl } = useContext(ShopContext)
  const [currState, setCurrState] = useState('Login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      if (currState === "Sign Up") {
        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password })
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
        } else {
          toast.error(response.data.message)
        }
      }
      else {
        const response = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
        } else {
          toast.error(response.data.message)
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    if(token){
      navigate('/')
    }
  },[token])

  return (
    <section className='absolute top-0 left-0 h-full w-full z-50 bg-gradient-to-br from-primary via-muted to-cream'>
      {/* Container */}
      <div className='flex h-full w-full'>
        {/* Image Side */}
        <div className='w-1/2 hidden sm:block relative'>
          <div className='absolute inset-0 bg-gradient-to-br from-secondary/20 to-navy/20'></div>
          <img src={loginImg} alt="" className='object-cover aspect-square h-full w-full' />
          <div className='absolute inset-0 flexCenter'>
            <div className='text-center text-white p-8'>
              <h2 className='h2 mb-4'>Bem-vindo à Look the Book</h2>
              <p className='text-lg opacity-90'>Sua biblioteca digital moderna</p>
            </div>
          </div>
        </div>
        
        {/* Form Side */}
        <div className='flexCenter w-full sm:w-1/2 p-8'>
          <div className='bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-20/20'>
            <form onSubmit={onSubmitHandler} className='flex flex-col w-full gap-y-6'>
              <div className='text-center mb-6'>
                <h3 className='bold-36 bg-gradient-to-r from-secondary to-navy bg-clip-text text-transparent mb-2'>
                  {currState === "Sign Up" ? "Cadastro" : "Entrar"}
                </h3>
                <p className='text-gray-50'>
                  {currState === "Sign Up" 
                    ? "Crie sua conta e explore nosso catálogo" 
                    : "Acesse sua conta e continue lendo"
                  }
                </p>
              </div>
              
              {currState === "Sign Up" && (
                <div className='w-full'>
                  <label htmlFor="name" className='medium-14 text-tertiary mb-2 block'>
                    Nome completo
                  </label>
                  <input 
                    onChange={(e) => setName(e.target.value)} 
                    value={name} 
                    type="text" 
                    placeholder='Nome' 
                    required
                    className='w-full px-4 py-3 ring-1 ring-gray-20/30 rounded-xl bg-white/80 backdrop-blur-sm mt-1 focus:ring-2 focus:ring-secondary/30 focus:outline-none transition-all duration-300 hover:shadow-md' 
                  />
                </div>
              )}
              
              <div className='w-full'>
                <label htmlFor="email" className='medium-14 text-tertiary mb-2 block'>
                  E-mail
                </label>
                <input 
                  onChange={(e) => setEmail(e.target.value)} 
                  value={email} 
                  type="email" 
                  placeholder='E-mail' 
                  required
                  className='w-full px-4 py-3 ring-1 ring-gray-20/30 rounded-xl bg-white/80 backdrop-blur-sm mt-1 focus:ring-2 focus:ring-secondary/30 focus:outline-none transition-all duration-300 hover:shadow-md' 
                />
              </div>
              
              <div className='w-full'>
                <label htmlFor="password" className='medium-14 text-tertiary mb-2 block'>
                  Senha
                </label>
                <input 
                  onChange={(e) => setPassword(e.target.value)} 
                  value={password} 
                  type="password" 
                  placeholder='Senha' 
                  required
                  className='w-full px-4 py-3 ring-1 ring-gray-20/30 rounded-xl bg-white/80 backdrop-blur-sm mt-1 focus:ring-2 focus:ring-secondary/30 focus:outline-none transition-all duration-300 hover:shadow-md' 
                />
              </div>
              
              <button type='submit' className='w-full bg-gradient-to-r from-secondary to-navy text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] mt-4'>
                {currState === "Sign Up" ? 'Cadastrar' : 'Entrar'}
              </button>
              
              <div className='w-full flex flex-col gap-y-4 medium-14 text-center'>
                <div className='text-secondary hover:text-navy cursor-pointer transition-colors'>
                  Esqueceu sua senha?
                </div>
                {currState === 'Login' ? (
                  <div className='text-gray-50'>
                    Não tem uma conta? <span onClick={() => setCurrState('Sign Up')} className='cursor-pointer text-secondary hover:text-navy transition-colors font-medium'>Criar conta</span>
                  </div>
                ) : (
                  <div className='text-gray-50'>
                    Já tem uma conta? <span onClick={() => setCurrState('Login')} className='cursor-pointer text-secondary hover:text-navy transition-colors font-medium'>Entrar</span>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login