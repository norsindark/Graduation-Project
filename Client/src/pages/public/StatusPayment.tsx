import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Account from '../../components/public/auth/account/Account';
import { callGetOrderById } from '../../services/clientApi';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
interface StatusPaymentProps {
  setActiveModal: (modalName: string | null) => void;
}
interface OrderOption {
  optionId: string;
  optionName: string;
  additionalPrice: number;
}

interface OrderItem {
  itemId: string;
  dishId: string;
  dishName: string;
  price: number;
  quantity: number;
  totalPrice: number;
  thumbImage: string;
  options: OrderOption[];
}

interface Address {
  street: string;
  commune: string;
  city: string;
  state: string;
  country: string;
  phoneNumber: string;
}

interface Order {
  orderId: string;
  userEmail: string;
  orderStatus: string;
  totalPrice: number;
  createdAt: string;
  address: Address;
  orderItems: OrderItem[];
}

function StatusPayment({ setActiveModal }: StatusPaymentProps) {
  const location = useLocation();
  const { orderId, paymentMethod, paymentStatus } = location.state || {};
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const handleViewOrders = () => {
    setIsAccountModalOpen(true);
  };
  const userId = useSelector((state: RootState) => state.account.user?.id);
  const [listOrder, setListOrder] = useState<Order[]>([]);
  useEffect(() => {
    fetchOrder();
  }, [orderId]);
  const fetchOrder = async () => {
    try {
      const response = await callGetOrderById(userId || '', '');
      if (response?.status === 200) {
        if (
          response?.data?._embedded?.orderResponseList &&
          Array.isArray(response.data._embedded.orderResponseList)
        ) {
          setListOrder(response.data._embedded.orderResponseList);
        } else {
          setListOrder([]);
        }
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    }
  };

  const handleOrderAgain = () => {
    if (listOrder.length > 0) {
      if (listOrder.find((order) => order.orderId === orderId)) {
      }
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
                <a className="common_btn" onClick={handleOrderAgain}>
                  {paymentStatus === 'success' ? 'Check Order' : 'Pay Again'}
                </a>
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
      {isAccountModalOpen && (
        <Account
          onClose={() => {
            setIsAccountModalOpen(false);
          }}
          initialActiveTab="order"
          editingAddressId={null}
          setActiveModal={setActiveModal} // Thêm dòng này
        />
      )}
    </>
  );
}

export default StatusPayment;
