import { Form, Modal, Input, Button, notification } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { callRegister } from "../../services/clientApi";
import useResponsiveModalWidth from "../../hooks/useResponsiveModalWidth";
import SocialLogin from "../../components/public/sociallogin/SocialLogin";

const RegisterModal = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSubmit, setIsSubmit] = useState(false);
    const modalWidth = useResponsiveModalWidth();

    const handleCancel = () => {
        navigate('/');
    };

    const onFinish = async (values: { fullName: string; email: string; password: string; confirmPassword: string }) => {
        const { fullName, email, password, confirmPassword } = values;
        setIsSubmit(true);
        try {
            if (password === confirmPassword) {
                const res = await callRegister(email, password, fullName);
                console.log("res", res);
                if (res?.status == 201) {
                    notification.success({
                        message: "Registration successful!",
                        duration: 5,
                        showProgress: true
                    })
                    navigate('/login')
                } else {
                    notification.error({
                        message: "Registration failed",
                        description: res?.data?.errors?.error || "Something went wrong!",
                        duration: 5,
                        showProgress: true
                    })
                }
            } else {
                notification.error({
                    message: "Registration failed",
                    description: "Password and confirm password do not match!",
                    duration: 5,
                    showProgress: true
                })
            }
        } catch {
            notification.error({
                message: "Registration error!",
                description: "Error during registration process!",
                duration: 5,
                showProgress: true
            });
        } finally {
            setIsSubmit(false);
        }
    }

    return (
        <Modal
            open={location.pathname === '/register'}
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
            <section className="fp__signup" style={{ backgroundImage: 'url(images/login_bg.jpg)' }}>
                <div className="fp__signup_overlay pt_45 xs_pt_45 pb_45 xs_pb_45">
                    <div className="container">
                        <div className="row wow fadeInUp" data-wow-duration="1s">
                            <div className="col-xxl-12 col-xl-12 col-md-12 col-lg-12 m-auto">
                                <div className="fp__login_area">
                                    <h2>Welcome back!</h2>
                                    <p>Sign up to continue</p>
                                    <Form layout="vertical" onFinish={onFinish}>
                                        <Form.Item
                                            label="Full Name"
                                            name="fullName"
                                            rules={[
                                                { required: true, message: 'Please input your full name!' },
                                                {
                                                    pattern: /^[A-Za-zÀ-ỹ\s]+$/u, // Allows letters (with accents) and spaces
                                                    message: 'Full Name can only contain letters, spaces, and accents!',
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Full Name" autoComplete="full-name" />
                                        </Form.Item>

                                        <Form.Item
                                            label="Email"
                                            name="email"
                                            rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
                                        >
                                            <Input type="email" placeholder="Email" autoComplete="email" />
                                        </Form.Item>
                                        <Form.Item
                                            label="Password"
                                            name="password"
                                            rules={[
                                                { required: true, message: 'Please input your password!' },
                                                {
                                                    pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,64}$/,
                                                    message: 'Password must be between 6 and 64 characters long and contain both letters and numbers!',
                                                }
                                            ]}
                                        >
                                            <Input.Password placeholder="Password" autoComplete="new-password" />
                                        </Form.Item>
                                        <Form.Item
                                            label="Confirm Password"
                                            name="confirmPassword"
                                            dependencies={['password']} // This makes sure confirmPassword depends on the password field
                                            rules={[
                                                { required: true, message: 'Please confirm your password!' },
                                                ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        if (!value || getFieldValue('password') === value) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject(new Error('Passwords do not match!'));
                                                    },
                                                }),
                                            ]}
                                        >
                                            <Input.Password placeholder="Confirm Password" autoComplete="new-password" />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button type="primary" shape="round" htmlType="submit" block size="large"
                                                loading={isSubmit}>
                                                <div className="w-full max-w-16 font-medium text-center" >Register</div>
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                    <p className="or"><span>or</span></p>
                                    <SocialLogin />
                                    <p className="create_account">Already have an account? <Link
                                        to="/login">Login</Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Modal >
    );
};

export default RegisterModal;
