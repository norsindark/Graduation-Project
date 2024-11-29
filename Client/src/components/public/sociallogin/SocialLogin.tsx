import React, { useState } from 'react';

const SocialLogin = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    localStorage.setItem('googleLogin', 'true');
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/oauth2/authorization/google`;
  };

  return (
    <ul>
      <li>
        <button
          onClick={handleClick}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          {loading ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            <i className="fab fa-google-plus-g"></i>
          )}
        </button>
      </li>
    </ul>
  );
};

export default SocialLogin;
