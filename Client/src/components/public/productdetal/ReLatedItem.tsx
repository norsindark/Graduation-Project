import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import { callWishListById } from '../../../services/clientApi';
import { callWishList } from '../../../services/clientApi';
import { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';

interface DishItem {
  dishId: string;
  dishName: string;
  thumbImage: string;
  price: number;
  offerPrice: number;
  rating: number;
  categoryName: string;
  slug: string;
}

interface RelatedItemProps {
  allDishes: DishItem[];
  categoryName: string;
}

interface WishListDish {
  dishId: string;
  dishName: string;
  slug: string;
  description: string;
  status: string;
  thumbImage: string;
  offerPrice: number;
  price: number;
  rating: number;
  ratingCount: number;
}

function ReLatedItem({ allDishes, categoryName }: RelatedItemProps) {
  const userId = useSelector((state: RootState) => state.account.user?.id);
  const relatedItems = allDishes.filter(
    (dish) => dish.categoryName === categoryName
  );
  const navigate = useNavigate();

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
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  if (relatedItems.length === 0) return null;

  const handleProductClick = (slug: string) => {
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
        item.dishes?.some((dish: WishListDish) => dish.dishId === dishId)
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
    <>
      {' '}
      <div className="fp__related_menu mt_90 xs_mt_60">
        <h2>related item</h2>
        <Slider {...settings}>
          {relatedItems.map((item) => (
            <div
              key={item.dishId}
              className="col-xl-3 wow fadeInUp"
              data-wow-duration="1s"
            >
              <div className="fp__menu_item">
                <div className="fp__menu_item_img">
                  <img
                    src={item.thumbImage}
                    alt={item.dishName}
                    className="img-fluid w-100"
                  />
                  <NavLink to="#" className="category">
                    {item.categoryName}
                  </NavLink>
                </div>
                <div className="fp__menu_item_text">
                  <p className="rating">
                    {Array.from({ length: 5 }, (_, index) => (
                      <i
                        key={index}
                        className={`${
                          index < Math.floor(item.rating)
                            ? 'fas fa-star'
                            : index < item.rating
                              ? 'fas fa-star-half-alt'
                              : 'far fa-star'
                        }`}
                      ></i>
                    ))}
                    <span>({item.rating})</span>
                  </p>
                  <a
                    className="title truncate block whitespace-nowrap overflow-hidden"
                    href={`/product-detail/${item.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleProductClick(item.slug);
                    }}
                  >
                    {item.dishName}
                  </a>
                  <h5 className="price">
                    {item.offerPrice.toLocaleString('vi-VN')} VNĐ
                    {item.offerPrice < item.price && (
                      <del>{item.price.toLocaleString('vi-VN')} VNĐ</del>
                    )}
                  </h5>
                  <ul className="d-flex flex-wrap justify-content-center">
                    {/* <li>
                      <a
                        href="#"
                        data-bs-toggle="modal"
                        data-bs-target="#cartModal"
                      >
                        <i className="fas fa-shopping-basket"></i>
                      </a>
                    </li> */}
                    <li>
                      <div
                        className="heart"
                        onClick={() => handleAddToWishlist(item.dishId)}
                      >
                        <i className="fal fa-heart"></i>
                      </div>
                    </li>
                    <li>
                      <NavLink
                        to={`/product-detail/${item.slug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleProductClick(item.slug);
                        }}
                      >
                        <i className="far fa-eye"></i>
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
}

export default ReLatedItem;
