import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import { Link } from 'react-router-dom';
import {
  doRemoveProductAction,
  CartItem,
  SelectedOption,
  doUpdateQuantityAction,
} from '../../../redux/order/orderSlice';

const Cart = ({
  showCart,
  setShowCart,
}: {
  showCart: boolean;
  setShowCart: (showCart: boolean) => void;
}) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.order.carts);

  const handleRemoveItem = (
    dishId: string,
    selectedOptions: CartItem['selectedOptions']
  ) => {
    dispatch(doRemoveProductAction({ dishId, selectedOptions }));
  };

  const formatPrice = (price: number | undefined) => {
    return price ? price.toLocaleString('vi-VN') : '0';
  };

  const renderOptionValue = (
    value: string | SelectedOption
  ): React.ReactNode => {
    if (typeof value === 'string') {
      const options = value.split(/,(?![^(]*\))/);
      return (
        <>
          {options.map((option, index) => (
            <React.Fragment key={index}>
              {option.trim()}
              {index < options.length - 1 && <br />}
            </React.Fragment>
          ))}
        </>
      );
    } else {
      return `${value.name} (+ ${formatPrice(value.price)} VNĐ)`;
    }
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + item.detail?.price * item.quantity;
    }, 0);
  };

  return (
    <>
      <div
        className={`fp__menu_cart_area  ${showCart ? 'show_mini_cart' : ''}`}
      >
        <div className="fp__menu_cart_boody">
          <div className="fp__menu_cart_header">
            <h5>total item ({cartItems.length})</h5>
            <span className="close_cart" onClick={() => setShowCart(false)}>
              <i className="fal fa-times"></i>
            </span>
          </div>
          <ul>
            {cartItems.map((item) => (
              <li key={item.dishId}>
                <div className="menu_cart_img">
                  <img
                    src={item.detail?.thumbImage}
                    alt="menu"
                    className="img-fluid w-100"
                  />
                </div>
                <div className="menu_cart_text">
                  <a className="title" href="#">
                    {item.detail?.dishName} ({item.quantity})
                  </a>

                  {Object.entries(item.selectedOptions || {}).map(
                    ([key, value]) => (
                      <span key={key} className="extra">
                        {renderOptionValue(value)}
                      </span>
                    )
                  )}

                  <p className="price">
                    {formatPrice(item.detail?.price * item.quantity)} VNĐ
                  </p>
                </div>
                <span
                  className="del_icon"
                  onClick={() =>
                    handleRemoveItem(item.dishId, item.selectedOptions)
                  }
                >
                  <i className="fal fa-times"></i>
                </span>
              </li>
            ))}
          </ul>
          <p className="subtotal">
            sub total <span>{formatPrice(calculateTotalPrice())} VNĐ</span>
          </p>
          <Link
            className="cart_view hover:bg-black"
            onClick={() => setShowCart(false)}
            to="/cart"
          >
            view cart
          </Link>
        </div>
      </div>
    </>
  );
};

export default Cart;
