import { FaFacebook, FaTwitter } from 'react-icons/fa';

export const FOOTER_LINKS = [
  {
    title: 'Company',
    links: ['About Us', 'Careers', 'Blog']
  },
  {
    title: 'Help',
    links: ['FAQs', 'Shipping', 'Returns']
  }
];

export const FOOTER_CONTACT_INFO = {
  title: 'Contact Us',
  links: [
    { label: 'Phone', value: '+1 234 567 890' },
    { label: 'Email', value: 'support@bacala.com' }
  ]
};

export const SOCIALS = {
  title: 'Social Media',  links: [
    { id: 1, icon: 'facebook' },
    { id: 2, icon: 'twitter' }
  ]
};

export const categories = [
  {
    name: 'fiction',
    image: '/images/fiction.png'
  },
  {
    name: 'business',
    image: '/images/business.png'
  },
  {
    name: 'children',
    image: '/images/children.png'
  },
  {
    name: 'academic',
    image: '/images/academic.png'
  }
];

export const NAV_LINKS = [
  { id: 1, name: 'Home', path: '/' },
  { id: 2, name: 'Shop', path: '/shop' },
  { id: 3, name: 'About', path: '/about' },
  { id: 4, name: 'Contact', path: '/contact' }
];
