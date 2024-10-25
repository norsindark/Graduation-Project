import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styled from 'styled-components';
import { callGetAllCoupon } from '../../../services/clientApi';
import { Button, message, notification } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
const ArrowButton = styled.i`
  width: 30px;
  height: 30px;
  background: var(--colorPrimary);
  line-height: 30px;
  text-align: center;
  color: var(--colorWhite);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.2;
  z-index: 1;
  cursor: pointer;
  transition: all linear 0.3s;

  &:hover {
    opacity: 1;
  }

  &.nextArrow {
    right: -7px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &.prevArrow {
    left: -7px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

function Coupon({ cartItems }: { cartItems: any }) {
  const [coupons, setCoupons] = useState([]);

  const NextArrow = (props: any) => {
    const { onClick } = props;
    return (
      <ArrowButton
        className="far fa-long-arrow-right nextArrow slick-arrow"
        onClick={onClick}
        aria-hidden="true"
      />
    );
  };

  const PrevArrow = (props: any) => {
    const { onClick } = props;
    return (
      <ArrowButton
        className="far fa-long-arrow-left prevArrow slick-arrow"
        onClick={onClick}
        aria-hidden="true"
      />
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const query = `sortBy=startDate&order=desc`;
      const response = await callGetAllCoupon(query);
      const couponsData = response.data._embedded.couponResponseList;
      setCoupons(couponsData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        notification.success({
          message: 'Copied price discount code!',
          duration: 2,
          showProgress: true,
        });
      },
      (err) => {
        console.error('Không thể sao chép: ', err);
        notification.error({
          message: 'Cannot copy price discount code!',
          duration: 2,
          showProgress: true,
        });
      }
    );
  };

  const isValidCoupon = (coupon: any) => {
    const currentDate = dayjs();
    const expirationDate = dayjs(coupon.expirationDate);
    return currentDate.isBefore(expirationDate);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-2 text-uppercase font-bold text-black text-xl drop-shadow-lg">
        discount for you
      </h2>

      <Slider {...settings}>
        {coupons.filter(isValidCoupon).map((coupon: any) => (
          <div key={coupon.id} className="px-2">
            <div
              className="coupon-card bg-orange-400 rounded overflow-hidden"
              style={{ maxWidth: '600px' }}
            >
              <div className="d-flex">
                <div className="coupon-image" style={{ width: '40%' }}>
                  <img
                    src={cartItems[0].detail.thumbImage}
                    alt={coupon.title}
                    className="w-100 h-100 object-fit-cover rounded-[30px] ml-1"
                  />
                </div>
                <div className="coupon-content p-2" style={{ width: '60%' }}>
                  <div className="coupon-header mb-1">
                    <h6 className="text-uppercase mb-0 font-bold text-white text-center">
                      COUPON
                    </h6>
                  </div>

                  <div className="coupon-body">
                    <h4 className="text-uppercase mb-1 text-white font-bold">
                      UP TO {coupon.discountPercent}% OFF
                    </h4>

                    <p
                      className="text-white my-0 truncate w-full"
                      title={coupon.description}
                    >
                      {coupon.description}
                    </p>

                    <p className="small mb-1">
                      <span className="font-medium text-sm text-white">
                        Max Discount: {coupon.maxDiscount.toLocaleString()} VNĐ
                      </span>{' '}
                    </p>
                    <div className="d-flex justify-content-between mb-1 flex-wrap">
                      <p className="small mb-1">
                        <span className="font-medium text-sm text-white">
                          Min Order Value:{' '}
                          {coupon.minOrderValue.toLocaleString()} VNĐ
                        </span>{' '}
                      </p>
                      <p className="small mb-1">
                        <span className="font-medium text-sm text-white">
                          Available Quantity: {coupon.availableQuantity}
                        </span>{' '}
                      </p>
                    </div>
                    <div className="d-flex justify-content-between mb-1 flex-wrap">
                      <p className="small mb-1">
                        <span className="font-medium text-sm text-white">
                          Start Date:{' '}
                          {dayjs(coupon.startDate).format('DD/MM/YYYY')}
                        </span>{' '}
                      </p>
                      <p className="small mb-1">
                        <span className="font-medium text-sm text-white">
                          End Date:{' '}
                          {dayjs(coupon.expirationDate).format('DD/MM/YYYY')}
                        </span>{' '}
                      </p>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="font-medium text-sm text-white">
                        <i className="fas fa-tag"></i> USE
                      </span>
                      <span className="font-medium text-sm text-white">
                        <i className="far fa-star"></i> SAVE
                      </span>
                      <span className="font-medium text-sm text-white">
                        <i className="fas fa-share-alt"></i> SHARE
                      </span>
                    </div>
                    <div className="code-section border-top pt-1">
                      <small className="text-muted d-block mb-1">
                        <span className="font-medium text-sm text-center text-white">
                          Code: {coupon.couponCode}
                          <Button
                            size="small"
                            className="ml-1"
                            type="primary"
                            icon={<CopyOutlined />}
                            onClick={() => copyToClipboard(coupon.couponCode)}
                          >
                            COPY
                          </Button>
                        </span>
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Coupon;
