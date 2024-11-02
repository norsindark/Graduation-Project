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
   <ul>
        <li>
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
      </ul>
    </>
    
  );
};

export default SocialLogin;
