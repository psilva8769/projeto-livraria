import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import { FOOTER_CONTACT_INFO, FOOTER_LINKS, SOCIALS } from '../assets/data'
import { FaFacebook, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  const renderSocialIcon = (icon) => {
    switch(icon) {
      case 'facebook':
        return <FaFacebook />;
      case 'twitter':
        return <FaTwitter />;
      default:
        return null;
    }
  }

  return (
<footer data-testid="footer-container" className='mb-4'>
      <div data-testid="footer-header" className='rounded-tl-3xl rounded-tr-3xl pt-12 xl:pt-20 pb-8'>
        <h3 className='h3'>Discover books that ignite your imagination</h3>
        <p data-testid="footer-main-description">
          Explore our vast collection of books across all genres. Find your next favorite read today.
        </p>
        <hr className='my-8 bg-slate-900/30 h-[2px]' />
        {/* container */}
        <div className='flex justify-between flex-wrap gap-2'>
          <div className='max-w-sm'>
            {/* logo */}
            <Link to={'/'} className='flex-1 flex items-center justify-start'>
              <img 
                data-testid="footer-logo"
                src={logo} 
                alt="Logo" 
                height={36} 
                width={36} 
                className='mr-2' 
              />
              <h4 className='bold-24'>Bacala</h4>
            </Link>
            <p className='py-4'>
              Join our community of book lovers and stay updated with the latest releases and special offers.
            </p>
            <form onSubmit={(e) => {
              e.preventDefault();
              e.target.elements.email.value = '';
            }}>
              <div data-testid="email-container" className='flexBetween pl-3 h-[3rem] bg-primary w-full max-w-[333px] rounded-full ring-1 ring-slate-500/5 mb-4'>
                <input 
                  type="email"
                  name="email"
                  placeholder='Enter your email' 
                  className='bg-transparent border-none outline-none'
                />
                <button type="submit" className='btn-secondaryOne relative right-[24px]'>Subscribe</button>
              </div>
            </form>
          </div>
          <div className='flex justify-between flex-wrap gap-8'>
            {FOOTER_LINKS.map((col) => (
              <FooterColumn key={col.title} title={col.title}>
                <ul className='flex flex-col gap-4 regular-14 text-gray-20'>
                  {col.links.map((link) => (
                    <Link to='/' key={link} data-discover="true">{link}</Link>
                  ))}
                </ul>
              </FooterColumn>
            ))}
            <div className='flex flex-col gap-5'>
              <FooterColumn title={FOOTER_CONTACT_INFO.title}>
                {FOOTER_CONTACT_INFO.links.map((link) => (
                  <Link to='/' key={link.label} data-discover="true" className='flex gap-4 md:flex-col lg:flex-row'>
                    <p>{link.label}:</p>
                    <p className='bold-15'>{link.value}</p>
                  </Link>
                ))}
              </FooterColumn>
            </div>
            <div className='flex'>
              <FooterColumn title={SOCIALS.title}>
                <ul data-testid="social-icons" className='flex gap-4'>
                  {SOCIALS.links.map((link) => (
                    <Link to='/' key={link.id} data-discover="true" className='text-xl'>
                      {renderSocialIcon(link.icon)}
                    </Link>
                  ))}
                </ul>
              </FooterColumn>
            </div>
          </div>
        </div>
      </div>
      {/* copyrights */}
      <div data-testid="footer-copyright" className='text-white bg-tertiary medium-14 py-2 px-8 rounded flexBetween'>
        <span>2025 Bacala</span>
        <span>All rights reserved</span>
      </div>
    </footer>
  )
}

export default Footer


const FooterColumn = ({ title, children }) => {
  return (
    <div className='flex flex-col gap-5'>
      <h4 className='bold-18 whitespace-nowrap'>{title}</h4>
      {children}
    </div>
  )
}