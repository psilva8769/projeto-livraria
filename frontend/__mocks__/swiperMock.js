// Mock for Swiper components
import React from 'react';

export const Swiper = ({ children }) => {
  return <div data-testid="swiper-container">{children}</div>;
};

export const SwiperSlide = ({ children }) => {
  return <div data-testid="swiper-slide">{children}</div>;
};

export default {
  Swiper,
  SwiperSlide
};
