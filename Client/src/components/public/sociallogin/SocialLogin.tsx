import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SocialLogin = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            // Xử lý token, ví dụ: lưu vào localStorage và chuyển hướng
            localStorage.setItem('token', token);
            setLoading(false);
            navigate('/dashboard'); // Chuyển hướng đến trang dashboard
        }
    }, [navigate]);

    const handleGoogleLogin = async () => {
        setLoading(true);
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    return (
        <>
            <ul className="d-flex">
                <li>
                    <a onClick={handleGoogleLogin}>
                        {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fab fa-google-plus-g"></i>}
                    </a>
                </li>
                <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
            </ul>
        </>
    );
};

export default SocialLogin;
