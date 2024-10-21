import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import ReLatedItem from '../../components/public/productdetal/ReLatedItem';
import TabsDescriptionAndReview from '../../components/public/productdetal/TabsDescriptionAndReview';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

// Dữ liệu giả cho hình ảnh
const images = [
  {
    id: 1,
    original: '../../../public/images/menu1.png',
    thumbnail: '../../../public/images/menu1.png',
  },
  {
    id: 2,
    original: '../../../public/images/menu2.png',
    thumbnail: '../../../public/images/menu2.png',
  },
  {
    id: 3,
    original: '../../../public/images/menu3.png',
    thumbnail: '../../../public/images/menu3.png',
  },
  {
    id: 4,
    original: '../../../public/images/menu4.png',
    thumbnail: '../../../public/images/menu4.png',
  },
];

const product = {
  name: 'Maxican Pizza Test Better',
  rating: 4.5,
  reviewsCount: 201,
  price: 320.0,
  originalPrice: 350.0,
  description: `Pizza is a savory dish of Italian origin consisting of a usually round, flattened base of leavened wheat-based dough topped with tomatoes, cheese, and often various other ingredients, which is then baked at a high temperature, traditionally in a wood-fired oven. A small pizza is sometimes called a pizzetta.`,
};

const ProductDetail: React.FC = () => {
  const [autoPlay, setAutoPlay] = useState(true);

  return (
    <>
      <section
        className="fp__breadcrumb"
        style={{ background: 'url(images/counter_bg.jpg)' }}
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
            <div className="col-lg-5 col-md-9 wow fadeInUp" data-wow-duration="1s">
              <ImageGallery
                items={images}
                showBullets={true}
                showThumbnails={true}
                autoPlay={autoPlay}
                infinite={true}
                slideDuration={300} 
                showNav={false} 
              />
            </div>
            <div className="col-lg-7 wow fadeInUp" data-wow-duration="1s">
              <div className="fp__menu_details_text">
                <h2>{product.name}</h2>
                <p className="rating">
                  {Array.from({ length: 5 }, (_, index) => (
                    <i
                      key={index}
                      className={`${
                        index < Math.floor(product.rating)
                          ? 'fas fa-star'
                          : index < product.rating
                          ? 'fas fa-star-half-alt'
                          : 'far fa-star'
                      }`}
                    ></i>
                  ))}
                  <span>({product.reviewsCount})</span>
                </p>
                <h3 className="price">
                  ${product.price.toFixed(2)}{' '}
                  <del>${product.originalPrice.toFixed(2)}</del>
                </h3>
                <p className="short_description">{product.description}</p>

                <div className="details_size">
                  <h5>select size</h5>
                  {['large', 'medium', 'small'].map((size, index) => (
                    <div className="form-check" key={index}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id={size}
                        defaultChecked={size === 'large'}
                      />
                      <label className="form-check-label" htmlFor={size}>
                        {size}{' '}
                        <span>
                          + $ {size === 'large' ? 350 : size === 'medium' ? 250 : 150}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="details_extra_item">
                  <h5>
                    select option <span>(optional)</span>
                  </h5>
                  {['coca-cola', '7up'].map((option, index) => (
                    <div className="form-check" key={index}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={option}
                      />
                      <label className="form-check-label" htmlFor={option}>
                        {option}{' '}
                        <span>+ ${option === 'coca-cola' ? 10 : 15}</span>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="details_quentity">
                  <h5>select quentity</h5>
                  <div className="quentity_btn_area d-flex flex-wrap align-items-center">
                    <div className="quentity_btn">
                      <button className="btn btn-danger">
                        <i className="fal fa-minus"></i>
                      </button>
                      <input type="text" placeholder="1" />
                      <button className="btn btn-success">
                        <i className="fal fa-plus"></i>
                      </button>
                    </div>
                    <h3>${product.price.toFixed(2)}</h3>
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
              <TabsDescriptionAndReview />
            </div>
          </div>
          <ReLatedItem />
        </div>
      </section>
    </>
  );
};

export default ProductDetail;
