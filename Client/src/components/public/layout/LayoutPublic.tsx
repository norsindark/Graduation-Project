import { useEffect, useState, useCallback, useRef } from 'react';
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
import FullPageLoading from '../../Loading/FullPageLoading';

export interface LayoutContextType {
  openModal: (modalName: string | null) => void;
  closeModal: () => void;
  activeModal: string | null;
  editingAddressId: string | null;
}

const LayoutPublic = () => {
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const location = useLocation();
  const scrollPosition = useRef(0);
  const [isPageLoading, setIsPageLoading] = useState(false);

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
    scrollPosition.current = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition.current}px`;
    document.body.style.width = '100%';
    setActiveModal(modalName);
  }, []);

  const closeModal = useCallback(() => {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollPosition.current);
    setActiveModal(null);
  }, []);

  const layoutContext: LayoutContextType = {
    openModal,
    closeModal,
    activeModal,
    editingAddressId: null,
  };

  useEffect(() => {
    setIsPageLoading(true);
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsPageLoading(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <header>
        <HeaderTop />
        <Header setActiveModal={openModal} />
      </header>
      <main>
        {isPageLoading ? (
          <FullPageLoading />
        ) : (
          <Outlet context={layoutContext} />
        )}
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
        <Account
          onClose={closeModal}
          setActiveModal={openModal}
          initialActiveTab={activeModal}
          editingAddressId={null}
        />
      )}
    </>
  );
};

export default LayoutPublic;
