import {Form, Modal, Input, Button} from 'antd';
import {useLocation, useNavigate} from 'react-router-dom';
import {useEffect, useState, useRef} from 'react';

const RegisterModal = () => {
    const hasWindow = typeof window !== 'undefined';
    const [modalWidth, setModalWidth] = useState<number>(hasWindow ? window.innerWidth : 650);
    const navigate = useNavigate();
    const location = useLocation();
    let timeOutId = useRef<number | null>(null);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 500) {
                setModalWidth(380);
            } else if (width >= 500 && width < 1000) {
                setModalWidth(480);
            } else {
                setModalWidth(680);
            }
        };

        window.addEventListener('resize', () => {
            if (timeOutId.current) {
                clearTimeout(timeOutId.current);
            }
            timeOutId.current = window.setTimeout(handleResize, 500);
        });

        // Initial check
        handleResize();

        return () => {
            if (timeOutId.current) {
                clearTimeout(timeOutId.current);
            }
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleCancel = () => {
        navigate('/'); // Close the modal and navigate back to the homepage
    };

    const onFinish = (values: any) => {
        console.log('Form values:', values);
        navigate('/'); // Close the modal after successful submission
    };

    return (
        <Modal

            open={location.pathname === '/register'}
            onCancel={handleCancel}
            footer={null}
            width={modalWidth}
            centered
            closeIcon={
                <div className="fp__menu_cart_header"><span className="close_cart" onClick={handleCancel}><i
                    className="fal fa-times"></i></span></div>
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
                                            label="Name"
                                            name="name"
                                            rules={[{required: true, message: 'Please input your name!'}]}
                                        >
                                            <Input placeholder="Name"/>
                                        </Form.Item>
                                        <Form.Item
                                            label="Email"
                                            name="email"
                                            rules={[{required: true, message: 'Please input your email!'}]}
                                        >
                                            <Input type="email" placeholder="Email"/>
                                        </Form.Item>
                                        <Form.Item
                                            label="Password"
                                            name="password"
                                            rules={[{required: true, message: 'Please input your password!'}]}
                                        >
                                            <Input.Password placeholder="Password"/>
                                        </Form.Item>
                                        <Form.Item
                                            label="Confirm Password"
                                            name="confirmPassword"
                                            rules={[{required: true, message: 'Please confirm your password!'}]}
                                        >
                                            <Input.Password placeholder="Confirm Password"/>
                                        </Form.Item>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit" block size="large" >
                                                <div className="w-14 font-medium">Login</div>
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
                                    <p className="create_account">Don’t have an account? <a
                                        href="sign_in.html">Login</a></p>
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
