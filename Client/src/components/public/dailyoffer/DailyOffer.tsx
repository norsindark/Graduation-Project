import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
const DailyOffer: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
  };
  return (
    <>
      <section className="fp__offer_item mt_100 xs_mt_70 pt_95 xs_pt_65 pb_150 xs_pb_120">
        <div className="container">
          <div className="row wow fadeInUp" data-wow-duration="1s">
            <div className="col-md-8 col-lg-7 col-xl-6 m-auto text-center">
              <div className="fp__section_heading mb_50">
                <h4>daily offer</h4>
                <h2>up to 75% off for this day</h2>
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

          <Slider
            {...settings}
            className="row offer_item_slider wow fadeInUp"
            data-wow-duration="1s"
          >
            {offerItems.map((offer, index) => (
              <div className="col-xl-4" key={index}>
                <div className="fp__offer_item_single">
                  <div className="img">
                    <img
                      src={offer.imageUrl}
                      alt={offer.title}
                      className="img-fluid w-100"
                    />
                  </div>
                  <div className="text">
                    <span>{offer.discount}</span>
                    <a className="title" href={offer.link}>
                      {offer.title}
                    </a>
                    <p className="text-base">{offer.description}</p>
                    <ul className="d-flex flex-wrap justify-content-start">
                      <li>
                        <a
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#cartModal"
                        >
                          <i className="fas fa-shopping-basket"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fal fa-heart"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="far fa-eye"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>
      {/* <div className="fp__cart_popup">
        <div
          className="modal fade"
          id="cartModal"
          tabIndex={0}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="fal fa-times"></i>
                </button>
                <div className="fp__cart_popup_img">
                  <img
                    src="images/menu1.png"
                    alt="menu"
                    className="img-fluid w-100"
                  />
                </div>
                <div className="fp__cart_popup_text">
                  <a href="#" className="title">
                    Maxican Pizza Test Better
                  </a>
                  <p className="rating">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star-half-alt"></i>
                    <i className="far fa-star"></i>
                    <span>(201)</span>
                  </p>
                  <h4 className="price">
                    $320.00 <del>$350.00</del>{' '}
                  </h4>

                  <div className="details_size">
                    <h5>select size</h5>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="large"
                        checked
                      />
                      <label className="form-check-label" htmlFor="large">
                        large <span>+ $350</span>
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="medium"
                      />
                      <label className="form-check-label" htmlFor="medium">
                        medium <span>+ $250</span>
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="small"
                      />
                      <label className="form-check-label" htmlFor="small">
                        small <span>+ $150</span>
                      </label>
                    </div>
                  </div>

                  <div className="details_extra_item">
                    <h5>
                      select option <span>(optional)</span>
                    </h5>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="coca-cola"
                      />
                      <label className="form-check-label" htmlFor="coca-cola">
                        coca-cola <span>+ $10</span>
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="7up"
                      />
                      <label className="form-check-label" htmlFor="7up">
                        7up <span>+ $15</span>
                      </label>
                    </div>
                  </div>

                  <div className="details_quentity">
                    <h5>select quentity</h5>
                    <div className="quentity_btn_area d-flex flex-wrapa align-items-center">
                      <div className="quentity_btn">
                        <button className="btn btn-danger">
                          <i className="fal fa-minus"></i>
                        </button>
                        <input type="text" placeholder="1" />
                        <button className="btn btn-success">
                          <i className="fal fa-plus"></i>
                        </button>
                      </div>
                      <h3>$320.00</h3>
                    </div>
                  </div>
                  <ul className="details_button_area d-flex flex-wrap">
                    <li>
                      <a className="common_btn" href="#">
                        add to cart
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

const offerItems = [
  {
    discount: '30% off',
    title: 'Dal Makhani Paneer',
    description: 'Lightly smoked and minced pork tenderloin topped',
    imageUrl: 'images/slider_img_1.png',
    link: 'menu_details.html',
  },
  {
    discount: '40% off',
    title: 'Hyderabadi biryani',
    description: 'Lightly smoked and minced pork tenderloin topped',
    imageUrl: 'images/slider_img_2.png',
    link: 'menu_details.html',
  },
  {
    discount: '55% off',
    title: 'Beef Masala Salad',
    description: 'Lightly smoked and minced pork tenderloin topped',
    imageUrl: 'images/slider_img_3.png',
    link: 'menu_details.html',
  },
  {
    discount: '45% off',
    title: 'Indian cuisine Pakora',
    description: 'Lightly smoked and minced pork tenderloin topped',
    imageUrl: 'images/slider_img_2.png',
    link: 'menu_details.html',
  },
];

export default DailyOffer;
