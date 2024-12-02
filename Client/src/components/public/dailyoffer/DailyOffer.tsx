import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { Link, useNavigate } from 'react-router-dom';
import { callWishList, callWishListById } from '../../../services/clientApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { notification } from 'antd';

interface Offer {
  id: string;
  dish: any;
  discountPercentage: number;
}

interface DailyOfferProps {
  offers: any[];
}

const DailyOffer: React.FC<DailyOfferProps> = ({ offers }) => {
  const [dailyOffers, setDailyOffers] = useState<Offer[]>([]);
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.account.user?.id);

  useEffect(() => {
    if (offers.length === 0) {
      setDailyOffers([
        {
          id: 'default1',
          discountPercentage: 30,
          dish: {
            dishName: 'Dal Makhani Paneer',
            description: 'Lightly smoked and minced pork tenderloin topped',
            thumbImage: 'images/slider_img_1.png',
            slug: 'dal-makhani-paneer',
          },
        },
        {
          id: 'default2',
          discountPercentage: 40,
          dish: {
            dishName: 'Hyderabadi biryani',
            description: 'Lightly smoked and minced pork tenderloin topped',
            thumbImage: 'images/slider_img_2.png',
            slug: 'hyderabadi-biryani',
          },
        },
        {
          id: 'default3',
          discountPercentage: 55,
          dish: {
            dishName: 'Beef Masala Salad',
            description: 'Lightly smoked and minced pork tenderloin topped',
            thumbImage: 'images/slider_img_3.png',
            slug: 'beef-masala-salad',
          },
        },
      ]);
    } else {
      setDailyOffers(offers);
    }
  }, [offers]);

  const settings = {
    dots: true,
    infinite: dailyOffers.length > 3,
    speed: 1000,
    slidesToShow: Math.min(3, dailyOffers.length),
    slidesToScroll: 1,
    autoplay: dailyOffers.length > 3,
    autoplaySpeed: 2500,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: Math.min(3, dailyOffers.length),
          infinite: dailyOffers.length > 3,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: Math.min(2, dailyOffers.length),
          infinite: dailyOffers.length > 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          infinite: dailyOffers.length > 1,
        },
      },
    ],
  };

  const getSliderClassName = () => {
    let className = 'row offer_item_slider wow fadeInUp';
    if (dailyOffers.length <= 3) {
      className += ' justify-content-center';
    }
    return className;
  };

  const handleProductClick = (slug: string, offer: any) => {
    navigate(`/product-detail/${slug}`);
  };
  const handleAddToWishlist = async (dishId: string) => {
    if (!userId) {
      notification.error({
        message: 'Not logged in',
        description: 'Please log in to add products to your favorites list.',
      });
      return;
    }

    try {
      const wishListResponse = await callWishListById(userId, '');

      const wishListItems =
        wishListResponse.data._embedded?.wishlistResponseList || [];

      const isInWishlist = wishListItems.some((item: any) =>
        item.dishes?.some((dish: any) => dish.dishId === dishId)
      );

      if (isInWishlist) {
        notification.warning({
          message: 'The product is already in the favorites list',
          description: 'You have added this product to your favorites list.',
          duration: 5,
          showProgress: true,
        });
        return;
      }

      const response = await callWishList(dishId, userId);
      if (response.status === 200) {
        notification.success({
          message: 'Add to favorites list',
          description:
            'The product has been successfully added to the favorites list.',
          duration: 5,
          showProgress: true,
        });
      } else {
        notification.error({
          message: 'Error',
          description:
            'An error occurred while adding a product to your favorites list.',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Please try again later.',
      });
    }
  };

  return (
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

        <Slider {...settings} className={getSliderClassName()}>
          {dailyOffers.map((offer) => (
            <div
              className="col-xl-4"
              key={offer.id}
              style={{
                width: dailyOffers.length === 1 ? '33.33%' : 'auto',
              }}
            >
              <div className="fp__offer_item_single">
                <div className="img relative w-full h-[200px] overflow-hidden">
                  <img
                    src={offer.dish.thumbImage}
                    alt={offer.dish.dishName}
                    className="absolute w-full h-full object-cover object-center"
                  />
                </div>
                <div className="text">
                  <span>{offer.discountPercentage}% off</span>
                  <Link
                    className="title"
                    to={`/product-detail/${offer.dish.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleProductClick(offer.dish.slug, offer);
                    }}
                  >
                    {offer.dish.dishName}
                  </Link>
                  <p className="text-base">{offer.dish.description}</p>
                  <ul className="d-flex flex-wrap justify-content-start">
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToWishlist(offer.dish.dishId);
                        }}
                      >
                        <i className="fal fa-heart"></i>
                      </a>
                    </li>
                    <li>
                      <Link
                        to={`/product-detail/${offer.dish.slug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleProductClick(offer.dish.slug, offer);
                        }}
                      >
                        <i className="far fa-eye"></i>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default DailyOffer;
