import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import ReLatedItem from '../../components/public/productdetal/ReLatedItem';
import TabsDescriptionAndReview from '../../components/public/productdetal/TabsDescriptionAndReview';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { callGetAllDishes, callGetDishDetail } from '../../services/clientApi';
// Dữ liệu giả cho hình ảnh

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
}

const ProductDetail: React.FC = () => {
  const { slug } = useParams();
  const [autoPlay, setAutoPlay] = useState(true);
  const [dishDetail, setDishDetail] = useState<DishDetail | null>(null);
  const [loading, setLoading] = useState(true);

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
        }
      } catch (error) {
        console.error('Error fetching dish detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDishDetail();
  }, [slug]);

  const images = dishDetail
    ? [
        {
          id: 'thumb',
          original: dishDetail.thumbImage,
          // thumbnail: dishDetail.thumbImage,
        },
        ...dishDetail.images.map((image) => ({
          id: image.imageId,
          original: image.imageUrl,
          thumbnail: image.imageUrl,
        })),
      ]
    : [];

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
                autoPlay={autoPlay}
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
                  <del>{dishDetail?.price.toLocaleString('vi-VN')} VNĐ</del>
                </h3>
                <p className="short_description">{dishDetail?.description}</p>

                {dishDetail?.listOptions.map((optionGroup, groupIndex) => (
                  <div className="details_size" key={groupIndex}>
                    <h5>
                      Select {optionGroup.optionGroupName}
                      {groupIndex !== 0 && <span> (optional)</span>}
                    </h5>
                    {optionGroup.options.map((option, optionIndex) => (
                      <div className="form-check" key={optionIndex}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name={`optionGroup${groupIndex}`}
                          id={`${optionGroup.optionGroupName}-${option.optionName}`}
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
                  <h5>select quentity</h5>
                  <div className="quentity_btn_area  flex-wrap  align-items-center justify-start">
                    <div className="quentity_btn">
                      <button className="btn btn-danger">
                        <i className="fal fa-minus"></i>
                      </button>
                      <input type="text" placeholder="1" />
                      <button className="btn btn-success">
                        <i className="fal fa-plus"></i>
                      </button>
                    </div>
                    <h3 className="mt-4">
                      {dishDetail?.offerPrice.toLocaleString('vi-VN')} VNĐ
                    </h3>
                  </div>
                </div>
                <ul className="details_button_area d-flex flex-wrap justify-content-start">
                  <li>
                    <a className="common_btn" href="#">
                      add to cart
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
