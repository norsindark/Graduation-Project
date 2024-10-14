import { useEffect, useCallback } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routers/Router';
import Loading from './components/Loading/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './redux/store';
import {
  doLoginAction,
  doLogoutAction,
  setLoading,
} from './redux/account/accountSlice';
import { callProfile } from './services/clientApi';
import { notification } from 'antd';

function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.account.isLoading);
  const isAuthenticated = useSelector(
    (state: RootState) => state.account.isAuthenticated
  );

  const pathname = window.location.pathname;

  const isPublicRoute = useCallback(() => {
    const publicPaths = ['/login', '/register'];
    return publicPaths.includes(pathname);
  }, [pathname]);

  const getAccount = useCallback(async () => {
    if (isPublicRoute()) return;
    try {
      const res = await callProfile();
      if (res?.status === 200) {
        dispatch(doLoginAction(res.data));
        // Check for Google login status
        const googleLogin = localStorage.getItem('googleLogin');
        if (googleLogin === 'true') {
          notification.success({
            message: 'Login success!',
            description: 'You have successfully logged in with Google.',
            duration: 5,
            showProgress: true,
          });
          localStorage.removeItem('googleLogin');
        }
      } else {
        dispatch(doLogoutAction());
      }
    } catch (error) {
      console.error('Failed to fetch:', error);
      dispatch(doLogoutAction());
    }
  }, [dispatch, isPublicRoute]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && !isAuthenticated) {
      dispatch(setLoading(true));
      setTimeout(() => {
        getAccount().catch((err) =>
          console.error('Error during account fetch:', err)
        );
      }, 1000);
    } else {
      dispatch(setLoading(false));
    }
  }, [isAuthenticated, getAccount, dispatch]);

  return <>{isLoading ? <Loading /> : <RouterProvider router={router} />}</>;
}

export default App;
