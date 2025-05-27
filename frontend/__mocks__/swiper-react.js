// Mock for swiper/react
const Swiper = ({ children }) => <div className="swiper-container">{children}</div>;
const SwiperSlide = ({ children }) => <div className="swiper-slide">{children}</div>;

module.exports = {
  Swiper,
  SwiperSlide
};
