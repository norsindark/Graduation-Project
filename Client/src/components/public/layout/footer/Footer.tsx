import { Button, Form, Input, notification } from 'antd';
import logo from '../../../../assets/images/imagelogosyndev1.png';
import { SendOutlined } from '@ant-design/icons';

const Footer = () => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    const email = values.email;
    console.log("email", form.getFieldValue("email"));


    notification.success({
      message: 'Success',
      description: 'Your email has been sent successfully',
    });

    fetch('https://script.google.com/macros/s/AKfycbwqnYqMaQAfxi20vzN9t-CwAU3zUD6VidbeGZJ9isvb3qSLGm7YbVVT_HtuxPNQJHvMdw/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        email: email,
      }),
    });

    form.resetFields();
  };

  return (
    <footer>
      <div className="footer_overlay pt_100 xs_pt_70 pb_100 xs_pb_70">
        <div className="container wow fadeInUp" data-wow-duration="1s">
          <div className="row justify-content-between">
            <div className="col-lg-4 col-sm-8 col-md-6">
              <div className="fp__footer_content">
                <a className="footer_logo" href="index.html">
                  <img src={logo} alt="FoodPark" className="img-fluid " />
                </a>
                <span>
                  Discover the delicious flavors of our diverse menu, from
                  traditional to modern dishes. Easy ordering, fast delivery.
                </span>
                <p className="info">
                  <i className="far fa-map-marker-alt"></i> 227 Hà Huy Tập,
                  Thành phố Buôn Ma Thuột, Đắk Lắk
                </p>
                <a className="info" href="callto:0966501365">
                  <i className="fas fa-phone-alt"></i>
                  +84 966 501 365
                </a>
                <a className="info" href="mailto:websolutionus1@gmail.com">
                  <i className="fas fa-envelope"></i>
                  synfood.bmt@gmail.com
                </a>
              </div>
            </div>
            <div className="col-lg-2 col-sm-4 col-md-6">
              <div className="fp__footer_content">
                <h3>Short Link</h3>
                <ul>
                  <li>
                    <a href="/">Home</a>
                  </li>
                  <li>
                    <a href="/about">About Us</a>
                  </li>
                  <li>
                    <a href="/contact">Contact Us</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-sm-4 col-md-6 order-sm-4 order-lg-3">
              <div className="fp__footer_content">
                <h3>Help Link</h3>
                <ul>
                  <li>
                    <a href="/terms-condition">Terms And Conditions</a>
                  </li>
                  <li>
                    <a href="/privacy-policy">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="/faqs">FAQ</a>
                  </li>
                  <li>
                    <a href="/contact">Contact</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-sm-8 col-md-6 order-lg-4">
              <div className="fp__footer_content ">
                <h3>subscribe</h3>
                <Form form={form} onFinish={handleSubmit}>
                  <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Please enter your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
                  >
                    <Input placeholder="Enter your email" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                      Subscribe
                    </Button>
                  </Form.Item>
                </Form>

                {/* <Form form={form} onFinish={handleSubmit} className="w-[300px]"> 
                  <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Please enter your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
                    className="flex items-center space-x-2"
                  >
                    <Input
                      type="text"
                      placeholder="Subscribe"
                      className="flex-1 p-2 border border-gray-300 rounded-l-md w-[300px]"
                    />
                    <Button
                      type="primary"
                      shape="round"
                      className="p-2 bg-blue-500 text-white hover:bg-blue-600"
                      htmlType="submit"
                      icon={<SendOutlined />}
                    >
                      Subscribe
                    </Button>
                  </Form.Item>
                </Form> */}

                {/* <Form form={form} onFinish={handleSubmit} className="w-[300px]"> 
                  <Form.Item className="flex items-center space-x-2">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 p-2 border border-gray-300 rounded-l-md w-[300px]"
                      name="email"
                    />
                    <Button
                      type="primary"
                      shape="round"
                      className="p-2 bg-blue-500 text-white hover:bg-blue-600"
                      htmlType="submit"
                      icon={<SendOutlined />}
                    >
                      Subscribe
                    </Button>
                  </Form.Item>
                </Form> */}

                <div className="fp__footer_social_link">
                  <h5>follow us:</h5>
                  <ul className="d-flex flex-wrap">
                    <li>
                      <a href="#">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-twitter"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fp__footer_bottom d-flex flex-wrap">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="fp__footer_bottom_text d-flex flex-wrap justify-content-between">
                <p>
                  Copyright 2024 <b>SynFood</b> All Rights Reserved.
                </p>
                <ul className="d-flex flex-wrap">
                  <li>
                    <a href="/faqs">FAQs</a>
                  </li>
                  <li>
                    <a href="/contact">Contact</a>
                  </li>
                  <li>
                    <a href="/terms-condition">Terms And Conditions</a>
                  </li>
                  <li>
                    <a href="/privacy-policy">Privacy Policy</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
