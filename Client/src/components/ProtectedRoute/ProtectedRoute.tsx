import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import NotPermitted from './NotPermitted';
import { RootState } from '../../redux/store';

interface RoleBaseRouteProps {
  children: ReactNode;
}

const RoleBaseRoute: React.FC<RoleBaseRouteProps> = ({ children }) => {
  const isAdminRoute = window.location.pathname.startsWith('/dashboard');
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

  return (
    <>
      {isAuthenticated ? (
        <RoleBaseRoute>{children}</RoleBaseRoute>
      ) : (
        <Navigate to="/login" replace />
      )}
    </>
  );
};

export default ProtectedRoute;
