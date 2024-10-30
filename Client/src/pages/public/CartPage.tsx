import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate, useOutletContext } from 'react-router-dom';
import { Popconfirm, notification } from 'antd';
import { RootState } from '../../redux/store';
import Coupon from '../../components/public/coupon/Coupon';
import {
  callGetAllCouponNotUsedByUserId,
  callCheckCouponUsageByCodeAndUserId,
} from '../../services/clientApi';
import {
  doRemoveProductAction,
  doUpdateQuantityAction,
  doClearCartAction,
  CartItem,
  SelectedOption,
} from '../../redux/order/orderSlice';
import { LayoutContextType } from '../../components/public/layout/LayoutPublic';

interface Coupon {
  couponId: string;
  couponCode: string;
  description: string;
  status: string;
  discountPercent: number;
  maxDiscount: number;
  minOrderValue: number;
  availableQuantity: number;
  startDate: string;
  expirationDate: string;
}

interface AppliedCoupon extends Coupon {
  discountAmount: number;
}

interface OrderSummary {
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
  appliedCoupon: AppliedCoupon | null;
}

const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openModal } = useOutletContext<LayoutContextType>();
  const cartItems = useSelector((state: RootState) => state.order.carts);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(
    null
  );

  const [couponCode, setCouponCode] = useState('');

  const userId = useSelector((state: RootState) => state.account.user?.id);

  const isAuthenticated = useSelector(
    (state: RootState) => state.account.isAuthenticated
  );

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const query = `userId=${userId}&sortBy=startDate&sortDir=desc`;
      const response = await callGetAllCouponNotUsedByUserId(query);
      const couponsData = response.data._embedded.couponResponseList;
      setCoupons(couponsData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleRemoveItem = (
    dishId: string,
    selectedOptions: CartItem['selectedOptions']
  ) => {
    dispatch(doRemoveProductAction({ dishId, selectedOptions }));
  };

  const handleUpdateQuantity = (
    dishId: string,
    selectedOptions: CartItem['selectedOptions'],
    newQuantity: number
  ) => {
    dispatch(
      doUpdateQuantityAction({ dishId, selectedOptions, quantity: newQuantity })
    );
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN');
  };

  const renderOptionValue = (
    value: string | SelectedOption | SelectedOption[]
  ): React.ReactNode => {
    if (typeof value === 'string') {
      if (value.includes('(+')) {
        // Split the string into individual options
        const options = value.split(',').map((option) => option.trim());
        return (
          <>
            {options.map((option, index) => (
              <React.Fragment key={index}>
                {option}
                {index < options.length - 1 && <br />}
              </React.Fragment>
            ))}
          </>
        );
      }
      return value;
    }
    if (Array.isArray(value)) {
      return (
        <>
          {value.map((option, index) => (
            <React.Fragment key={index}>
              {option.name} (+{formatPrice(option.price)} VNĐ)
              {index < value.length - 1 && <br />}
            </React.Fragment>
          ))}
        </>
      );
    }
    return `${value.name} (+${formatPrice(value.price)} VNĐ)`;
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.detail.price * item.quantity,
      0
    );
  };

  const checkCouponValidity = (coupon: Coupon, subtotal: number) => {
    const currentDate = new Date();
    const startDate = new Date(coupon.startDate);
    const expirationDate = new Date(coupon.expirationDate);

    if (coupon.status !== 'ACTIVE') {
      return 'Coupon is not active';
    }
    if (currentDate < startDate) {
      return 'Coupon is not yet valid';
    }
    if (currentDate > expirationDate) {
      return 'Coupon has expired';
    }
    if (subtotal < coupon.minOrderValue) {
      return `Minimum order value of ${formatPrice(coupon.minOrderValue)} VNĐ not met`;
    }
    if (coupon.availableQuantity <= 0) {
      return 'Coupon is out of stock';
    }
    return null;
  };

  useEffect(() => {
    if (appliedCoupon) {
      const subtotal = calculateSubtotal();
      const discountAmount = Math.min(
        (subtotal * appliedCoupon.discountPercent) / 100,
        appliedCoupon.maxDiscount
      );
      setAppliedCoupon((prevCoupon) => ({ ...prevCoupon!, discountAmount }));
    }
  }, [cartItems]);

  const applyCoupon = async () => {
    const coupon = coupons.find((c) => c.couponCode === couponCode);
    if (!coupon) {
      notification.error({
        message: 'Invalid coupon code',
        duration: 2,
        showProgress: true,
      });
      setAppliedCoupon(null);
      return;
    }

    if (userId) {
      const response = await callCheckCouponUsageByCodeAndUserId(
        coupon.couponCode,
        userId
      );
      if (response.status === 400) {
        notification.error({
          message: 'Coupon has already been used',
          duration: 2,
          showProgress: true,
        });
        setAppliedCoupon(null);
        return;
      }
    }

    const subtotal = calculateSubtotal();
    const validationError = checkCouponValidity(coupon, subtotal);
    if (validationError) {
      notification.error({
        message: validationError,
        duration: 2,
        showProgress: true,
      });
      setAppliedCoupon(null);
      return;
    }

    const discountAmount = Math.min(
      (subtotal * coupon.discountPercent) / 100,
      coupon.maxDiscount
    );
    setAppliedCoupon({ ...coupon, discountAmount });
    notification.success({
      message: 'Coupon applied successfully',
      duration: 2,
      showProgress: true,
    });
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
    return subtotal - discount;
  };

  const handleClearCart = () => {
    dispatch(doClearCartAction());
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      notification.warning({
        message: 'Please log in before checkout !!',
        description: 'Please log in to proceed with the checkout.',
        duration: 3,
        showProgress: true,
      });
      openModal('login');
    } else {
      const orderSummary: OrderSummary = {
        subtotal: calculateSubtotal(),
        delivery: 0,
        discount: appliedCoupon ? appliedCoupon.discountAmount : 0,
        total: calculateTotal(),
        appliedCoupon: appliedCoupon,
      };

      navigate('/checkout', {
        state: { orderSummary },
      });
    }
  };

  return (
    <>
      <section
        className="fp__breadcrumb"
        style={{ background: 'url(images/counter_bg.jpg)' }}
      >
        <div className="fp__breadcrumb_overlay">
          <div className="container">
            <div className="fp__breadcrumb_text">
              <h1>cart view</h1>
              <ul>
                <li>
                  <NavLink to="/">home</NavLink>
                </li>
                <li>
                  <NavLink to="/cart">cart view</NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="fp__cart_view mt_50 xs_mt_95 mb_50 xs_mb_70">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 wow fadeInUp" data-wow-duration="1s">
              <div className="fp__cart_list">
                <div className="table-responsive">
                  <table>
                    <tbody>
                      <tr>
                        <th className="fp__pro_img">Image</th>
                        <th className="fp__pro_name">details</th>
                        <th className="fp__pro_status">price</th>
                        <th className="fp__pro_select">quantity</th>
                        <th className="fp__pro_tk">total</th>
                        <th className="fp__pro_icon">
                          <Popconfirm
                            title="Remove all products"
                            description="Are you sure you want to remove all products from the cart?"
                            onConfirm={handleClearCart}
                            okText="Yes"
                            cancelText="No"
                          >
                            <a href="#" className="clear_all">
                              clear all
                            </a>
                          </Popconfirm>
                        </th>
                      </tr>
                      {cartItems.map((item) => (
                        <tr key={item.dishId}>
                          <td className="fp__pro_img">
                            <img
                              src={item.detail.thumbImage}
                              alt="product"
                              className="image-cart"
                            />
                          </td>
                          <td className="fp__pro_name">
                            <a href="#">{item.detail.dishName}</a>
                            {Object.entries(item.selectedOptions).map(
                              ([key, value]) => (
                                <p key={key}>{renderOptionValue(value)}</p>
                              )
                            )}
                          </td>
                          <td className="fp__pro_status">
                            <h6>{formatPrice(item.detail.price)} VNĐ</h6>
                          </td>
                          <td className="fp__pro_select">
                            <div className="quentity_btn">
                              {item.quantity > 1 ? (
                                <button
                                  className="btn btn-danger"
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item.dishId,
                                      item.selectedOptions,
                                      item.quantity - 1
                                    )
                                  }
                                >
                                  <i className="fal fa-minus"></i>
                                </button>
                              ) : (
                                <Popconfirm
                                  title="Remove product"
                                  description="Are you sure you want to remove this product from the cart?"
                                  onConfirm={() =>
                                    handleRemoveItem(
                                      item.dishId,
                                      item.selectedOptions
                                    )
                                  }
                                  okText="Có"
                                  cancelText="Không"
                                >
                                  <button className="btn btn-danger">
                                    <i className="fal fa-minus"></i>
                                  </button>
                                </Popconfirm>
                              )}
                              <input
                                type="text"
                                placeholder={item.quantity.toString()}
                                readOnly
                              />
                              <button
                                className="btn btn-success"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.dishId,
                                    item.selectedOptions,
                                    item.quantity + 1
                                  )
                                }
                              >
                                <i className="fal fa-plus"></i>
                              </button>
                            </div>
                          </td>
                          <td className="fp__pro_tk">
                            <h6>
                              {formatPrice(item.detail.price * item.quantity)}{' '}
                              VNĐ
                            </h6>
                          </td>
                          <td className="fp__pro_icon">
                            <a
                              href="#"
                              onClick={() =>
                                handleRemoveItem(
                                  item.dishId,
                                  item.selectedOptions
                                )
                              }
                            >
                              <i className="far fa-times"></i>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col-lg-4 wow fadeInUp" data-wow-duration="1s">
              <div className="fp__cart_list_footer_button">
                <h6>total cart</h6>
                <p>
                  subtotal: <span>{formatPrice(calculateSubtotal())} VNĐ</span>
                </p>
                <p>
                  delivery: <span>0 VNĐ</span>
                </p>
                <p>
                  discount:{' '}
                  <span>
                    {appliedCoupon
                      ? formatPrice(appliedCoupon.discountAmount)
                      : 0}{' '}
                    VNĐ
                  </span>
                </p>
                <p className="total">
                  <span>total:</span>{' '}
                  <span>{formatPrice(calculateTotal())} VNĐ</span>
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    applyCoupon();
                  }}
                >
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button type="submit">apply</button>
                </form>
                <a className="common_btn" onClick={handleCheckout}>
                  checkout
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Coupon cartItems={cartItems} />
    </>
  );
};

export default CartPage;
