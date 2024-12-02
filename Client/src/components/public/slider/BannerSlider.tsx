import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Link, useNavigate } from 'react-router-dom';

interface BannerOffer {
  id: string;
  discountPercentage: number;
  dish: {
    dishName: string;
    categoryName: string;
    description: string;
    thumbImage: string;
    slug: string;
    price: number;
    offerPrice: number;
  };
}

interface BannerSliderProps {
  offers: any[];
}

const BannerSlider: React.FC<BannerSliderProps> = ({ offers }) => {
  const [weeklyOffers, setWeeklyOffers] = useState<BannerOffer[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (offers.length === 0) {
      setWeeklyOffers([
        {
          id: 'default',
          discountPercentage: 35,
          dish: {
            dishName: 'Different spice for a Different taste',
            categoryName: 'Featured',
            description:
              'Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
            thumbImage: '/images/slider_img_1.png',
            slug: 'special-dish',
            price: 100000,
            offerPrice: 65000,
          },
        },
        {
          id: 'default2',
          discountPercentage: 70,
          dish: {
            dishName: 'Eat healthy. Stay healthy.',
            categoryName: 'Featured',
            description:
              'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum fugit minima et debitis ut distinctio optio qui voluptate natus.',
            thumbImage: '/images/slider_img_2.png',
            slug: 'special-dish',
            price: 100000,
            offerPrice: 70000,
          },
        },
        {
          id: 'default3',
          discountPercentage: 50,
          dish: {
            dishName: 'Great food. Tastes good.',
            categoryName: 'Featured',
            description:
              'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum fugit minima et debitis ut distinctio optio qui voluptate natus.',
            thumbImage: '/images/slider_img_3.png',
            slug: 'special-dish',
            price: 100000,
            offerPrice: 50000,
          },
        },
      ]);
    } else {
      const mappedOffers = offers.map((offer) => ({
        id: offer.id,
        discountPercentage: offer.discountPercentage,
        dish: {
          dishName: offer.dish.dishName,
          categoryName: offer.dish.categoryName,
          description: offer.dish.description,
          thumbImage: offer.dish.thumbImage,
          slug: offer.dish.slug,
          price: offer.dish.price,
          offerPrice: offer.dish.offerPrice,
        },
      }));
      setWeeklyOffers(mappedOffers);
    }
  }, [offers]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
  };

  const handleProductClick = (slug: string, offer: BannerOffer) => {
    navigate(`/product-detail/${slug}`);
  };

  return (
    <section
      className="fp__banner"
      style={{ backgroundImage: 'url(images/banner_bg.jpg)' }}
    >
      <div className="fp__banner_overlay">
        <Slider {...settings} className="banner_slider">
          {weeklyOffers.map((offer) => (
            <div key={offer.id} className="fp__banner_slider">
              <div className="container">
                <div className="row">
                  <div className="col-xl-5 col-md-5 col-lg-5">
                    <div
                      className="fp__banner_img wow fadeInLeft"
                      data-wow-duration="1s"
                    >
                      <div className="img">
                        <img
                          src={offer.dish.thumbImage}
                          alt={offer.dish.dishName}
                          className="img-fluid w-100"
                        />
                        <span
                          style={{
                            backgroundImage: 'url(images/offer_shapes.png)',
                          }}
                        >
                          {offer.discountPercentage}% off
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-5 col-md-7 col-lg-6">
                    <div
                      className="fp__banner_text wow fadeInRight"
                      data-wow-duration="1s"
                    >
                      <h1>{offer.dish.dishName}</h1>
                      <h3>{offer.dish.categoryName} - Restaurant</h3>
                      <p>{offer.dish.description}</p>
                      <ul className="d-flex flex-wrap">
                        <li>
                          <Link
                            to={`/product-detail/${offer.dish.slug}`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleProductClick(offer.dish.slug, offer);
                            }}
                            className="common_btn"
                          >
                            shop now
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default BannerSlider;
