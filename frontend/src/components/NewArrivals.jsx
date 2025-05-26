import React, { useContext, useEffect, useState } from 'react'
import Title from './Title'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from "swiper/modules"
import Item from './Item';
import { ShopContext } from '../context/ShopContext';

const NewArrivals = () => {

    const {books} = useContext(ShopContext)
    const [newArrivals, setNewArrivals] = useState([])

    // Extrai os primeiros livros novos como novidades
    useEffect(()=>{
        const data = books.slice(0, 7);
        setNewArrivals(data.reverse())
    }, [books])

    return (
        <section className='max-padd-container py-20 relative'>
            <div className='absolute inset-0 bg-gradient-to-tr from-secondary/5 via-transparent to-tertiary/10 rounded-3xl'></div>
            
            <div className='relative z-10'>
                <Title title1={'Novos'} title2={'Lançamentos'} titleStyles={'pb-16'} paraStyles={'!block'} />
                
                {/* Swiper container */}
                <div className='relative'>
                    <Swiper
                        autoplay={{
                            delay: 3500,
                            disableOnInteraction: false
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true
                        }}
                        breakpoints={{
                            400: {
                                slidesPerView: 2,
                                spaceBetween: 20
                            },
                            700: {
                                slidesPerView: 3,
                                spaceBetween: 30
                            },
                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 30
                            },
                            1200: {
                                slidesPerView: 5,
                                spaceBetween: 30
                            },
                        }}
                        // Add swiper modules
                        modules={[Pagination, Autoplay]}
                        className='h-[455px] sm:h-[488px] xl:h-[499px] mt-8 pb-12'
                    >
                        {newArrivals.map((book, index)=>(
                            <SwiperSlide key={book._id}>
                                <div className={`animate-slideInRight opacity-0 [animation-fill-mode:forwards]`} style={{animationDelay: `${index * 0.1}s`}}>
                                    <Item book={book}/>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    
                    {/* Decorative gradient overlay */}
                    <div className='absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-secondary/20 to-transparent rounded-full blur-2xl'></div>
                    <div className='absolute bottom-0 -left-8 w-20 h-20 bg-gradient-to-br from-tertiary/20 to-transparent rounded-full blur-xl'></div>
                </div>
            </div>
        </section>
    )
}

export default NewArrivals