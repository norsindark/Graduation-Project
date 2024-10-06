import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import BannerSlider from '../../components/public/slider/BannerSlider';
import WhyChoose from '../../components/public/whychoose/WhyChoose';
import DailyOffer from '../../components/public/dailyoffer/DailyOffer';
import MenuHome from '../../components/public/menuhome/MenuHome';
import SlideIntro from '../../components/public/slideintro/SlideIntro';
import Chef from '../../components/public/chef/Chef';
import FeedBack from '../../components/public/feedbacks/FeedBack';
import Counter from '../../components/public/counter/Counter';
import Blogs from '../../components/public/blogs/Blogs';
const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Tạo các ref cho từng phần
  const [whyChooseRef, whyChooseInView] = useInView({ threshold: 0.3 });
  const [dailyOfferRef, dailyOfferInView] = useInView({ threshold: 0.3 });
  const [menuHomeRef, menuHomeInView] = useInView({ threshold: 0.3 });
  const [slideIntroRef, slideIntroInView] = useInView({ threshold: 0.3 });
  const [chefRef, chefInView] = useInView({ threshold: 0.3 });
  const [feedBackRef, feedBackInView] = useInView({ threshold: 0.3 });
  const [counterRef, counterInView] = useInView({ threshold: 0.3 });
  const [blogsRef, blogsInView] = useInView({ threshold: 0.3 });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('access_token');
    if (token) {
      localStorage.setItem('accessToken', token);
      navigate('/');
      window.location.reload();
    }
  }, [location, navigate]);

  return (
    <>
      <BannerSlider />
      <div
        ref={whyChooseRef}
        className={`fade-in ${whyChooseInView ? 'is-visible' : ''}`}
      >
        <WhyChoose />
      </div>
      <div
        ref={dailyOfferRef}
        className={`fade-in ${dailyOfferInView ? 'is-visible' : ''}`}
      >
        <DailyOffer />
      </div>
      <div
        ref={menuHomeRef}
        className={`fade-in ${menuHomeInView ? 'is-visible' : ''}`}
      >
        <MenuHome />
      </div>
      <div
        ref={slideIntroRef}
        className={`fade-in ${slideIntroInView ? 'is-visible' : ''}`}
      >
        <SlideIntro />
      </div>
      <div
        ref={chefRef}
        className={`fade-in ${chefInView ? 'is-visible' : ''}`}
      >
        <Chef />
      </div>
      <div
        ref={feedBackRef}
        className={`fade-in ${feedBackInView ? 'is-visible' : ''}`}
      >
        <FeedBack />
      </div>
      <div
        ref={counterRef}
        className={`fade-in ${counterInView ? 'is-visible' : ''}`}
      >
        <Counter />
      </div>
      <div
        ref={blogsRef}
        className={`fade-in ${blogsInView ? 'is-visible' : ''}`}
      >
        <Blogs />
      </div>
    </>
  );
};

export default HomePage;
