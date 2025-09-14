import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import '../style/NextSection.css';
import { Autoplay } from 'swiper/modules';
const NextSection = () => {
  return (
    <section className="brand-section">
      <Swiper
       spaceBetween={20}
        slidesPerView={3}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        loop={true}
        modules={[Autoplay]}
        className="brand-swiper"
      >
        <SwiperSlide><div className="brand-item">STATON</div></SwiperSlide>
        <SwiperSlide><div className="brand-item">Samuel</div></SwiperSlide>
        <SwiperSlide><div className="brand-item">Northbay</div></SwiperSlide>
        <SwiperSlide><div className="brand-item">Eastwood</div></SwiperSlide>
        <SwiperSlide><div className="brand-item">Genuine</div></SwiperSlide>
        <SwiperSlide><div className="brand-item">BLUELAKE</div></SwiperSlide>
      </Swiper>
    </section>
  );
};

export default NextSection;