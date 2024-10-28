import { Form, Input, Button, notification, Modal } from 'antd';
import { useState } from 'react';
import { callForgotPassword } from '../../../../services/clientApi';
import useResponsiveModalWidth from '../../../../hooks/useResponsiveModalWidth';
import { Link } from 'react-router-dom';

interface ForgotPasswordProps {
  onClose: () => void;
  setActiveModal: (modal: string | null) => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  onClose,
  setActiveModal,
}) => {
  const [isSubmit, setIsSubmit] = useState(false);
  const modalWidth = useResponsiveModalWidth();

  const onFinish = async (values: { email: string }) => {
    setIsSubmit(true);
    try {
      const res = await callForgotPassword(values.email);
      if (res?.status === 200) {
        notification.success({
          message: 'Password reset email sent successfully!',
          description: 'Please check your email for the reset link.',
          duration: 5,
          showProgress: true,
        });
        onClose();
      } else {
        notification.error({
          message: 'Failed to send password reset email!',
          description: res?.data?.errors?.error || 'Something went wrong!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        message:
          'Error: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
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
        <div className="fp__signup_overlay pt_5 xs_pt_5 pb_5 xs_pb_5">
            <div className="row wow fadeInUp" data-wow-duration="1s">
              <div className="col-xxl-12 col-xl-12 col-md-12 col-lg-12 m-auto">
                <div className="fp__login_area">
                  <h2>Welcome back!</h2>
                  <p className="text-lg">forgot password</p>
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
      </section>
    </Modal>
  );
};

export default ForgotPassword;
