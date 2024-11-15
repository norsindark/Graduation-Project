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

  const sliderData = [
    {
      id: 1,
      image: 'images/offer_slider_3.png',
      title: 'Royal Seafood Pizza',
      description:
        'Indulge in premium tiger prawns, fresh squid, crab sticks, imported scallops topped with finest Mozzarella cheese',
    },
    {
      id: 2,
      image: 'images/offer_slider_2.png',
      title: 'Cheese Beef Burger',
      description:
        "Soft brioche bun, Australian Wagyu beef, melted Cheddar cheese, fresh vegetables with chef's special sauce",
    },
    {
      id: 3,
      image: 'images/offer_slider_1.png',
      title: 'Spicy Crispy Chicken Burger',
      description:
        'Crispy coating, secret-recipe marinated chicken, fresh vegetables with signature Japanese mayonnaise',
    },
    {
      id: 4,
      image: 'images/offer_slider_4.png',
      title: 'Korean Spicy Fried Chicken',
      description:
        'Crispy fried chicken glazed with sweet & spicy Korean sauce, topped with roasted sesame and special chili powder',
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
            <div key={item.id} className="col-xl-4">
              <a
                href="#"
                className="fp__add_slider_single"
                style={{ background: `url(${item.image})` }}
              >
                <div className="text">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
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
