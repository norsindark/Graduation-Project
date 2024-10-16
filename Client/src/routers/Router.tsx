import { createBrowserRouter } from 'react-router-dom';
import LayoutPublic from '../components/public/layout/LayoutPublic';
// import LayoutAdmin from "../pages/admin/LayoutAdmin";
import HomePage from '../pages/public/HomePage';
// import RegisterModal from '../pages/public/RegisterModal';

// import LoginModal from '../pages/public/LoginModal';
import NotFound from '../components/NotFound/NotFound';
// import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
// import ForgotPassword from '../components/public/auth/forgotpassword/ForgotPassword';
// import ResetPassword from '../components/public/auth/resetpassword/ResetPassword';
// import ResendVerifyEmail from '../components/public/auth/resendverifyemail/ResendVerifyEmail';
// import VerifyEmail from '../components/public/auth/verifyemail/VerifyEmail';
// import Account from '../components/public/auth/account/Account';
import Main from '../components/admin/layout/Main';
import Home from '../pages/admin/Home';
import Category from '../pages/admin/categoris/Category';
import AccountAdmin from '../pages/admin/accountAdmin/AccountAdmin';
import Warehouse from '../pages/admin/warehouse/Warehouse';
import Product from '../pages/admin/product/Product';
import User from '../pages/admin/user/User';
import Order from '../pages/admin/order/Order';
import AttendanceManagement from '../pages/admin/attendanceManagement/AttendanceManagement';
import AboutPage from '../pages/public/AboutPage';
import MenuPage from '../pages/public/MenuPage';
import ProductDetail from '../pages/public/ProductDetail';
import CartPage from '../pages/public/CartPage';
import CheckoutPage from '../pages/public/CheckoutPage';
import ProductOption from '../pages/admin/productoption/ProductOption';
export const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutPublic />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: 'register',
        element: <HomePage />,
      },
      {
        path: 'login',
        element: <HomePage />,
      },
      {
        path: 'forgot-password',
        element: <HomePage />,
      },
      {
        path: 'reset-password',
        element: <HomePage />,
      },
      {
        path: 'resend-verification-email',
        element: <HomePage />,
      },
      {
        path: 'verify-email',
        element: <HomePage />,
      },
      {
        path: `/callback`,
        element: <HomePage />,
      },
      {
        path: 'account',
        element: <HomePage />,
      },
      {
        path: '/about',
        element: <AboutPage />,
      },
      {
        path: '/menu',
        element: <MenuPage />,
      },
      {
        path: '/product-detail',
        element: <ProductDetail />,
      },
      {
        path: '/cart',
        element: <CartPage />,
      },
      {
        path: '/checkout',
        element: <CheckoutPage />,
      },
    ],
  },
  {
    path: '/',
    element: (
      // <ProtectedRoute>
      <Main />
      //* </ProtectedRoute> */}
    ),
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        path: 'dashboard',
        element: <Home />,
      },
      {
        path: '/user',
        element: <User />,
      },
      {
        path: '/attendance',
        element: <AttendanceManagement />,
      },
      {
        path: '/category',
        element: <Category />,
      },
      {
        path: '/account-admin',
        element: <AccountAdmin />,
      },
      {
        path: '/warehouse',
        element: <Warehouse />,
      },
      {
        path: '/product',
        element: <Product />,
      },
      {
        path: '/product-option',
        element: <ProductOption />,
      },
      {
        path: '/order',
        element: <Order />,
      },
    ],
  },
]);
