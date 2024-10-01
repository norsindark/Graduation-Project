import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BannerSlider from '../../components/public/slider/BannerSlider';
import WhyChoose from '../../components/public/whychoose/WhyChoose';
const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
      <WhyChoose />
    </>
  );
};

export default HomePage;
