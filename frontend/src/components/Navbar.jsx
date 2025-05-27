import React from 'react'
import { TbHomeFilled } from 'react-icons/tb'
import { IoLibrary, IoMailOpen } from "react-icons/io5"
import { FaRegWindowClose } from "react-icons/fa"
import { Link, NavLink } from 'react-router-dom'

const Navbar = ({ containerStyles, toggleMenu, menuOpened }) => {
    const navItems = [
        { to: '/', label: 'Início', icon: <TbHomeFilled /> },
        { to: '/shop', label: 'Loja', icon: <IoLibrary /> },
        { to: 'mailto:info@bacala.com', label: 'Contato', icon: <IoMailOpen /> },
    ]

    return (
        <nav className={containerStyles}>
            {/* close button inside navbar */}
            {menuOpened && (
                <>
                    <FaRegWindowClose onClick={toggleMenu} className='text-xl self-end cursor-pointer relative left-8 text-secondary hover:text-accent transition-colors' />
                    {/* logo */}
                    <Link to={'/'} className='bold-24 mb-10'>
                        <h4 className='bg-gradient-to-r from-secondary to-navy bg-clip-text text-transparent'>Bacala</h4>
                    </Link>
                </>
            )}
            {navItems.map(({ to, label, icon }) => (
                <div key={label} className='inline-flex relative top-1'>
                    {/* For "Contato" item use <a> tag instead of NavLink to ensure it works properly */}
                    {to.startsWith('mailto') ? (
                        <a onClick={menuOpened ? toggleMenu : undefined} href={to} className='flexCenter gap-x-2 text-tertiary hover:text-secondary transition-all duration-300 px-3 py-2 rounded-lg hover:bg-muted'>
                            <span className='text-xl'>{icon}</span>
                            <span className='medium-16'>{label}</span>
                        </a>
                    ) : (
                        <NavLink to={to} className={({ isActive }) => 
                            isActive 
                                ? "active-link flexCenter gap-x-2 text-secondary bg-secondaryOne/10 px-3 py-2 rounded-lg" 
                                : "flexCenter gap-x-2 text-tertiary hover:text-secondary transition-all duration-300 px-3 py-2 rounded-lg hover:bg-muted"
                        }>
                            <span className='text-xl'>{icon}</span>
                            <span className='medium-16'>{label}</span>
                        </NavLink>)
                    }
                </div>
            ))}
        </nav>
    )
}

export default Navbar
