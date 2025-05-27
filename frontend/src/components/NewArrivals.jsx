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
    const { books } = useContext(ShopContext)
    const [newArrivals, setNewArrivals] = useState([])

    // Extract the last 7 books as new arrivals (most recent first)
    useEffect(() => {
        if (books && books.length > 0) {
            const data = books.slice(-7);
            setNewArrivals(data.reverse());
        } else {
            setNewArrivals([]);
        }
    }, [books])

    return (
        <section data-testid="new-arrivals-section" className='max-padd-container py-16 bg-white'>
            <div data-testid="new-arrivals-title" className="pb-10">
                <Title 
                    title1={'New'} 
                    title2={'Arrivals'} 
                    titleStyles={'pb-1'}
                    title1Styles={'h2'}
                    paraStyles={'!block'}
                    para={'From timeless classics to modern masterpieces'}
                />
            </div>
            {newArrivals.length > 0 && (
                <div data-testid="new-arrivals-slider">
                    <Swiper
                        data-testid="new-arrivals-swiper"
                        autoplay={{
                            delay: 3500,
                            disableOnInteraction: false
                        }}
                        pagination={{
                            clickable: true,
                            el: '[data-testid="swiper-pagination"]'
                        }}
                        breakpoints={{
                            400: {
                                slidesPerView: 2,
                                spaceBetween: 30
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
                        modules={[Pagination, Autoplay]}
                        className='h-[455px] sm:h-[488px] xl:h-[499px] mt-5'
                    >
                        {newArrivals.map((book, index) => (
                            <SwiperSlide 
                                key={book._id}
                                data-testid={`new-arrival-slide-${index}`}
                            >
                                <div data-testid={`new-arrival-item-${index}`}>
                                    <Item book={book} />
                                </div>
                            </SwiperSlide>
                        ))}
                        <div 
                            data-testid="swiper-pagination" 
                            className="swiper-pagination"
                        />
                    </Swiper>
                </div>
            )}
            {newArrivals.length === 0 && (
                <div data-testid="no-new-arrivals" className="text-center py-8">
                    No new arrivals at the moment
                </div>
            )}
        </section>
    )
}

export default NewArrivals
