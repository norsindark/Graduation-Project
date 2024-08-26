import {Form, Modal, Input, Button, notification, message} from 'antd';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {useState} from 'react';
import {callRegister} from "../../services/clientApi.ts";
import useResponsiveModalWidth from "../../hooks/useResponsiveModalWidth.tsx";


const RegisterModal = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSubmit, setIsSubmit] = useState(false);
    const modalWidth = useResponsiveModalWidth();

    const handleCancel = () => {
        navigate('/'); // Close the modal and navigate back to the homepage
    };


    const onFinish = async (values: any) => {
        const {fullName, email, password, confirmPassword} = values;

        if (password === confirmPassword) {
            setIsSubmit(true);
            const res = await callRegister(email, password, fullName);
            setIsSubmit(false);
            if (res?.status == 201) {
                message.success(res?.data?.message || "Registration successful!");
                navigate('/login')
            } else {
                notification.error({
                    message: "Registration failed",
                    description: res?.data?.errors.error || "Something went wrong!",
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
    };


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
            <section className="fp__signup" style={{backgroundImage: 'url(images/login_bg.jpg)'}}>
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
                                            rules={[{required: true, message: 'Please input your full name!'}]}
                                        >
                                            <Input placeholder="Full Name" autoComplete="fullname"/>
                                        </Form.Item>
                                        <Form.Item
                                            label="Email"
                                            name="email"
                                            rules={[{required: true, message: 'Please input your email!'}]}
                                        >
                                            <Input type="email" placeholder="Email" autoComplete="email"/>
                                        </Form.Item>
                                        <Form.Item
                                            label="Password"
                                            name="password"
                                            rules={[{required: true, message: 'Please input your password!'}]}
                                        >
                                            <Input.Password placeholder="Password" autoComplete="new-password"/>
                                        </Form.Item>
                                        <Form.Item
                                            label="Confirm Password"
                                            name="confirmPassword"
                                            rules={[{required: true, message: 'Please confirm your password!'}]}
                                        >
                                            <Input.Password placeholder="Confirm Password" autoComplete="new-password"/>
                                        </Form.Item>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit" block size="large"
                                                    loading={isSubmit}>
                                                <div className="w-14 font-medium">Register</div>
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                    <p className="or"><span>or</span></p>
                                    <ul className="d-flex">
                                        <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                                        <li><a href="#"><i className="fab fa-linkedin-in"></i></a></li>
                                        <li><a href="#"><i className="fab fa-twitter"></i></a></li>
                                        <li><a href="#"><i className="fab fa-google-plus-g"></i></a></li>
                                    </ul>
                                    <p className="create_account">Already have an account? <Link
                                        to="/login">Login</Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Modal>
    );
};

export default RegisterModal;
