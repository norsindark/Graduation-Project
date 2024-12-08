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
    autoplay: true,
    autoplaySpeed: 2500,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1200, // xl
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 992, // lg
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // md
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 576, // sm
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false, // ẩn mũi tên trên mobile
        },
      },
    ],
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  const sliderData = [
    {
      id: 1,
      image: 'images/offer_slider_3.png',
      title: 'Seafood Pizza',
      description: 'Prawns, squid, crab, scallops, Mozzarella.',
    },
    {
      id: 2,
      image: 'images/offer_slider_2.png',
      title: 'Beef Burger',
      description: 'Brioche, Wagyu, Cheddar, veggies, sauce.',
    },
    {
      id: 3,
      image: 'images/offer_slider_1.png',
      title: 'Spicy Chicken',
      description: 'Crispy chicken, marinade, veggies, mayo.',
    },
    {
      id: 4,
      image: 'images/offer_slider_4.png',
      title: 'Korean Chicken',
      description: 'Fried chicken, Korean sauce, sesame, chili.',
    },
  ];

  return (
    <section className="fp__add_slider mt_100 xs_mt_70 pt_100 xs_pt_70 pb_100 xs_pb_70">
      <div className="container">
        <Slider
          {...settings}
          className="row add_slider wow fadeInUp"
          data-wow-duration="1s"
        >
          {sliderData.map((item) => (
            <div key={item.id} className="col-12">
              <a
                href="#"
                className="fp__add_slider_single"
                style={{
                  background: `url(${item.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="text">
                  <h3 className="text-base md:text-lg lg:text-xl">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base">{item.description}</p>
                </div>
              </a>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}

export default SlideIntro;
