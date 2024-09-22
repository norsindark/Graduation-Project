import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Slider from '../../components/public/slider/Slider';
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
      <Slider />
      <WhyChoose />
    </>
  );
};

export default HomePage;
