import {useEffect} from "react";
import {RouterProvider} from "react-router-dom";
import {router} from "./routers/Router";
import Loading from "./components/Loading/Loading";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "./redux/store";
import {doGetAccountAction, doLogoutAction} from "./redux/account/accountSlice";
import {callProfile} from "./services/clientApi.ts";

function App() {
    const dispatch = useDispatch();
    const isLoading = useSelector((state: RootState) => state.account.isLoading);
    const isAuthenticated = useSelector((state: RootState) => state.account.isAuthenticated);

    const pathname = window.location.pathname;

    const isPublicRoute = () => {
        const publicPaths = ['/login', '/register'];
        return publicPaths.includes(pathname);
    };

    const getAccount = async () => {
        if (isPublicRoute()) return;
        try {
            const res = await callProfile();
            if (res?.data && res?.status === 200) {
                dispatch(doGetAccountAction(res.data));
            } else {
                dispatch(doLogoutAction());
            }
        } catch (error) {
            console.error("Failed to fetch:", error);
            dispatch(doLogoutAction());
        }
    };

    useEffect(() => {
        getAccount().catch(err => console.error("Error during account fetch:", err));
    }, []);

    return (
        <>
            {!isLoading && (isAuthenticated || isPublicRoute()) ? (
                <RouterProvider router={router}/>
            ) : (
                <Loading/>
            )}
        </>
    );
}

export default App;
