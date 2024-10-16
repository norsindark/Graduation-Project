import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { notification } from 'antd';
import { callVerifyEmail } from '../../../../services/clientApi';

interface VerifyEmailProps {
  onClose: () => void;
  setActiveModal: (modal: string | null) => void;
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({
  onClose,
  setActiveModal,
}) => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (token) {
        try {
          const response = await callVerifyEmail(token);
          if (response.status === 200) {
            notification.success({
              message: 'Email verified successfully!',
              duration: 5,
              showProgress: true,
            });
            onClose();
            setActiveModal('login');
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
  }, [token, onClose, setActiveModal]);

  return null;
};

export default VerifyEmail;
