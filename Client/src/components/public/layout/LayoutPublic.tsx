import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import Footer from './footer/Footer';
import HeaderTop from './header/HeaderTop';
import Header from './header/Header';

const LayoutPublic = () => {
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollBtn(true);
      } else {
        setShowScrollBtn(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  return (
    <>
      <header>
        <HeaderTop />
        <Header />
      </header>
      <main>
        <Outlet />
      </main>
      <Footer />
      {showScrollBtn && (
        <div className="fp__scroll_btn" onClick={scrollToTop}>
          go to top
        </div>
      )}
    </>
  );
};

export default LayoutPublic;
