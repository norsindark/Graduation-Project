import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useState, useEffect, useRef } from 'react';
import { callLogout } from '../../../services/clientApi';
import { doLogoutAction } from '../../../redux/account/accountSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';

const Auth = ({
  setActiveModal,
}: {
  setActiveModal: (modal: string | null) => void;
}) => {
  const style = 'w-[245px] h-[51px]';
  const isAuthenticated = useSelector(
    (state: RootState) => state.account.isAuthenticated
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const user = useSelector((state: RootState) => state.account.user);
  const userRole = user?.role?.name;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [submit, setSubmit] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    try {
      setSubmit(true);
      const res = await callLogout();
      if (res?.status == 200) {
        dispatch(doLogoutAction());
        navigate('/');
        notification.success({
          message: 'Logout success!',
          duration: 5,
          showProgress: true,
        });
      } else {
        notification.error({
          message: 'Logout failed!',
          description: res?.data?.errors?.error || 'Something went wrong!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch {
      notification.error({
        message: 'Logout failed!',
        description: 'Something went wrong!',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setSubmit(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavLinkClick = (event: React.MouseEvent, modalName: string) => {
    event.preventDefault();
    setActiveModal(modalName);
    setIsMenuOpen(false);
  };
  const handleDashboardClick = (event: React.MouseEvent) => {
    event.preventDefault();
    navigate('/dashboard');
    setIsMenuOpen(false);
  };

  const items = [
    {
      label: 'Account management',
      key: 'account',
      link: '/account',
      onClick: (e: React.MouseEvent) => handleNavLinkClick(e, 'account'),
    },
    {
      label: 'Logout',
      key: '/',
      onClick: handleLogout,
      loading: submit,
    },
  ];
  if (userRole === 'ADMIN') {
    items.unshift({
      label: 'Dashboard',
      key: 'dashboard',
      link: '/dashboard',
      onClick: handleDashboardClick,
    });
  }

  return (
    <>
      <div className="navbar-nav md:px-1" ref={menuRef}>
        <li className="nav-item">
          <button className="nav-link mx-1" onClick={toggleMenu}>
            <i className="fas fa-user pr-1"></i>
            <i className="far fa-angle-down"></i>
          </button>
          {isMenuOpen && (
            <ul className="droap_menu overflow-y-hidden">
              {!isAuthenticated ? (
                <>
                  <li className={style}>
                    <NavLink
                      to="/login"
                      onClick={(e) => handleNavLinkClick(e, 'login')}
                      className={style}
                    >
                      Login
                    </NavLink>
                  </li>
                  <li className={style}>
                    <NavLink
                      to="/register"
                      onClick={(e) => handleNavLinkClick(e, 'register')}
                      className={style}
                    >
                      Register
                    </NavLink>
                  </li>
                  <li className={style}>
                    <NavLink
                      to="/forgot-password"
                      onClick={(e) => handleNavLinkClick(e, 'forgotPassword')}
                      className={style}
                    >
                      Forgot Password
                    </NavLink>
                  </li>
                  <li className={style}>
                    <NavLink
                      to="/resend-verification-email"
                      onClick={(e) =>
                        handleNavLinkClick(e, 'resendVerifyEmail')
                      }
                      className={style}
                    >
                      Resend Verify Email
                    </NavLink>
                  </li>
                  <li className={style}>
                    <NavLink
                      to="https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox"
                      className={style}
                    >
                      Gmail
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  {items.map((item) => (
                    <li key={item.key} className={style}>
                      <NavLink
                        to={item.link || '#'}
                        onClick={item.onClick}
                        className={({ isActive }) =>
                          isActive ? `${style} ` : style
                        }
                      >
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </>
              )}
            </ul>
          )}
        </li>
      </div>
    </>
  );
};

export default Auth;
