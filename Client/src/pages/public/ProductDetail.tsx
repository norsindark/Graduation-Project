import React, { useState, useEffect, useMemo } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import ReLatedItem from '../../components/public/productdetal/ReLatedItem';
import TabsDescriptionAndReview from '../../components/public/productdetal/TabsDescriptionAndReview';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { callGetAllDishes, callGetDishDetail } from '../../services/clientApi';
import { useDispatch } from 'react-redux';
import { doAddProductAction } from '../../redux/order/orderSlice';
import { notification } from 'antd';
// Dữ liệu giả cho hình ảnh
import FullPageLoading from '../../components/Loading/FullPageLoading';
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
}

const ProductDetail: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [dishDetail, setDishDetail] = useState<DishDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: { name: string; price: number }[];
  }>({});
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDishDetail = async () => {
      setLoading(true);
      try {
        const allDishesResponse = await callGetAllDishes('');
        const allDishes = allDishesResponse.data._embedded?.dishResponseList;

        const matchingDish = allDishes.find(
          (dish: DishDetail) => dish.slug === slug
        );
        if (matchingDish) {
          const detailResponse = await callGetDishDetail(matchingDish.dishId);
          setDishDetail(detailResponse.data);
        } else {
          console.error('Dish not found');
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
  }, [slug, navigate]);

  const handleChangeButton = (type: string) => {
    if (type === 'MINUS') {
      if (currentQuantity > 1) {
        setCurrentQuantity(currentQuantity - 1);
      }
    }
    if (type === 'PLUS') {
      if (dishDetail?.availableQuantity && currentQuantity < dishDetail.availableQuantity) {
        setCurrentQuantity(currentQuantity + 1);
      }
    }
  };

  const handleOptionChange = (
    groupId: string,
    optionName: string,
    additionalPrice: number,
    isChecked: boolean,
    isRadio?: boolean
  ) => {
    setSelectedOptions((prev) => {
      const newOptions = { ...prev };

      if (isRadio) {
        newOptions[groupId] = [{ name: optionName, price: additionalPrice }];
      } else {
        const currentOptions = newOptions[groupId] || [];

        if (isChecked) {
          // Thêm option và sắp xếp theo tên
          const updatedOptions = [
            ...currentOptions,
            { name: optionName, price: additionalPrice }
          ].sort((a, b) => a.name.localeCompare(b.name));

          newOptions[groupId] = updatedOptions;
        } else {
          // Loại bỏ option nếu không được chọn
          newOptions[groupId] = currentOptions.filter(
            (option) => option.name !== optionName
          );

          if (newOptions[groupId].length === 0) {
            delete newOptions[groupId];
          }
        }
      }

      return newOptions;
    });
  };


  const calculateTotalPrice = () => {
    const basePrice = dishDetail?.offerPrice ?? 0;

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

      const cartItem = {
        quantity: currentQuantity,
        dishId: dishDetail.dishId,
        detail: {
          dishName: dishDetail.dishName,
          price: calculateTotalPrice(),
          thumbImage: dishDetail.thumbImage,
        },
        selectedOptions: Object.entries(selectedOptions).reduce(
          (acc, [key, value]) => {
            if (value.length > 0) {
              const formattedOptions = value.map(
                (option) =>
                  `${option.name} (+ ${option.price.toLocaleString('vi-VN')} VNĐ)`
              );
              acc[key] = formattedOptions.join(', ');
            }
            return acc;
          },
          {} as { [key: string]: string }
        ),
      };
      dispatch(doAddProductAction(cartItem));
      notification.success({
        message: 'Add to cart successfully!!!',
        showProgress: true,
        duration: 3,
      });
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
        style={{ background: 'url(../../../public/images/counter_bg.jpg)' }}
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
                      className={`${index < Math.floor(dishDetail?.rating || 0)
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
                  <del>{dishDetail?.price.toLocaleString('vi-VN')} VNĐ</del>
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
                  <h5>select quantity (Available : {dishDetail?.availableQuantity})</h5>
                  <div className="quentity_btn_area flex-wrap align-items-center justify-start">
                    <div className="quentity_btn">
                      <button
                        className="btn btn-danger"
                        onClick={() => handleChangeButton('MINUS')}
                      >
                        <i className="fal fa-minus"></i>
                      </button>
                      <input type="text" value={currentQuantity} readOnly />
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
                  <li>
                    <a className="wishlist" href="#">
                      <i className="far fa-heart"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-12 wow fadeInUp" data-wow-duration="1s">
              <TabsDescriptionAndReview dishDetail={dishDetail} />
            </div>
          </div>
          <ReLatedItem />
        </div>
      </section>
    </>
  );
};

export default ProductDetail;
