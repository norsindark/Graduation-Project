import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { notification } from 'antd';

interface PrivateRouterProps {
  children: ReactNode;
}

const PrivateRouter: React.FC<PrivateRouterProps> = ({ children }) => {
  const location = useLocation();
  const cartItems = useSelector((state: RootState) => state.order.carts);

  if (cartItems.length === 0) {
    notification.warning({
      message: 'Cart is empty',
      description: 'Please add products to the cart before continuing.',
      duration: 3,
      showProgress: true,
    });
    return <Navigate to="/menu" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRouter;
