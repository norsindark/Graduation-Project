import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SocialLogin = () => {
  const [loading, setLoading] = useState(false);
  const handleClick = () => {
    setLoading(true);
    localStorage.setItem('googleLogin', 'true');
  };
  return (
    <>
    <div className="container px-0">
      <ul className="row mx-0">
      <li className="col-sm-6 mb-3 d-flex justify-content-center align-items-center">
          <Link 
            to={`${import.meta.env.VITE_BACKEND_URL}/oauth2/authorization/google`}
            onClick={handleClick}
          >
            {loading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fab fa-google-plus-g"></i>
            )}
          </Link>
        </li>
        <li className="col-sm-6 mb-3 d-flex justify-content-center align-items-center">
          <a href="#"  >
            <i className="fab fa-facebook-f"></i>
          </a>
        </li>
      </ul>
      </div>
    </>
    
  );
};

export default SocialLogin;
