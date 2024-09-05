import React from 'react';
// import { callGoogleLogin } from '../../../services/clientApi';

const SocialLogin = () => {
    return (
        <>
            <ul className="d-flex">
                <li><a href="/api/v1/oauth2/google/callback"><i className="fab fa-google-plus-g"></i></a></li>
                <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
            </ul>
        </>
    );
};

export default SocialLogin;
