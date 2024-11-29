import React, { useState } from 'react';
import { Button } from 'antd';
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
        <Button
          type="primary"
          shape="round"
          onClick={handleClick}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            width: '100%',
          }}
        >
          {loading ? (
            <i className="fas fa-spinner fa-spin text-xl"></i>
          ) : (
            <i className="fab fa-google-plus-g text-xl"></i>
          )}
        </Button>
      </li>
    </ul>
  );
};

export default SocialLogin;
