import React, { useState } from 'react';
import { notification } from 'antd';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    notification.success({
      message: 'Success',
      description: 'Your contact has been sent successfully',
      duration: 3,
      showProgress: true,
    });

    fetch(
      'https://script.google.com/macros/s/AKfycbwf_VT6VOE7dqOeyALRzLDYlVkrHBwuLrCMyIjAbFrK4KFJHSRBeHinaucCoZaU9w8D/exec',
      {
        method: 'POST',
        body: new URLSearchParams(formData),
      }
    );

    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  return (
    <>
      <section
        className="fp__breadcrumb"
        style={{ background: 'url(images/counter_bg.jpg)' }}
      >
        <div className="fp__breadcrumb_overlay">
          <div className="container">
            <div className="fp__breadcrumb_text">
              <h1>Contact with us</h1>
              <ul>
                <li>
                  <a href="/">Home</a>
                </li>
                <span>
                  <i className="fas fa-angle-right mr-4"></i>
                </span>
                <li>
                  <a href="/contact">Contact</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="fp__contact mt_100 xs_mt_70 mb_100 xs_mb_70">
        <div className="container">
          <div className="row">
            <div
              className="col-xl-4 col-md-6 col-lg-4 wow fadeInUp"
              data-wow-duration="1s"
            >
              <div className="fp__contact_info">
                <span>
                  <i className="fal fa-phone-alt"></i>
                </span>
                <div className="text">
                  <h3>Call</h3>
                  <p>+84 376 985 395</p>
                  <p>+84 966 501 365</p>
                </div>
              </div>
            </div>
            <div
              className="col-xl-4 col-md-6 col-lg-4 wow fadeInUp"
              data-wow-duration="1s"
            >
              <div className="fp__contact_info">
                <span>
                  <i className="fal fa-envelope"></i>
                </span>
                <div className="text">
                  <h3>Mail</h3>
                  <p>norsindark@gmail.com</p>
                  <p>lamducdt2k@gmail.com</p>
                </div>
              </div>
            </div>
            <div
              className="col-xl-4 col-md-6 col-lg-4 wow fadeInUp"
              data-wow-duration="1s"
            >
              <div
                className="fp__contact_info"
                style={{ display: 'flex !important' }}
              >
                <span>
                  <i className="fas fa-street-view"></i>
                </span>
                <div className="text">
                  <h3>Location</h3>
                  <p>227 Hà Huy Tập, Thành phố Buôn Ma Thuột, Đắk Lắk</p>
                </div>
              </div>
            </div>
          </div>

          <div className="fp__contact_form_area mt_100 xs_mt_70">
            <div className="row">
              <div className="col-xl-12 wow fadeInUp" data-wow-duration="1s">
                <form className="fp__contact_form" onSubmit={handleSubmit}>
                  <h3>Contact</h3>
                  <div className="row">
                    <div className="col-xl-6 col-lg-6">
                      <div className="fp__contact_form_input">
                        <span>
                          <i className="fal fa-user-alt"></i>
                        </span>
                        <input
                          type="text"
                          name="name"
                          placeholder="Name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6">
                      <div className="fp__contact_form_input">
                        <span>
                          <i className="fal fa-envelope"></i>
                        </span>
                        <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6">
                      <div className="fp__contact_form_input">
                        <span>
                          <i className="fal fa-phone-alt"></i>
                        </span>
                        <input
                          type="text"
                          name="phone"
                          placeholder="Phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6">
                      <div className="fp__contact_form_input">
                        <span>
                          <i className="fal fa-book"></i>
                        </span>
                        <input
                          type="text"
                          name="subject"
                          placeholder="Subject"
                          value={formData.subject}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-xl-12">
                      <div className="fp__contact_form_input textarea">
                        <span>
                          <i className="fal fa-book"></i>
                        </span>
                        <textarea
                          rows={8}
                          name="message"
                          placeholder="Message"
                          value={formData.message}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                      <button type="submit">Send Message</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="row mt_100 xs_mt_70">
              <div className="col-xl-12 wow fadeInUp" data-wow-duration="1s">
                <div className="fp__contact_map">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m24!1m12!1m3!1d439.0360693982123!2d108.06375532432756!3d12.705065731243758!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m9!3e6!4m3!3m2!1d12.7050787!2d108.06411659999999!4m3!3m2!1d12.705119999999999!2d108.0641105!5e0!3m2!1svi!2s!4v1732263256634!5m2!1svi!2s"
                    style={{ border: '0' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ContactPage;
