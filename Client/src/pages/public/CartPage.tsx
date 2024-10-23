import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Popconfirm } from 'antd';
import { RootState } from '../../redux/store';
import {
  doRemoveProductAction,
  doUpdateQuantityAction,
  doClearCartAction,
  CartItem,
  SelectedOption,
} from '../../redux/order/orderSlice';

const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.order.carts);

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
  const handleClearCart = () => {
    dispatch(doClearCartAction());
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

      <section className="fp__cart_view mt_125 xs_mt_95 mb_100 xs_mb_70">
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
                  discount: <span>0 VNĐ</span>
                </p>
                <p className="total">
                  <span>total:</span>{' '}
                  <span>{formatPrice(calculateSubtotal())} VNĐ</span>
                </p>
                <form>
                  <input type="text" placeholder="Coupon Code" />
                  <button type="submit">apply</button>
                </form>
                <NavLink className="common_btn" to="/checkout">
                  checkout
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CartPage;
