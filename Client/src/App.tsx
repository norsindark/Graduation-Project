import { useEffect, useCallback } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routers/Router";
import Loading from "./components/Loading/Loading";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { doLoginAction, doLogoutAction, setLoading } from "./redux/account/accountSlice";
import { callProfile } from "./services/clientApi";
// import Cookies from 'js-cookie';

function App() {
    const dispatch = useDispatch();
    const isLoading = useSelector((state: RootState) => state.account.isLoading);
    const isAuthenticated = useSelector((state: RootState) => state.account.isAuthenticated);

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
            } else {
                dispatch(doLogoutAction());
            }
        } catch (error) {
            console.error("Failed to fetch:", error);
            dispatch(doLogoutAction());
        }
    }, [dispatch, isPublicRoute]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token && !isAuthenticated) {
            dispatch(setLoading(true));
            setTimeout(() => {
                getAccount().catch(err => console.error("Error during account fetch:", err));
            }, 1000);
        } else {
            dispatch(setLoading(false));
        }
    }, [isAuthenticated, getAccount, dispatch]);


    // useEffect(() => {
    //     const token = Cookies.get('refreshToken');
    //     console.log(token); // Should log "12345"

    // }, []);
    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                <RouterProvider router={router} />
            )}
        </>
    );
}

export default App;
