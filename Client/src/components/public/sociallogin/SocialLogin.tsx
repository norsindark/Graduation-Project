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
            <ul className="d-flex">
                <li>
                    <Link to={`${import.meta.env.VITE_BACKEND_URL}/oauth2/authorization/google`} onClick={handleClick}>
                        {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fab fa-google-plus-g"></i>}
                    </Link>
                </li>
                <li>
                    <a href="#"><i className="fab fa-facebook-f"></i></a>
                </li>
            </ul>
        </>
    );
};

export default SocialLogin;