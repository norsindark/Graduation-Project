import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { notification } from 'antd';
import { callVerifyEmail } from '../../../../services/clientApi';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      if (token) {
        try {
          const response = await callVerifyEmail(token);
          console.log(response);
          if (response.status === 200) {
            notification.success({
              message: 'Email verified successfully!',
              duration: 5,
              showProgress: true,
            });
            navigate('/login');
          } else {
            notification.error({
              message: 'Email verification failed!',
              description:
                response.data.errors?.error || 'Something went wrong!',
              duration: 5,
              showProgress: true,
            });
          }
        } catch (error) {
          notification.error({
            message: 'Error',
            description: (error as Error).message || 'Something went wrong!',
            duration: 5,
            showProgress: true,
          });
        }
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return <></>;
};

export default VerifyEmail;
