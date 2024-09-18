import { Form, Modal, Input, Button, Checkbox, notification } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { callLogin, callProfile } from '../../services/clientApi';
import useResponsiveModalWidth from '../../hooks/useResponsiveModalWidth';
import { useDispatch } from 'react-redux';
import { doLoginAction } from '../../redux/account/accountSlice';
import SocialLogin from '../../components/public/sociallogin/SocialLogin';

const LoginModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmit, setIsSubmit] = useState(false);
  const modalWidth = useResponsiveModalWidth();
  const dispatch = useDispatch();

  const handleCancel = () => {
    navigate('/');
  };

  const onFinish = async (values: { email: string; password: string }) => {
    const { email, password } = values;
    setIsSubmit(true);
    try {
      const res = await callLogin(email, password);
      if (res?.status == 200) {
        localStorage.setItem('accessToken', res.data.accessToken);
        const profileRes = await callProfile();
        if (profileRes?.status === 200) {
          dispatch(doLoginAction(profileRes.data));
          notification.success({
            message: 'Login successful!',
            duration: 5,
            showProgress: true,
          });
          navigate('/');
        }
      } else {
        notification.error({
          message: 'Login failed!',
          description: res.data.errors?.error || 'Something went wrong!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch {
      notification.error({
        message: 'Login error!',
        description: 'Error during login process!',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Modal
      open={location.pathname === '/login'}
      onCancel={handleCancel}
      footer={null}
      width={modalWidth}
      centered
      closeIcon={
        <div className="fp__menu_cart_header">
          <span className="close_cart" onClick={handleCancel}>
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
          <div className="container">
            <div className="row wow fadeInUp" data-wow-duration="1s">
              <div className="col-xxl-12 col-xl-12 col-md-12 col-lg-12 m-auto">
                <div className="fp__login_area">
                  <h2>Welcome back!</h2>
                  <p>Sign In to continue</p>
                  <Form
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ remember: false }}
                  >
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        { required: true, message: 'Please input your email!' },
                        {
                          type: 'email',
                          message: 'Please enter a valid email!',
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
                      ]}
                    >
                      <Input.Password
                        placeholder="Password"
                        autoComplete="current-password"
                      />
                    </Form.Item>
                    <Form.Item name="remember" valuePropName="checked">
                      <div>
                        <Checkbox>Remember Me</Checkbox>
                        <Link to="/forgot-password" style={{ float: 'right' }}>
                          Forgot Password?
                        </Link>
                      </div>
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
                        <div className="w-full max-w-16 font-medium text-center">
                          Login
                        </div>
                      </Button>
                    </Form.Item>
                  </Form>
                  <p className="or">
                    <span>or</span>
                  </p>
                  <SocialLogin />
                  <p className="create_account">
                    Don’t have an account? <Link to="/register">Register</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Modal>
  );
};

export default LoginModal;
