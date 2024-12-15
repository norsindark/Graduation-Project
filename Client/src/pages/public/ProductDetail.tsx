import React, { useState, useEffect, useMemo } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import ReLatedItem from '../../components/public/productdetal/ReLatedItem';
import TabsDescriptionAndReview from '../../components/public/productdetal/TabsDescriptionAndReview';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { callGetAllDishes, callGetDishDetail } from '../../services/clientApi';
import { useDispatch, useSelector } from 'react-redux';
import { doAddProductAction, OrderState } from '../../redux/order/orderSlice';
import { notification } from 'antd';
// Dữ liệu giả cho hình ảnh
import FullPageLoading from '../../components/Loading/FullPageLoading';
import { RootState } from '../../redux/store';
import { CartItem } from '../../redux/order/orderSlice';
interface imageOption {
  imageId: string;
  imageUrl: string;
}

interface DishDetail {
  categoryId: string;
  categoryName: string;
  description: string;
  dishId: string;
  dishName: string;
  images: imageOption[];
  listOptions: {
    optionGroupId: string;
    optionGroupName: string;
    options: {
      additionalPrice: string;
      optionName: string;
      optionSelectionId: string;
    }[];
  }[];
  longDescription: string;
  offerPrice: number;
  price: number;
  status: string;
  thumbImage: string;
  rating: number;
  slug: string;
  availableQuantity: number;
  discountPercentage?: number;
}

