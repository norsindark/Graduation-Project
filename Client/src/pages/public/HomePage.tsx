import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('access_token');
        if (token) {
            localStorage.setItem('accessToken', token);
            navigate('/');
            window.location.reload();
        }
    }, [location, navigate]);
    return (
        <div>
            <h1 className='pt-40'>HomePage</h1>
        </div>
    );
};

export default HomePage;