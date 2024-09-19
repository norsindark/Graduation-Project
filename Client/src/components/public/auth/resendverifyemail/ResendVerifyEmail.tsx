import React, { useState } from 'react';
import { notification } from 'antd';
import { callResendVerifyEmail } from '../../../../services/clientApi';
import { Modal, Form, Input, Button } from 'antd';
import { Link } from 'react-router-dom';
import useResponsiveModalWidth from '../../../../hooks/useResponsiveModalWidth';
import { useLocation, useNavigate } from 'react-router-dom';

const ResendVerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const modalWidth = useResponsiveModalWidth();
  const [isSubmit, setIsSubmit] = useState(false);

  const handleCancel = () => {
    navigate('/');
  };

  const onFinish = async (values: { email: string }) => {
    const { email } = values;
    setIsSubmit(true);
    try {
      const response = await callResendVerifyEmail(email);
      if (response.status === 200) {
        notification.success({
          message: 'Verification email sent successfully!',
          duration: 5,
          showProgress: true,
        });
        navigate('/login');
      } else {
        notification.error({
          message: 'Verification email failed!',
          description: response.data.errors?.error || 'Something went wrong!',
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
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Modal
      open={location.pathname === '/resend-verification-email'}
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
        className="fp__signin"
        style={{ backgroundImage: 'url(images/login_bg.jpg)' }}
      >
        <div className="fp__signup_overlay pt_45 xs_pt_45 pb_45 xs_pb_45">
          <div className="container">
            <div className="row wow fadeInUp" data-wow-duration="1s">
              <div className="col-xxl-12 col-xl-12 col-md-12 col-lg-12 m-auto">
                <div className="fp__login_area">
                  <h2>Welcome back!</h2>
                  <p>Resend Verification Email</p>
                  <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        { required: true, message: 'Please input your email!' },
                      ]}
                    >
                      <Input
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
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
                        <div className="w-full font-medium text-center max-w-20">
                          Verify Mail
                        </div>
                      </Button>
                    </Form.Item>
                  </Form>
                  <p className="create_account d-flex justify-content-between">
                    <Link to="/login">login</Link>
                    <Link to="/register">Create Account</Link>
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

export default ResendVerifyEmail;
