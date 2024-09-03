import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { notification } from 'antd';
import { callVerifyEmail } from '../../../services/clientApi';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const [lastSentTime, setLastSentTime] = useState<number | null>(null);
    const currentTime = Date.now();

    useEffect(() => {
        if (lastSentTime && currentTime - lastSentTime < 10000) {
            notification.warning({
                message: 'Please wait 10 seconds before resending the verification email.',
                duration: 5,
                showProgress: true
            });
            return;
        }

        const verifyEmail = async () => {
            if (token) {
                try {
                    const response = await callVerifyEmail(token);
                    console.log(response);
                    if (response.status === 200) {
                        notification.success({
                            message: 'Email verified successfully!',
                            duration: 5,
                            showProgress: true
                        });
                        navigate('/login');
                    } else {
                        notification.error({
                            message: 'Email verification failed!',
                            description: response.data.message || 'Something went wrong!',
                            duration: 5,
                            showProgress: true
                        });
                        setLastSentTime(currentTime);
                    }
                } catch (error) {
                    notification.error({
                        message: 'Error',
                        description: (error as Error).message || 'Something went wrong!',
                        duration: 5,
                        showProgress: true
                    });

                }
            }
        };

        verifyEmail();
    }, [token, navigate, lastSentTime, currentTime]);

    return <></>;
};

export default VerifyEmail;
