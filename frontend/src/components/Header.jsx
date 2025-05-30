import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import Navbar from './Navbar'
import { CgMenuLeft } from "react-icons/cg"
import { TbUserCircle } from "react-icons/tb"
import { RiUserLine, RiShoppingBag4Line } from "react-icons/ri"
import { ShopContext } from '../context/ShopContext'


const Header = () => {

    const { navigate, token, setToken, getCartCount, setCartItems } = useContext(ShopContext)
    const [active, setActive] = useState(false)
    const [menuOpened, setMenuOpened] = useState(false)

    const toggleMenu = () => {
        setMenuOpened((prev) => !prev)
    }

    const logout = ()=>{
        navigate('/login')
        localStorage.removeItem('token')
        setToken('')
        setCartItems({})
    }

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                // close the menu if opened when scrolling occurs
                if (menuOpened) {
                    setMenuOpened(false)
                }
            }
            // detect scroll
            setActive(window.scrollY > 30)
        }
        window.addEventListener("scroll", handleScroll)
        // clean up the event listener when component unmounts
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [menuOpened])

    return (
        <header className='fixed top-0 w-full left-0 right-0 z-50'>
            <div className={`${active ? 'bg-white/95 backdrop-blur-sm py-3 shadow-lg' : 'bg-primary/95 backdrop-blur-sm py-4'} max-padd-container flexBetween border-b border-gray-20/20 transition-all duration-300`}>
                {/* logo */}
                <Link to={'/'} className='flex-1 flex items-center justify-start group'>
                    <img src={logo} alt="" height={36} width={36} className='hidden sm:flex mr-3 transition-transform group-hover:scale-110 duration-300' />
                    <h4 className='bold-24 bg-gradient-to-r from-secondary to-navy bg-clip-text text-transparent'>Look the Book</h4>
                </Link>
                
                {/* Navbar */}
                <div className='flex-1'>
                    <Navbar menuOpened={menuOpened} toggleMenu={toggleMenu} containerStyles={`${menuOpened ? "flex flex-col gap-y-16 h-screen w-[222px] absolute left-0 top-0 bg-white z-50 px-10 py-4 shadow-xl" : "hidden xl:flex justify-center gap-x-8 xl:gap-x-14 medium-15 px-2 py-1"}`} />
                </div>
                
                {/* Right side */}
                <div className='flex-1 flex items-center justify-end gap-x-3 sm:gap-x-10'>
                    <CgMenuLeft onClick={toggleMenu} className='text-2xl xl:hidden cursor-pointer text-secondary hover:text-navy transition-colors duration-300' />                    <Link to={'/cart'} className='flex relative group' data-discover="true">
                        <RiShoppingBag4Line className='text-[33px] bg-gradient-to-br from-secondary to-navy text-primary p-1.5 rounded-xl shadow-md group-hover:scale-110 transition-all duration-300' />
                        <span className='bg-secondaryOne text-white ring-2 ring-white medium-14 absolute left-5 -top-2.5 flexCenter w-6 h-6 rounded-full shadow-lg animate-pulse'>{getCartCount()}</span>
                    </Link>
                    <div className='relative group'>
                        <div className=''>
                            {token ? (
                                <div><TbUserCircle className='text-[32px] cursor-pointer text-secondary hover:text-navy transition-colors duration-300' /></div>
                            ) : (
                                <button onClick={()=> navigate('/login')} className='btn-outline flexCenter gap-x-2 hover:shadow-md'>Entrar<RiUserLine /></button>
                            )}
                        </div>
                        {token && <>
                            <ul className='bg-white/95 backdrop-blur-sm p-3 w-40 ring-1 ring-gray-20/30 rounded-xl absolute right-0 top-9 hidden group-hover:flex flex-col regular-14 shadow-xl'>
                                <li onClick={()=> navigate('/orders')} className='p-3 text-tertiary rounded-lg hover:bg-muted cursor-pointer transition-colors duration-200'>Pedidos</li>
                                <li onClick={logout} className='p-3 text-accent rounded-lg hover:bg-red-50 cursor-pointer transition-colors duration-200'>Sair</li>
                            </ul>
                        </>}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header