import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { notification } from 'antd';

interface PrivatePaymentRouterProps {
  children: ReactNode;
}

const PrivatePaymentRouter: React.FC<PrivatePaymentRouterProps> = ({
  children,
}) => {
  const location = useLocation();
  const isAuthenticated = useSelector(
    (state: RootState) => state.account.isAuthenticated
  );
  const cartItems = useSelector((state: RootState) => state.order.carts);

  const previousPath = location.state?.from || '/';

  if (cartItems.length === 0) {
    notification.warning({
      message: 'Cart is empty',
      description: 'Please add products to the cart before continuing.',
      duration: 3,
      showProgress: true,
    });
    return <Navigate to="/menu" state={{ from: location }} replace />;
  }

  if (previousPath !== '/cart') {
    notification.warning({
      message: 'Access denied',
      description: 'Please access from the cart page.',
      duration: 3,
      showProgress: true,
    });
    return <Navigate to="/cart" replace />;
  }

  return <>{children}</>;
};

export default PrivatePaymentRouter;
