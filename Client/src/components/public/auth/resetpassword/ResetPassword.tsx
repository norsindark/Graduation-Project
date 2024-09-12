import { Form, Input, Button, notification, Modal } from 'antd';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { callResetPassword } from "../../../../services/clientApi";
import useResponsiveModalWidth from '../../../../hooks/useResponsiveModalWidth';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const ResetPassword = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const modalWidth = useResponsiveModalWidth();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams(); // Di chuyển lên đầu
    const token = searchParams.get('token');


    const handleCancel = () => {
        navigate('/');
    };

    const onFinish = async (values: { password: string, confirm_password: string }) => {
        setIsSubmit(true);
        try {
            if (values.password !== values.confirm_password) {
                notification.error({
                    message: 'Password and Confirm Password do not match!',
                    duration: 5,
                    showProgress: true
                });
                return;
            }
            if (!token) {
                throw new Error('Token is missing');
            }
            const res = await callResetPassword(token, values.password);
            if (res?.status == 200) {
                notification.success({
                    message: 'Password changed successfully!',
                    duration: 5,
                    showProgress: true
                });
                navigate('/login');
            } else {
                notification.error({
                    message: 'Failed to reset password!',
                    description: res?.data?.errors?.error || "Something went wrong!",
                    duration: 5,
                    showProgress: true
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error: ' + (error instanceof Error ? error.message : 'Unknown error'),
                duration: 5,
                showProgress: true
            });
        } finally {
            setIsSubmit(false);
        }
    };

    return (
        <Modal
            open={location.pathname === '/reset-password'}
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
            <section className="fp__signin" style={{ backgroundImage: 'url(images/login_bg.jpg)' }}>
                <div className="fp__signup_overlay pt_45 xs_pt_45 pb_45 xs_pb_45">
                    <div className="container">
                        <div className="row wow fadeInUp" data-wow-duration="1s">
                            <div className="col-xxl-12 col-xl-12 col-md-12 col-lg-12 m-auto">
                                <div className="fp__login_area">
                                    <h2>Welcome back!</h2>
                                    <p>Reset password</p>
                                    <Form layout="vertical" onFinish={onFinish}>
                                        <Form.Item
                                            label="New Password"
                                            name="password"
                                            rules={[{ required: true, message: 'Please input your new password!' }]}
                                        >
                                            <Input.Password placeholder="New Password" autoComplete="new-password" />
                                        </Form.Item>
                                        <Form.Item
                                            label="Confirm Password"
                                            name="confirm_password"
                                            rules={[{ required: true, message: 'Please input your confirm password!' }]}
                                        >
                                            <Input.Password placeholder="Confirm Password" autoComplete="confirm-password" />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button type="primary" shape="round" htmlType="submit" block size="large" loading={isSubmit}>
                                                <div className="font-medium text-center w-full max-w-26">Change Password</div>
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

export default ResetPassword;
