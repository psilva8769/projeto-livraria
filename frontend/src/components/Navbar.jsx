import React, { useContext } from 'react'
import { TbX } from 'react-icons/tb'
import { Link } from 'react-router-dom'
import { NAV_LINKS } from '../assets/data'
import { ShopContext } from '../context/ShopContext'

const Navbar = ({ 
    toggleMenu, 
    menuOpened, 
    links = NAV_LINKS, 
    activeLink = '',
    containerStyles = ''
}) => {
    const { getCartCount } = useContext(ShopContext);
    
    const navClasses = `${containerStyles} ${
        menuOpened ? 'translate-x-0' : 'translate-x-[100%]'
    }`;

    return (
<nav data-testid="navbar-container" className={navClasses}>
            <div data-testid="nav-links" className='flex flex-col lg:flex-row gap-4 px-4'>
                {links.map(link => (
                    <Link
                        key={link.id}
                        to={link.path}
                        data-testid={`nav-link-${link.name.toLowerCase()}`}
                        className={`nav-link ${activeLink === link.name ? 'active' : ''}`}
                        onClick={menuOpened ? toggleMenu : undefined}
                    >
                        {link.name}
                        {link.path === '/cart' && (
                            <span 
                                data-testid="cart-count"
                                className="ml-2 bg-secondary text-white rounded-full px-2 py-1 text-xs"
                            >
                                {getCartCount()}
                            </span>
                        )}
                    </Link>
                ))}
            </div>
        </nav>
    )
}

Navbar.defaultProps = {
    links: NAV_LINKS,
    activeLink: '',
    containerStyles: '',
    menuOpened: false,
    toggleMenu: () => {}
}

export default Navbar
