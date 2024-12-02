import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import NotPermitted from './NotPermitted';
import { RootState } from '../../redux/store';

interface RoleBaseRouteProps {
  children: ReactNode;
}

const RoleBaseRoute: React.FC<RoleBaseRouteProps> = ({ children }) => {
  const allowedRoutes = [
    '/dashboard',
    '/user',
    '/employee-shift',
    '/attendance',
    '/category',
    '/account-admin',
    '/warehouse',
    '/product-daily-offer',
    '/product',
    '/product-option',
    '/coupon',
    '/order',
    '/review',
    '/setting',
    '/category-blog-admin',
    '/blog-admin',
    '/comments-blog-admin',
  ];

  const isAdminRoute = allowedRoutes.some((route) =>
    window.location.pathname.startsWith(route)
  );
  const user = useSelector((state: RootState) => state.account.user);
  const userRole = user?.role?.name;

  if (isAdminRoute && userRole === 'ADMIN') {
    return <>{children}</>;
  } else {
    return <NotPermitted />;
  }
};

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.account.isAuthenticated
  );

  return isAuthenticated ? (
    <RoleBaseRoute>{children}</RoleBaseRoute>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
