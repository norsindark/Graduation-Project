import React, { useState } from 'react';
import { notification } from 'antd';
import { callResendVerifyEmail } from '../../../../services/clientApi';
import { Modal, Form, Input, Button } from 'antd';
import { Link } from 'react-router-dom';
import useResponsiveModalWidth from '../../../../hooks/useResponsiveModalWidth';

interface ResendVerifyEmailProps {
  onClose: () => void;
  setActiveModal: (modal: string | null) => void;
}

const ResendVerifyEmail: React.FC<ResendVerifyEmailProps> = ({
  onClose,
  setActiveModal,
}) => {
  const modalWidth = useResponsiveModalWidth();
  const [isSubmit, setIsSubmit] = useState(false);

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
        onClose();
        setActiveModal('login');
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

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    setActiveModal('login');
  };

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    setActiveModal('register');
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
        className="fp__signin"
        style={{ backgroundImage: 'url(images/login_bg.jpg)' }}
      >
       <div className="fp__signup_overlay pt_45 xs_pt_45 pb_45 xs_pb_45">
       <div className="container">
            <div className="row wow fadeInUp" data-wow-duration="1s">
              <div className="col-xxl-12 col-xl-12 col-md-12 col-lg-12 m-auto">
                <div className="fp__login_area">
                  <h2>Resend Verification Email</h2>
                  <p className="text-lg">Please enter your account email here</p>
                  <Form
                    layout="vertical"
                    onFinish={onFinish}
                    className="text-base"
                  >
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
                        <div className="w-full font-medium text-center max-w-20 text-lg">
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
