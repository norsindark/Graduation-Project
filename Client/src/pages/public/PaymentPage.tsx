import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import cod from '../../../public/images/cod.png';
import vnpay from '../../../public/images/vnpay.png';
import { Image } from 'antd';
import { notification } from 'antd';
import { callCreateOrder, callProcessPayment } from '../../services/clientApi';
import { doClearCartAction } from '../../redux/order/orderSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useDispatch } from 'react-redux';
import Loading from '../../components/Loading/Loading';
import { useState } from 'react';
// Add formatPrice function
const formatPrice = (price: number) => {
  return Math.round(price).toLocaleString('vi-VN');
};

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orderSummary, selectedAddressId } = location.state || {};
  const cartItems = useSelector((state: RootState) => state.order.carts);
  const userId = useSelector((state: RootState) => state.account.user?.id);
  const [loading, setLoading] = useState(false);
  const handlePayment = async (paymentMethod: 'COD' | 'BANKING') => {
    setLoading(true);
    try {
      if (!userId || !selectedAddressId || !cartItems?.length) {
        notification.error({
          message: 'Error',
          description: 'Missing order information',
        });
        return;
      }

      const orderItems = cartItems.map((item) => {
        const dishOptionSelectionIds = Object.values(item.selectedOptions || {})
          .map((option) => option.optionSelectionId)
          .filter((id) => id && id.trim() !== '');
        return {
          dishId: item.dishId,
          quantity: item.quantity,
          dishOptionSelectionIds,
        };
      });

      const response = await callCreateOrder(
        userId,
        selectedAddressId,
        orderSummary?.appliedCoupon?.couponId || null,
        paymentMethod,
        orderItems,
        '',
        orderSummary?.delivery || 0
      );
      if (response.status === 200) {
        if (paymentMethod === 'COD') {
          notification.success({
            message: 'Order success',
            description: 'Thank you for your order',
          });
          navigate('/order-success', {
            state: { orderId: response.data?.message },
          });
          dispatch(doClearCartAction());
        } else if (paymentMethod === 'BANKING') {
          await callProcessPayment(response.data?.message);
        } else {
          notification.success({
            message: 'Order success',
            description: 'Thank you for your order',
          });
          navigate('/order-success', {
            state: { orderId: response.data?.message },
          });
          dispatch(doClearCartAction());
        }
      } else {
        notification.error({
          message: 'Payment error',
          description: 'An error occurred during the payment process',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Payment error',
        description: 'An error occurred during the payment process',
      });
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
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
              <h1>Checkout</h1>
              <ul>
                <li>
                  <NavLink to="/">home</NavLink>
                </li>
                <span>
                  <i className="fas fa-angle-right mr-4"></i>
                </span>
                <li>
                  <NavLink to="/cart">Cart</NavLink>
                </li>
                <span>
                  <i className="fas fa-angle-right mr-4"></i>
                </span>
                <li>
                  <NavLink to="/checkout">Checkout</NavLink>
                </li>
                <span>
                  <i className="fas fa-angle-right mr-4"></i>
                </span>
                <li>
                  <NavLink to="/payment">Payment</NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="fp__payment_page mt_100 xs_mt_70 mb_100 xs_mb_70">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="fp__payment_area">
                <div className="flex flex-col space-y-6">
                  <h2 className="text-2xl font-bold text-center text-white bg-[#81c784] p-2 rounded-lg">
                    Select Payment Method
                  </h2>
                  <div className="grid grid-cols-2 gap-6">
                    {/* Cash on Delivery */}
                    <div className="transform transition-all hover:scale-105">
                      <button
                        className="w-full p-4 border-2 rounded-lg hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        onClick={() => handlePayment('COD')}
                      >
                        <div className="flex flex-col items-center space-y-3">
                          <Image
                            src={cod}
                            alt="Cash on Delivery"
                            className="w-16 h-16 object-contain"
                            preview={false}
                          />
                          <span className="font-bold text-gray-700">
                            Cash on Delivery
                          </span>
                        </div>
                      </button>
                    </div>

                    {/* VNPay */}
                    <div className="transform transition-all hover:scale-105">
                      <button
                        className="w-full p-4 border-2 rounded-lg hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        onClick={() => handlePayment('BANKING')}
                      >
                        <div className="flex flex-col items-center space-y-3">
                          <Image
                            src={vnpay}
                            alt="VNPay"
                            className="w-16 h-16 object-contain"
                            preview={false}
                          />
                          <span className="font-bold text-gray-700">VNPay</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 mt_25 wow fadeInUp" data-wow-duration="1s">
              <div className="fp__cart_list_footer_button">
                <h6>Order Summary</h6>
                <p>
                  subtotal:{' '}
                  <span>{formatPrice(orderSummary?.subtotal || 0)} VNĐ</span>
                </p>
                <p>
                  delivery:{' '}
                  <span>{formatPrice(orderSummary?.delivery || 0)} VNĐ</span>
                </p>
                <p>
                  discount:{' '}
                  <span>{formatPrice(orderSummary?.discount || 0)} VNĐ</span>
                </p>
                <p className="total">
                  <span>total:</span>{' '}
                  <span>{formatPrice(orderSummary?.total || 0)} VNĐ</span>
                </p>

                <form>
                  {orderSummary?.appliedCoupon && (
                    <>
                      <div className="flex items-center ">
                        <span className=" w-[181px] ml-4">
                          Applied Coupon:{' '}
                        </span>
                        <input
                          type="text"
                          value={orderSummary.appliedCoupon.couponCode}
                          disabled
                          className="applied-coupon-input"
                        />
                      </div>
                    </>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default PaymentPage;
