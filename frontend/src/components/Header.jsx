import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import Navbar from './Navbar'
import { CgMenuLeft } from "react-icons/cg"
import { TbUserCircle } from "react-icons/tb"
import { RiUserLine, RiShoppingBag4Line } from "react-icons/ri"
import { ShopContext } from '../context/ShopContext'

const Header = () => {
    const { token, setToken, getCartCount, setCartItems, navigate } = useContext(ShopContext)
    const [active, setActive] = useState(false)
    const [menuOpened, setMenuOpened] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)

    const toggleMenu = () => {
        setMenuOpened((prev) => !prev)
        if (userMenuOpen) {
            setUserMenuOpen(false)
        }
    }

    const toggleUserMenu = () => {
        setUserMenuOpen((prev) => !prev)
        if (menuOpened) {
            setMenuOpened(false)
        }
    }

    const logout = () => {
        navigate('/login')
        localStorage.removeItem('token')
        setToken('')
        setCartItems({})
        setUserMenuOpen(false)
    }

    const handleOrdersClick = () => {
        navigate('/orders')
        setUserMenuOpen(false)
    }

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0 && (menuOpened || userMenuOpen)) {
                setMenuOpened(false)
                setUserMenuOpen(false)
            }
            setActive(window.scrollY > 30)
        }

        const handleClickOutside = (event) => {
            const userMenu = document.querySelector('[data-testid="user-menu-dropdown"]')
            const userMenuButton = document.querySelector('[data-testid="user-menu"]')
            const mobileMenu = document.querySelector('[data-testid="mobile-menu"]')
            const menuButton = document.querySelector('[data-testid="menu-icon"]')
            
            if (!userMenuButton?.contains(event.target) && !userMenu?.contains(event.target)) {
                setUserMenuOpen(false)
            }
            if (!menuButton?.contains(event.target) && !mobileMenu?.contains(event.target)) {
                setMenuOpened(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        window.addEventListener("scroll", handleScroll)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            window.removeEventListener("scroll", handleScroll)
        }
    }, [menuOpened, userMenuOpen])

    return (
        <header data-testid="header" className='fixed top-0 w-full left-0 right-0 z-50'>
            <div data-testid="header-container" className={`${active ? 'bg-white py-2.5' : 'bg-primary py-3'} max-padd-container flexBetween border-b border-slate-900/10 rounded transition-all duration-300`}>
                {/* Logo */}
                <Link to={'/'} data-testid="header-logo-link" className='flex-1 flex items-center justify-start'>
                    <img 
                        data-testid="header-logo"
                        src={logo}
                        alt="logo"
                        className='h-10 object-contain'
                    />
                    <h1 data-testid="header-title" className="ml-2 text-xl font-semibold">Boto Books</h1>
                </Link>

                {/* Navigation */}
                <nav data-testid="header-nav">
                    <Navbar menuOpened={menuOpened} toggleMenu={toggleMenu} />
                </nav>

                {/* Right Side Navigation */}
                <div data-testid="header-actions" className="flex-1 flex items-center justify-end gap-4">
                    {/* Cart Icon */}
                    <Link to={'/cart'} className="relative">
                        <RiShoppingBag4Line className="text-2xl" />
                        <span data-testid="cart-count" className="absolute -top-2 -right-2 bg-secondary text-primary h-5 w-5 rounded-full flexCenter text-sm">
                            {getCartCount()}
                        </span>
                    </Link>

                    {/* Menu Toggle */}
                    <button
                        data-testid="menu-icon"
                        onClick={toggleMenu}
                        className="lg:hidden text-2xl"
                        aria-label="Toggle menu"
                    >
                        <CgMenuLeft />
                    </button>

                    {/* User Authentication */}
                    {token ? (
                        <div className="relative">
                            <button
                                data-testid="user-menu"
                                onMouseEnter={() => setUserMenuOpen(true)}
                                onClick={() => setUserMenuOpen(prev => !prev)}
                                className="text-2xl"
                                aria-label="User menu"
                            >
                                <TbUserCircle data-testid="user-circle-icon" />
                            </button>
                            {userMenuOpen && (
                                <div 
                                    data-testid="user-menu-dropdown"
                                    className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20"
                                    onMouseLeave={() => setUserMenuOpen(false)}
                                >
                                    <button
                                        data-testid="orders-link"
                                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                        onClick={handleOrdersClick}
                                    >
                                        Orders
                                    </button>
                                    <button
                                        data-testid="logout-button"
                                        onClick={logout}
                                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" data-testid="login-button" className="text-2xl">
                            <RiUserLine />
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpened && (
                <div data-testid="mobile-menu" className="lg:hidden fixed inset-0 z-50 bg-white">
                    <div className="p-4">
                        <button
                            data-testid="close-menu-button"
                            onClick={toggleMenu}
                            className="absolute top-4 right-4 text-2xl"
                            aria-label="Close menu"
                        >
                            ×
                        </button>
                        <Navbar menuOpened={menuOpened} toggleMenu={toggleMenu} />
                    </div>
                </div>
            )}
        </header>
    )
}

export default Header
