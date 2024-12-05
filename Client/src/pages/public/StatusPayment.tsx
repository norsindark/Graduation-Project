import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Account from '../../components/public/auth/account/Account';
import {
  callProcessPayment,
  callUpdateStatusOrder,
  callRepayOrder,
} from '../../services/clientApi';
import { Modal, notification } from 'antd';
import cod from '../../../public/images/cod.png';
import vnpay from '../../../public/images/vnpay.png';
import { Image, Popconfirm } from 'antd';

interface StatusPaymentProps {
  setActiveModal: (modalName: string | null) => void;
}

function StatusPayment({ setActiveModal }: StatusPaymentProps) {
  const location = useLocation();
  const { orderId, paymentMethod, paymentStatus } = location.state || {};
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderId || !paymentMethod || !paymentStatus) {
      navigate('/cart');
    }
  }, [orderId, paymentMethod, paymentStatus]);

  const handleViewOrders = () => {
    setIsAccountModalOpen(true);
  };

  const orderIdNew = orderId?.includes('Payment failed with order:')
    ? orderId.split(': ')[1].trim()
    : orderId;

  const handlePayment = async (paymentMethod: 'COD' | 'BANKING') => {
    setLoading(true);
    try {
      if (paymentMethod === 'COD') {
        try {
          const response = await callRepayOrder(orderIdNew);
          if (response.status === 200) {
            notification.success({
              message: 'Order success',
              description: (
                <div>
                  <p>Thank you for your order!</p>
                  <p>Please check your email for order details.</p>
                </div>
              ),
              duration: 5,
              placement: 'top',
            });
          } else {
            notification.error({
              message: 'Error',
              description:
                response.data?.errors?.error || 'Order update failed',
              duration: 5,
              showProgress: true,
            });
          }
          navigate('/status-payment', {
            state: {
              orderId: orderIdNew,
              paymentMethod: 'COD',
              paymentStatus: 'success',
              from: 'status-payment',
            },
          });
        } catch (updateError) {
          console.error('Error updating order status:', updateError);
        }
      } else if (paymentMethod === 'BANKING') {
        await callProcessPayment(orderIdNew);
      }
      setIsPaymentModalOpen(false);
    } catch (error: any) {
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  const PaymentModal = () => {
    return (
      <Modal
        open={isPaymentModalOpen}
        onCancel={() => setIsPaymentModalOpen(false)}
        footer={null}
        width={600}
        centered
      >
        <div className="flex flex-col space-y-6">
          <h2 className="text-2xl font-bold text-center text-white bg-[#81c784] p-2 rounded-lg mt-4">
            Select Payment Method
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {/* Cash on Delivery */}
            <div className="transform transition-all hover:scale-105">
              <Popconfirm
                title="Are you sure you want to pay by cash on delivery?"
                onConfirm={() => handlePayment('COD')}
                okButtonProps={{ loading: loading }}
              >
                <button
                  className="w-full p-4 border-2 rounded-lg hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={loading}
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
              </Popconfirm>
            </div>

            {/* VNPay */}
            <div className="transform transition-all hover:scale-105">
              <Popconfirm
                title="Are you sure you want to pay by banking?"
                onConfirm={() => handlePayment('BANKING')}
                okButtonProps={{ loading: loading }}
              >
                <button
                  className="w-full p-4 border-2 rounded-lg hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={loading}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <Image
                      src={vnpay}
                      alt="VNPay"
                      className="w-16 h-16 object-contain"
                      preview={false}
                    />
                    <span className="font-bold text-gray-700">Banking</span>
                  </div>
                </button>
              </Popconfirm>
            </div>
          </div>
        </div>
      </Modal>
    );
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
              {paymentStatus === 'success' ? (
                <h1>Order Success</h1>
              ) : (
                <h1>Order Failed</h1>
              )}
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
                {paymentStatus === 'success' ? (
                  <li>
                    <NavLink to="/status-payment">Order Success</NavLink>
                  </li>
                ) : (
                  <li>
                    <NavLink to="/status-payment">Order Failed</NavLink>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="fp__payment_page mt_100 xs_mt_70 mb_100 xs_mb_70">
        <div className="container">
          <div className="row">
            <div className="text-center">
              <div className="mb-4">
                {paymentStatus === 'success' ? (
                  <i
                    className="fas fa-check"
                    style={{
                      fontSize: '70px',
                      background: 'green',
                      padding: '20px',
                      borderRadius: '50%',
                      color: '#fff',
                    }}
                  ></i>
                ) : (
                  <i
                    className="fas fa-times"
                    style={{
                      fontSize: '50px',
                      width: '85px',
                      height: '85px',
                      background: 'red',
                      padding: '20px',
                      borderRadius: '50%',
                      color: '#fff',
                    }}
                  ></i>
                )}
              </div>
              {paymentStatus === 'success' ? (
                <h4 className="text-2xl font-bold mb-4">
                  Order Placed Successfully!
                </h4>
              ) : (
                <h4 className="text-2xl font-bold mb-4">
                  Order Placed Failed!
                </h4>
              )}
              <div className="bg-blue-50 p-4 rounded-lg mb-6 max-w-md mx-auto">
                {paymentStatus === 'success' ? (
                  <>
                    <i className="fas fa-envelope text-blue-500 text-2xl mb-2"></i>
                    <p className="text-gray-700 font-medium text-base">
                      We have sent the order confirmation to your email. Please
                      check your inbox for order details.
                    </p>
                  </>
                ) : (
                  <>
                    <i className="fas fa-credit-card text-blue-500 text-2xl mb-2"></i>
                    <p className="text-gray-700 font-medium text-base">
                      Please check your payment information and pay for your
                      order here or profile
                    </p>
                  </>
                )}
              </div>

              {orderId && (
                <p className="text-gray-600 mb-4">
                  {paymentStatus === 'success' ? 'Order ID:' : ''}
                  <span className="font-semibold">{orderId}</span>
                </p>
              )}

              <div className="flex justify-center gap-4">
                {paymentStatus !== 'success' && (
                  <a
                    className="common_btn"
                    onClick={() => setIsPaymentModalOpen(true)}
                  >
                    Pay Again
                  </a>
                )}
                <a className="common_btn" href="/menu">
                  Buy more Dishes
                </a>
                <a className="common_btn" onClick={handleViewOrders}>
                  View Orders
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <PaymentModal />
      {isAccountModalOpen && (
        <Account
          onClose={() => {
            setIsAccountModalOpen(false);
          }}
          initialActiveTab="order"
          editingAddressId={null}
          setActiveModal={setActiveModal}
        />
      )}
    </>
  );
}

export default StatusPayment;
