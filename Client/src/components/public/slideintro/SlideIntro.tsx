import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// Thêm import cho Font Awesome

function SlideIntro() {
  // Tạo các component mũi tên tùy chỉnh
  const NextArrow = (props: any) => {
    const { onClick } = props;
    return (
      <i
        className="far fa-long-arrow-left prevArrow slick-arrow"
        onClick={onClick}
        aria-hidden="true"
      ></i>
    );
  };

  const PrevArrow = (props: any) => {
    const { onClick } = props;
    return (
      <i
        className="far fa-long-arrow-right nextArrow slick-arrow"
        onClick={onClick}
        aria-hidden="true"
      ></i>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <section className="fp__add_slider mt_100 xs_mt_70 pt_100 xs_pt_70 pb_100 xs_pb_70">
      <div className="container">
        <Slider
          {...settings}
          className="row add_slider wow fadeInUp"
          data-wow-duration="1s"
        >
          <div className="col-xl-4">
            <a
              href="#"
              className="fp__add_slider_single"
              style={{ background: 'url(images/offer_slider_3.png)' }}
            >
              <div className="text">
                <h3>red chicken</h3>
                <p>Lorem ipsum dolor sit amet consectetur.</p>
              </div>
            </a>
          </div>
          <div className="col-xl-4">
            <a
              href="#"
              className="fp__add_slider_single"
              style={{ background: 'url(images/offer_slider_2.png)' }}
            >
              <div className="text">
                <h3>red chicken</h3>
                <p>Lorem ipsum dolor sit amet consectetur.</p>
              </div>
            </a>
          </div>
          <div className="col-xl-4">
            <a
              href="#"
              className="fp__add_slider_single"
              style={{ background: 'url(images/offer_slider_1.png)' }}
            >
              <div className="text">
                <h3>red chicken</h3>
                <p>Lorem ipsum dolor sit amet consectetur.</p>
              </div>
            </a>
          </div>
          <div className="col-xl-4">
            <a
              href="#"
              className="fp__add_slider_single"
              style={{ background: 'url(images/offer_slider_4.png)' }}
            >
              <div className="text">
                <h3>red chicken</h3>
                <p>Lorem ipsum dolor sit amet consectetur.</p>
              </div>
            </a>
          </div>
        </Slider>
      </div>
    </section>
  );
}

export default SlideIntro;
