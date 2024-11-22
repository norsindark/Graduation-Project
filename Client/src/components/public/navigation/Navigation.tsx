import { NavLink } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPagesMenuOpen, setIsPagesMenuOpen] = useState(false);
  // Sửa type của ref
  const menuRef = useRef<HTMLLIElement>(null);
  const pagesMenuRef = useRef<HTMLLIElement>(null);
  const style = 'w-[245px] h-[51px]';
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (
        pagesMenuRef.current &&
        !pagesMenuRef.current.contains(event.target as Node)
      ) {
        setIsPagesMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const togglePagesMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsPagesMenuOpen(!isPagesMenuOpen);
  };

  return (
    <>
      <li className="nav-item">
        <NavLink className="nav-link" aria-current="page" to="/">
          Home
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" to="/menu">
          Menu
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" to="/about">
          About
        </NavLink>
      </li>

      <li className="nav-item" ref={pagesMenuRef}>
        <button className="nav-link" onClick={togglePagesMenu}>
          Pages <i className="far fa-angle-down"></i>
        </button>
        {isPagesMenuOpen && (
          <ul className="droap_menu overflow-y-hidden">
            <li className={style}>
              <NavLink className={style} to="/faqs">
                FAQs
              </NavLink>
            </li>
            <li className={style}>
              <NavLink className={style} to="/privacy-policy">
                Privacy Policy
              </NavLink>
            </li>

            <li className={style}>
              <NavLink className={style} to="/terms-condition">
                Terms and Condition
              </NavLink>
            </li>
          </ul>
        )}
      </li>

      <li className="nav-item">
        <NavLink className="nav-link" to="/blog">
          Blog
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" to="/contact">
          Contact
        </NavLink>
      </li>
    </>
  );
};

export default Navigation;