const ProductDetail: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [dishDetail, setDishDetail] = useState<DishDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: { name: string; price: number; optionSelectionId: string }[];
  }>({});
  const dispatch = useDispatch();
  const orderState = useSelector((state: RootState) => state.order);
  const [hasAddedToCart, setHasAddedToCart] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<{
    discountPercentage: number;
    offerId: string;
  } | null>(null);
  const [allDishes, setAllDishes] = useState<DishDetail[]>([]);

  useEffect(() => {
    if (hasAddedToCart) {
      if (orderState.status === 'success') {
        notification.success({
          message: 'Add to cart successfully!!!',
          showProgress: true,
          duration: 3,
        });
        setHasAddedToCart(false);
        dispatch({ type: 'order/resetStatus' });
      } else if (orderState.status === 'error' && orderState.error) {
        notification.error({
          message: 'Cannot add to cart',
          description: orderState.error,
          showProgress: true,
          duration: 3,
        });
        setHasAddedToCart(false);
        dispatch({ type: 'order/resetStatus' });
      }
    }
  }, [orderState.status, orderState.error, hasAddedToCart, dispatch]);

  useEffect(() => {
    const loadOffer = () => {
      const offerData = localStorage.getItem('currentOffer');
      if (offerData) {
        const offer = JSON.parse(offerData);
        setCurrentOffer(offer);
      }
    };
    loadOffer();
  }, []);

  useEffect(() => {
    const fetchDishDetail = async () => {
      setLoading(true);
      try {
        const query = 'pageNo=0&pageSize=100&sortBy=dishName&sortDir=asc';
        const allDishesResponse = await callGetAllDishes(query);
        const dishes = allDishesResponse.data._embedded?.dishResponseList;
        setAllDishes(dishes);

        const matchingDish = dishes.find(
          (dish: DishDetail) => dish.slug === slug
        );
        if (matchingDish) {
          const detailResponse = await callGetDishDetail(matchingDish.dishId);
          const dishData = detailResponse.data;
          if (currentOffer) {
            const discountedPrice =
              dishData.price * (1 - currentOffer.discountPercentage / 100);
            setDishDetail({
              ...dishData,
              offerPrice: discountedPrice,
              discountPercentage: currentOffer.discountPercentage,
            });
          } else {
            setDishDetail(dishData);
          }
        } else {
          notification.error({
            message: 'Dish not found',
            description: 'The requested dish could not be found.',
            showProgress: true,
            duration: 3,
          });
          navigate('/menu');
        }
      } catch (error) {
        console.error('Error fetching dish detail:', error);
        notification.error({
          message: 'Error loading dish details',
          description: 'Please try again later.',
          showProgress: true,
          duration: 3,
        });
        navigate('/menu');
      } finally {
        setLoading(false);
      }
    };

    fetchDishDetail();
  }, [slug, navigate, currentOffer]);

  const handleChangeButton = (type: string) => {
    if (type === 'MINUS') {
      if (currentQuantity > 1) {
        setCurrentQuantity(currentQuantity - 1);
      }
    }
    if (type === 'PLUS') {
      if (
        dishDetail?.availableQuantity &&
        currentQuantity < dishDetail.availableQuantity
      ) {
        setCurrentQuantity(currentQuantity + 1);
      } else {
        notification.error({
          message: `Maximum quantity available is ${dishDetail?.availableQuantity}!`,
          description: 'Cannot add more items',
          showProgress: true,
          duration: 3,
        });
      }
    }
  };

  const getExistingQuantityInCart = (
    dishId: string,
    selectedOpts: { [key: string]: string }
  ) => {
    return orderState.carts.reduce((total, item) => {
      if (
        item.dishId === dishId &&
        JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOpts)
      ) {
        return total + item.quantity;
      }
      return total;
    }, 0);
  };

  const formatSelectedOptions = (options: typeof selectedOptions) => {
    return Object.entries(options).reduce(
      (acc, [key, value]) => {
        if (value.length > 0) {
          const formattedOpts = value.map(
            (option) =>
              `${option.name} (+ ${option.price.toLocaleString('vi-VN')} VNĐ)`
          );
          acc[key] = formattedOpts.join(', ');
        }
        return acc;
      },
      {} as { [key: string]: string }
    );
  };

  const getTotalQuantityInCart = (dishId: string) => {
    return orderState.carts.reduce((total, item) => {
      if (item.dishId === dishId) {
        return total + item.quantity;
      }
      return total;
    }, 0);
  };

  const handleOptionChange = (
    groupId: string,
    optionName: string,
    additionalPrice: number,
    isChecked: boolean,
    optionSelectionId: string,
    isRadio?: boolean
  ) => {
    if (dishDetail) {
      const totalQuantityInCart = getTotalQuantityInCart(dishDetail.dishId);
      if (totalQuantityInCart >= dishDetail.availableQuantity) {
        notification.error({
          message: 'Cannot change option',
          description: `You have ${totalQuantityInCart} products in your cart. Cannot add more products because it exceeds the available quantity (${dishDetail.availableQuantity}).`,
          showProgress: true,
          duration: 3,
        });
        return;
      }
    }

    setSelectedOptions((prev) => {
      const newOptions = { ...prev };

      if (isRadio) {
        newOptions[groupId] = [
          {
            name: optionName,
            price: additionalPrice,
            optionSelectionId: optionSelectionId,
          },
        ];
      } else {
        const currentOptions = newOptions[groupId] || [];

        if (isChecked) {
          const updatedOptions = [
            ...currentOptions,
            {
              name: optionName,
              price: additionalPrice,
              optionSelectionId: optionSelectionId,
            },
          ].sort((a, b) => a.name.localeCompare(b.name));

          newOptions[groupId] = updatedOptions;
        } else {
          newOptions[groupId] = currentOptions.filter(
            (option) => option.optionSelectionId !== optionSelectionId
          );

          if (newOptions[groupId].length === 0) {
            delete newOptions[groupId];
          }
        }
      }

      if (dishDetail) {
        const formattedOptions = formatSelectedOptions(newOptions);
        const existingQuantity = getExistingQuantityInCart(
          dishDetail.dishId,
          formattedOptions
        );
        if (existingQuantity >= dishDetail.availableQuantity) {
          notification.warning({
            message: 'Warning',
            description: `You already have ${existingQuantity} products with this option in your cart. Cannot add more products.`,
            showProgress: true,
            duration: 3,
          });
        }
      }

      return newOptions;
    });
  };

  const calculateTotalPrice = () => {
    if (!dishDetail) return 0;

    // Sử dụng giá offer nếu có
    const basePrice = dishDetail.offerPrice ?? dishDetail.price;

    // Tính tổng giá options
    const optionsPrice = Object.values(selectedOptions).reduce(
      (total, optionGroup) =>
        total +
        optionGroup.reduce(
          (groupTotal, option) => groupTotal + option.price,
          0
        ),
      0
    );

    return (basePrice + optionsPrice) * currentQuantity;
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (dishDetail) {
      // Kiểm tra size đã được chọn chưa
      const radioGroups = sortedOptions.filter(
        (group) => group.optionGroupName.toLowerCase() === 'size'
      );

      const isRadioSelected = radioGroups.every(
        (group) =>
          selectedOptions[group.optionGroupId] &&
          selectedOptions[group.optionGroupId].length > 0
      );

      if (!isRadioSelected) {
        notification.error({
          message: 'Please select size before adding to cart!',
          showProgress: true,
          duration: 3,
        });
        return;
      }

      // Kiểm tra số lượng
      const totalQuantityInCart = getTotalQuantityInCart(dishDetail.dishId);
      const newTotalQuantity = totalQuantityInCart + currentQuantity;

      if (newTotalQuantity > dishDetail.availableQuantity) {
        notification.error({
          message: 'Cannot add to cart',
          description: `You have ${totalQuantityInCart} products in your cart. Cannot add ${currentQuantity} more products because it exceeds the available quantity (${dishDetail.availableQuantity}).`,
          showProgress: true,
          duration: 3,
        });
        return;
      }

      // Format options
      const formattedOptions = Object.entries(selectedOptions).reduce(
        (acc, [groupId, options]) => {
          const option = options[0];
          acc[groupId] = {
            optionSelectionId: option.optionSelectionId,
            name: option.name,
            price: option.price,
          };
          return acc;
        },
        {} as CartItem['selectedOptions']
      );

      const cartItem = {
        quantity: currentQuantity,
        dishId: dishDetail.dishId,
        detail: {
          dishName: dishDetail.dishName,
          price: calculateTotalPrice(),
          originalPrice: dishDetail.price,
          discountPercentage:
            currentOffer?.discountPercentage ||
            (dishDetail.offerPrice < dishDetail.price
              ? Math.round(
                  ((dishDetail.price - dishDetail.offerPrice) /
                    dishDetail.price) *
                    100
                )
              : undefined),
          thumbImage: dishDetail.thumbImage,
        },
        selectedOptions: formattedOptions,
        availableQuantity: dishDetail.availableQuantity,
        offerId: currentOffer?.offerId,
      };

      dispatch(doAddProductAction(cartItem));
      setHasAddedToCart(true);
    }
  };

  const sortedOptions = useMemo(() => {
    const options = dishDetail?.listOptions || [];
    return [...options].sort((a, b) => {
      if (a.optionGroupName.toLowerCase() === 'size') return -1;
      if (b.optionGroupName.toLowerCase() === 'size') return 1;
      return 0;
    });
  }, [dishDetail?.listOptions]);

  if (loading) {
    return <FullPageLoading />;
  }

  if (!dishDetail) {
    return null;
  }

  const images = [
    {
      id: 'thumb',
      original: dishDetail.thumbImage,
    },
    ...dishDetail.images.map((image) => ({
      id: image.imageId,
      original: image.imageUrl,
      thumbnail: image.imageUrl,
    })),
  ];

  return (
    <>
      <section
        className="fp__breadcrumb"
        style={{ backgroundImage: 'url(/images/counter_bg.jpg)' }}
      >
        <div className="fp__breadcrumb_overlay">
          <div className="container">
            <div className="fp__breadcrumb_text">
              <h1>Dish detail</h1>
              <ul>
                <li>
                  <NavLink to="/">home</NavLink>
                </li>
                <span>
                  <i className="fas fa-angle-right mr-4"></i>
                </span>
                <li>
                  <NavLink to="/menu">Menu</NavLink>
                </li>
                <span>
                  <i className="fas fa-angle-right mr-4"></i>
                </span>
                <li>
                  <NavLink to="/product-detail">Dish detail</NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="fp__menu_details mt_115 xs_mt_85 mb_95 xs_mb_65">
        <div className="container">
          <div className="row">
            <div
              className="col-lg-5 col-md-9 wow fadeInUp"
              data-wow-duration="1s"
            >
              <ImageGallery
                items={images || []}
                showBullets={true}
                showThumbnails={true}
                autoPlay={true}
                infinite={true}
                slideDuration={500}
                showNav={false}
                thumbnailPosition="bottom"
                additionalClass="uniform-gallery"
              />
            </div>
            <div className="col-lg-7 wow fadeInUp" data-wow-duration="1s">
              <div className="fp__menu_details_text">
                <h2>{dishDetail?.dishName}</h2>
                <p className="rating">
                  {Array.from({ length: 5 }, (_, index) => (
                    <i
                      key={index}
                      className={`${
                        index < Math.floor(dishDetail?.rating || 0)
                          ? 'fas fa-star'
                          : index < (dishDetail?.rating || 0)
                            ? 'fas fa-star-half-alt'
                            : 'far fa-star'
                      }`}
                    ></i>
                  ))}
                  <span>({dishDetail?.rating})</span>
                </p>
                <h3 className="price">
                  {dishDetail?.offerPrice.toLocaleString('vi-VN')} VNĐ
                  {dishDetail?.offerPrice < dishDetail?.price && (
                    <del>{dishDetail?.price.toLocaleString('vi-VN')} VNĐ</del>
                  )}
                </h3>
                <p className="short_description">{dishDetail?.description}</p>

                {sortedOptions.map((optionGroup, groupIndex) => (
                  <div className="details_extra_item" key={groupIndex}>
                    <h5>
                      Select{' '}
                      {optionGroup.optionGroupName.toLowerCase() === 'size'
                        ? 'size'
                        : optionGroup.optionGroupName}
                      {optionGroup.optionGroupName.toLowerCase() !== 'size' && (
                        <span> (optional)</span>
                      )}
                    </h5>
                    {optionGroup.options.map((option, optionIndex) => (
                      <div className="form-check" key={optionIndex}>
                        <input
                          className="form-check-input"
                          type={
                            optionGroup.optionGroupName.toLowerCase() === 'size'
                              ? 'radio'
                              : 'checkbox'
                          }
                          name={`optionGroup${groupIndex}`}
                          id={`${optionGroup.optionGroupName}-${option.optionName}`}
                          onChange={(e) =>
                            handleOptionChange(
                              optionGroup.optionGroupId,
                              option.optionName,
                              Number(option.additionalPrice),
                              e.target.checked,
                              option.optionSelectionId,
                              optionGroup.optionGroupName.toLowerCase() ===
                                'size'
                            )
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`${optionGroup.optionGroupName}-${option.optionName}`}
                        >
                          {option.optionName}{' '}
                          <span>
                            + {Number(option.additionalPrice).toLocaleString()}{' '}
                            VNĐ
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                ))}

                <div className="details_quentity">
                  <h5>
                    select quantity (Available : {dishDetail?.availableQuantity}
                    )
                  </h5>
                  <div className="quentity_btn_area flex-wrap align-items-center justify-start">
                    <div className="quentity_btn">
                      <button
                        className="btn btn-danger"
                        onClick={() => handleChangeButton('MINUS')}
                      >
                        <i className="fal fa-minus"></i>
                      </button>
                      <input
                        type="text"
                        value={currentQuantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          if (
                            !isNaN(value) &&
                            value >= 0 &&
                            value <= dishDetail?.availableQuantity
                          ) {
                            setCurrentQuantity(value);
                          }
                        }}
                      />
                      <button
                        className="btn btn-success"
                        onClick={() => handleChangeButton('PLUS')}
                      >
                        <i className="fal fa-plus"></i>
                      </button>
                    </div>
                    <h3 className="mt-4">
                      {calculateTotalPrice().toLocaleString('vi-VN')} VNĐ
                    </h3>
                  </div>
                </div>
                <ul className="details_button_area d-flex flex-wrap justify-content-start">
                  <li>
                    <a
                      className="common_btn"
                      href="#"
                      onClick={handleAddToCart}
                    >
                      <i className="fas fa-shopping-basket mr-2"></i>
                      ADD TO CART
                    </a>
                  </li>
                  {/* <li>
                    <a className="wishlist" href="#">
                      <i className="far fa-heart"></i>
                    </a>
                  </li> */}
                </ul>
              </div>
            </div>
            <div className="col-12 wow fadeInUp" data-wow-duration="1s">
              <TabsDescriptionAndReview dishDetail={dishDetail} />
            </div>
          </div>
          {dishDetail && allDishes.length > 0 && (
            <ReLatedItem
              allDishes={allDishes}
              categoryName={dishDetail.categoryName}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default ProductDetail;
