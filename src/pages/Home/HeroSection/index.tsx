import styles from "./index.module.scss";
import Button from "../../../components/components/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { heroImages } from "../../../data/images";
import { useEffect, useState } from "react";

const HeroSection = () => {

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className={styles.section}>
      <div className={`${styles.container} main-container`}>
        <div className={styles.content_wrapper}>
          {/* <header className={styles.header}>
            <h1 className={`${styles.title}`} style={{ fontWeight: 800 }}>
              unleash your Style
            </h1>
            <h1 className={`${styles.title}`} style={{ fontWeight: 800 }}>
              find your Flow.
            </h1>
          </header>
          <div className={styles.buttons_wrapper}>
            <Button to="/catalog/All" className={styles.button}>
              Shop Now
            </Button>
          </div> */}
          <div className="absolute lg:bottom-20 md:bottom-10 bottom-10 left-5 md:left-10 lg:left-20 z-[98]">
            {/* <div className="lg:text-5xl md:text-3xl text-2xl font-bold uppercase lg:pb-7 md:pb-5 pb-4 text-white">Lorem, ipsum dolor.</div> */}
            <Button className="bg-white font-bold lg:text-2xl text-xl lg:px-8 md:px-5 md:py-2 lg:py-3 px-5 py-2" to="/catalog/All Collections">Shop Now</Button>
          </div>
          <Swiper
            pagination={{
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={true}
            modules={[Pagination, Autoplay]}
            className={` ${styles.imag}`}
          >
            {heroImages.map((items, index) => (
              <SwiperSlide key={index}>
                <img srcSet={isMobile ? items.path2 : items.path} alt={`Slide ${index}`} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
