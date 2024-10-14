import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
function Chef() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  return (
    <section className="fp__team pt_95 xs_pt_65 pb_50">
      <div className="container">
        <div className="row wow fadeInUp" data-wow-duration="1s">
          <div className="col-md-8 col-lg-7 col-xl-6 m-auto text-center">
            <div className="fp__section_heading mb_25">
              <h4>our team</h4>
              <h2>meet our expert chefs</h2>
              <span>
                <img
                  src="images/heading_shapes.png"
                  alt="shapes"
                  className="img-fluid w-100"
                />
              </span>
              <p>
                Objectively pontificate quality models before intuitive
                information. Dramatically recaptiualize multifunctional
                materials.
              </p>
            </div>
          </div>
        </div>

        <div className="row team_slider">
          <Slider {...settings}>
            <div className="col-xl-3 wow fadeInUp" data-wow-duration="1s">
              <div className="fp__single_team">
                <div className="fp__single_team_img">
                  <img
                    src="images/chef_1.jpg"
                    alt="team"
                    className="img-fluid w-100"
                  />
                </div>
                <div className="fp__single_team_text">
                  <h4>ismat joha</h4>
                  <p>senior chef</p>
                  <ul className="d-flex flex-wrap justify-content-center">
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
                    <li>
                      <a href="#">
                        <i className="fab fa-behance"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-3 wow fadeInUp" data-wow-duration="1s">
              <div className="fp__single_team">
                <div className="fp__single_team_img">
                  <img
                    src="images/chef_2.jpg"
                    alt="team"
                    className="img-fluid w-100"
                  />
                </div>
                <div className="fp__single_team_text">
                  <h4>arun chandra</h4>
                  <p>senior chef</p>
                  <ul className="d-flex flex-wrap justify-content-center">
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
                    <li>
                      <a href="#">
                        <i className="fab fa-behance"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-3 wow fadeInUp" data-wow-duration="1s">
              <div className="fp__single_team">
                <div className="fp__single_team_img">
                  <img
                    src="images/chef_3.jpg"
                    alt="team"
                    className="img-fluid w-100"
                  />
                </div>
                <div className="fp__single_team_text">
                  <h4>isita rahman</h4>
                  <p>senior chef</p>
                  <ul className="d-flex flex-wrap justify-content-center">
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
                    <li>
                      <a href="#">
                        <i className="fab fa-behance"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-3 wow fadeInUp" data-wow-duration="1s">
              <div className="fp__single_team">
                <div className="fp__single_team_img">
                  <img
                    src="images/chef_4.jpg"
                    alt="team"
                    className="img-fluid w-100"
                  />
                </div>
                <div className="fp__single_team_text">
                  <h4>khandakar rashed</h4>
                  <p>senior chef</p>
                  <ul className="d-flex flex-wrap justify-content-center">
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
                    <li>
                      <a href="#">
                        <i className="fab fa-behance"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-3 wow fadeInUp" data-wow-duration="1s">
              <div className="fp__single_team">
                <div className="fp__single_team_img">
                  <img
                    src="images/chef_5.jpg"
                    alt="team"
                    className="img-fluid w-100"
                  />
                </div>
                <div className="fp__single_team_text">
                  <h4>naurin nipu</h4>
                  <p>senior chef</p>
                  <ul className="d-flex flex-wrap justify-content-center">
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
                    <li>
                      <a href="#">
                        <i className="fab fa-behance"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </div>
    </section>
  );
}

export default Chef;
