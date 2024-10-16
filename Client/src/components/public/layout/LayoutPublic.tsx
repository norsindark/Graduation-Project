import { useEffect, useState, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Footer from './footer/Footer';
import HeaderTop from './header/HeaderTop';
import Header from './header/Header';
import RegisterModal from '../../../pages/public/RegisterModal';
import LoginModal from '../../../pages/public/LoginModal';
import ForgotPassword from '../../../components/public/auth/forgotpassword/ForgotPassword';
import ResetPassword from '../../../components/public/auth/resetpassword/ResetPassword';
import ResendVerifyEmail from '../../../components/public/auth/resendverifyemail/ResendVerifyEmail';
import VerifyEmail from '../../../components/public/auth/verifyemail/VerifyEmail';
import Account from '../../../components/public/auth/account/Account';

export interface LayoutContextType {
  openModal: (modalName: string | null) => void;
  closeModal: () => void;
  activeModal: string | null;
}

const LayoutPublic = () => {
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const location = useLocation();

  const handleScroll = useCallback(() => {
    const position = window.scrollY;
    setShowScrollBtn(position > 200);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const openModal = useCallback((modalName: string | null) => {
    if (modalName === null) {
      closeModal();
      return;
    }
    setActiveModal(modalName);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    document.body.style.overflow = '';
  }, []);

  const layoutContext: LayoutContextType = {
    openModal,
    closeModal,
    activeModal,
  };

  return (
    <>
      <header>
        <HeaderTop />
        <Header setActiveModal={openModal} />
      </header>
      <main>
        <Outlet context={layoutContext} />
      </main>
      <Footer />
      {showScrollBtn && (
        <div className="fp__scroll_btn" onClick={scrollToTop}>
          go to top
        </div>
      )}
      {activeModal === 'register' && (
        <RegisterModal onClose={closeModal} setActiveModal={openModal} />
      )}
      {activeModal === 'login' && (
        <LoginModal onClose={closeModal} setActiveModal={openModal} />
      )}
      {activeModal === 'forgotPassword' && (
        <ForgotPassword onClose={closeModal} setActiveModal={openModal} />
      )}
      {activeModal === 'resetPassword' && (
        <ResetPassword onClose={closeModal} setActiveModal={openModal} />
      )}
      {activeModal === 'resendVerifyEmail' && (
        <ResendVerifyEmail onClose={closeModal} setActiveModal={openModal} />
      )}
      {activeModal === 'verifyEmail' && (
        <VerifyEmail onClose={closeModal} setActiveModal={openModal} />
      )}
      {activeModal === 'account' && (
        <Account onClose={closeModal} setActiveModal={openModal} />
      )}
    </>
  );
};

export default LayoutPublic;
