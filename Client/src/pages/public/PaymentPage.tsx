import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import cod from '../../../public/images/cod.png';
import vnpay from '../../../public/images/vnpay.png';
import { Image } from 'antd';
import { notification } from 'antd';
import { callCreateOrder } from '../../services/clientApi';
import { CartItem } from '../../redux/order/orderSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

// Add formatPrice function
const formatPrice = (price: number) => {
  return Math.round(price).toLocaleString('vi-VN');
};

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderSummary, selectedAddressId, cartItems } = location.state || {};

  const userId = useSelector((state: RootState) => state.account.user?.id);
  console.log(orderSummary);

  const handlePayment = async (paymentMethod: 'COD' | 'BANKING') => {
    try {
      if (!userId || !selectedAddressId || !cartItems) {
        notification.error({
          message: 'Payment Error',
          description: 'Missing order information',
        });
        return;
      }

      const orderData = {
        userId,
        addressId: selectedAddressId,
        couponId: orderSummary?.couponId || '',
        paymentMethod,
        items: cartItems.map((item: CartItem) => ({
          dishId: item.dishId,
          quantity: item.quantity,
          dishOptionSelectionIds: item.selectedOptions || [],
        })),
        note: '',
        shippingFee: orderSummary?.delivery || 0,
        totalPrice: orderSummary?.total || 0,
      };

      const response = await callCreateOrder(
        orderData.userId,
        orderData.addressId,
        orderData.couponId,
        orderData.paymentMethod,
        orderData.items,
        orderData.note,
        orderData.shippingFee,
        orderData.totalPrice
      );

      if (paymentMethod === 'BANKING') {
        if (response.data?.paymentUrl) {
          window.location.href = response.data.paymentUrl;
        }
      } else {
        notification.success({
          message: 'Order Placed Successfully',
          description: 'Thank you for your order',
        });
        navigate('/order-success', {
          state: { orderId: response.data?.orderId },
        });
      }
    } catch (error) {
      notification.error({
        message: 'Payment Error',
        description: 'An error occurred during payment processing',
      });
      console.error('Payment error:', error);
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
