import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
function FeedBack() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  return (
    <section className="fp__testimonial pt_95 xs_pt_66 mb_150 xs_mb_120">
      <div className="container">
        <div className="row wow fadeInUp" data-wow-duration="1s">
          <div className="col-md-8 col-lg-7 col-xl-6 m-auto text-center">
            <div className="fp__section_heading mb_40">
              <h4>testimonial</h4>
              <h2>our customar feedbacks</h2>
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

        <div className="row testi_slider">
          <Slider {...settings}>
            <div className="col-xl-4 wow fadeInUp" data-wow-duration="1s">
              <div className="fp__single_testimonial">
                <div className="fp__testimonial_header d-flex flex-wrap align-items-center">
                  <div className="img">
                    <img
                      src="images/comment_img_1.png"
                      alt="clients"
                      className="img-fluid w-100"
                    />
                  </div>
                  <div className="text">
                    <h4>isita islam</h4>
                    <p>nyc usa</p>
                  </div>
                </div>
                <div className="fp__single_testimonial_body">
                  <p className="feedback">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut
                    accusamus praesentium quaerat nihil magnam a porro eaque
                    numquam
                  </p>
                  <span className="rating">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star-half-alt"></i>
                    <i className="far fa-star"></i>
                  </span>
                </div>
              </div>
            </div>
            <div className="col-xl-4 wow fadeInUp" data-wow-duration="1s">
              <div className="fp__single_testimonial">
                <div className="fp__testimonial_header d-flex flex-wrap align-items-center">
                  <div className="img">
                    <img
                      src="images/comment_img_2.png"
                      alt="clients"
                      className="img-fluid w-100"
                    />
                  </div>
                  <div className="text">
                    <h4>sumon mahmud</h4>
                    <p>nyc usa</p>
                  </div>
                </div>
                <div className="fp__single_testimonial_body">
                  <p className="feedback">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut
                    accusamus praesentium quaerat nihil magnam a porro eaque
                    numquam
                  </p>
                  <span className="rating">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star-half-alt"></i>
                    <i className="far fa-star"></i>
                  </span>
                </div>
              </div>
            </div>
            <div className="col-xl-4 wow fadeInUp" data-wow-duration="1s">
              <div className="fp__single_testimonial">
                <div className="fp__testimonial_header d-flex flex-wrap align-items-center">
                  <div className="img">
                    <img
                      src="images/client_img_1.jpg"
                      alt="clients"
                      className="img-fluid w-100"
                    />
                  </div>
                  <div className="text">
                    <h4>israt jahan</h4>
                    <p>nyc usa</p>
                  </div>
                </div>
                <div className="fp__single_testimonial_body">
                  <p className="feedback">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut
                    accusamus praesentium quaerat nihil magnam a porro eaque
                    numquam
                  </p>
                  <span className="rating">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star-half-alt"></i>
                    <i className="far fa-star"></i>
                  </span>
                </div>
              </div>
            </div>
            <div className="col-xl-4 wow fadeInUp" data-wow-duration="1s">
              <div className="fp__single_testimonial">
                <div className="fp__testimonial_header d-flex flex-wrap align-items-center">
                  <div className="img">
                    <img
                      src="images/client_img_3.jpg"
                      alt="clients"
                      className="img-fluid w-100"
                    />
                  </div>
                  <div className="text">
                    <h4>payel sarkar</h4>
                    <p>nyc usa</p>
                  </div>
                </div>
                <div className="fp__single_testimonial_body">
                  <p className="feedback">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut
                    accusamus praesentium quaerat nihil magnam a porro eaque
                    numquam
                  </p>
                  <span className="rating">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star-half-alt"></i>
                    <i className="far fa-star"></i>
                  </span>
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </div>
    </section>
  );
}

export default FeedBack;
