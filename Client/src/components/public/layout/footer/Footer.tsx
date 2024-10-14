import logo from '../../../../assets/images/imagelogosyndev1.png';

const Footer = () => {
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
                  There are many variations of Lorem Ipsum available, but the
                  majority have suffered.
                </span>
                <p className="info">
                  <i className="far fa-map-marker-alt"></i> 307 Hà Huy Tập,
                  Thành phố Buôn Ma Thuột, Đắk Lắk
                </p>
                <a className="info" href="callto:0966666666">
                  <i className="fas fa-phone-alt"></i>
                  +84 966 666 666
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
                    <a href="#">Home</a>
                  </li>
                  <li>
                    <a href="#">About Us</a>
                  </li>
                  <li>
                    <a href="#">Contact Us</a>
                  </li>
                  <li>
                    <a href="#">Our Service</a>
                  </li>
                  <li>
                    <a href="#">gallery</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-sm-4 col-md-6 order-sm-4 order-lg-3">
              <div className="fp__footer_content">
                <h3>Help Link</h3>
                <ul>
                  <li>
                    <a href="#">Terms And Conditions</a>
                  </li>
                  <li>
                    <a href="#">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="#">Refund Policy</a>
                  </li>
                  <li>
                    <a href="#">FAQ</a>
                  </li>
                  <li>
                    <a href="#">contact</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-sm-8 col-md-6 order-lg-4">
              <div className="fp__footer_content">
                <h3>subscribe</h3>
                {/* <form>
                  <input type="text" placeholder="Subscribe" />
                  <button>Subscribe</button>
                </form> */}
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
                    <a href="#">FAQs</a>
                  </li>
                  <li>
                    <a href="#">payment</a>
                  </li>
                  <li>
                    <a href="#">settings</a>
                  </li>
                  <li>
                    <a href="#">privacy policy</a>
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
