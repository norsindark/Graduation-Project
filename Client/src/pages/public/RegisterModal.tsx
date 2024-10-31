import { Form, Modal, Input, Button, notification } from 'antd';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { callRegister } from '../../services/clientApi';
import useResponsiveModalWidth from '../../hooks/useResponsiveModalWidth';
import SocialLogin from '../../components/public/sociallogin/SocialLogin';

interface RegisterModalProps {
  onClose: () => void;
  setActiveModal: (modal: string | null) => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  onClose,
  setActiveModal,
}) => {
  const [isSubmit, setIsSubmit] = useState(false);
  const modalWidth = useResponsiveModalWidth();

  const onFinish = async (values: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    const { fullName, email, password, confirmPassword } = values;
    setIsSubmit(true);
    try {
      if (password === confirmPassword) {
        const res = await callRegister(email, password, fullName);
        if (res?.status == 201) {
          notification.success({
            message: 'Registration successful!',
            duration: 5,
            showProgress: true,
          });
          onClose();
          setActiveModal('login');
        } else {
          notification.error({
            message: 'Registration failed',
            description: res?.data?.errors?.error || 'Something went wrong!',
            duration: 5,
            showProgress: true,
          });
        }
      } else {
        notification.error({
          message: 'Registration failed',
          description: 'Password and confirm password do not match!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch {
      notification.error({
        message: 'Registration error!',
        description: 'Error during registration process!',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setIsSubmit(false);
    }
  };

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    setActiveModal('login');
  };

  return (
    <Modal
      open={true}
      onCancel={onClose}
      footer={null}
      width={modalWidth}
      centered
      closeIcon={
        <div className="fp__menu_cart_header">
          <span className="close_cart-client" onClick={onClose}>
            <i className="fal fa-times"></i>
          </span>
        </div>
      }
    >
      <section
        className="fp__signup"
        style={{ backgroundImage: 'url(images/login_bg.jpg)' }}
      >
        <div className="fp__signup_overlay pt_45 xs_pt_45 pb_45 xs_pb_45">
          <div className="container"></div>
          <div className="row wow fadeInUp" data-wow-duration="1s">
            <div className="col-xxl-12 col-xl-12 col-md-12 col-lg-12 m-auto">
              <div className="fp__login_area">
                <h2>Welcome back!</h2>
                <p className="text-lg">Sign up to continue</p>
                <Form
                  layout="vertical"
                  onFinish={onFinish}
                  className="text-base"
                >
                  <Form.Item
                    label="Full Name"
                    name="fullName"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your full name!',
                      },
                      {
                        pattern: /^[A-Za-zÀ-ỹ\s]+$/u, // Allows letters (with accents) and spaces
                        message:
                          'Full Name can only contain letters, spaces, and accents!',
                      },
                    ]}
                  >
                    <Input placeholder="Full Name" autoComplete="full-name" />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: 'Please input your email!' },
                      {
                        type: 'email',
                        message: 'Please enter a valid email!',
                      },
                      {
                        pattern: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                        message:
                          'Please use a valid Gmail address (example@gmail.com)!',
                      },
                      {
                        validator: (_, value) => {
                          if (value && value.split('@')[0].length < 2) {
                            return Promise.reject(
                              'Email username must be at least 2 characters!'
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      type="email"
                      placeholder="Email"
                      autoComplete="email"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your password!',
                      },
                      {
                        pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,64}$/,
                        message:
                          'Password must be between 6 and 64 characters long and contain both letters and numbers!',
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="Password"
                      autoComplete="new-password"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    dependencies={['password']} // This makes sure confirmPassword depends on the password field
                    rules={[
                      {
                        required: true,
                        message: 'Please confirm your password!',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error('Passwords do not match!')
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      placeholder="Confirm Password"
                      autoComplete="new-password"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      shape="round"
                      htmlType="submit"
                      block
                      size="large"
                      loading={isSubmit}
                    >
                      <div className="w-full max-w-16 font-medium text-center text-lg">
                        Register
                      </div>
                    </Button>
                  </Form.Item>
                </Form>
                <p className="or">
                  <span>or</span>
                </p>
                <SocialLogin />
                <p className="create_account">
                  Already have an account?{' '}
                  <Link to="/login" onClick={handleLoginClick}>
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Modal>
  );
};

export default RegisterModal;
