import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Account from '../../components/public/auth/account/Account';
interface OrderSuccessProps {
  setActiveModal: (modalName: string | null) => void;
}

function OrderSuccess({ setActiveModal }: OrderSuccessProps) {
  const location = useLocation();

  const { orderId, paymentMethod } = location.state || {};

  console.log('orderId', location.state);

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const handleViewOrders = () => {
    setIsAccountModalOpen(true);
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
              <h1>Order Success</h1>
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
                  <NavLink to="/order-success">Order Success</NavLink>
                </li>
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
              </div>
              <h4 className="text-2xl font-bold mb-4">
                Order Placed Successfully!
              </h4>

              <div className="bg-blue-50 p-4 rounded-lg mb-6 max-w-md mx-auto">
                <i className="fas fa-envelope text-blue-500 text-xl mb-2"></i>
                <p className="text-gray-700 font-medium text-base">
                  We have sent the order confirmation to your email. Please
                  check your inbox for order details.
                </p>
              </div>

              {orderId && (
                <p className="text-gray-600 mb-4">
                  Order ID: <span className="font-semibold">{orderId}</span>
                </p>
              )}

              <div className="flex justify-center gap-4">
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

export default OrderSuccess;
