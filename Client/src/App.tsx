import {
    RouterProvider,
} from "react-router-dom";
import {router} from "./routers/Router.tsx";
import Loading from "./components/Loading/Loading.tsx";
import {useEffect} from "react";
import {callProfile} from "./services/clientApi.ts";
import {doGetAccountAction, doLogoutAction} from "./redux/account/accountSlice.tsx";
import {useDispatch, useSelector} from "react-redux";


function App() {
    const dispatch = useDispatch();
    const isLoading = useSelector((state: any) => state.account.isLoading);

    const getAccount = async () => {
           setTimeout(async () => {
               const res = await callProfile();
               if (res?.data && res?.status == 200) {
                   dispatch(doGetAccountAction(res.data));
               } else {
                   dispatch(doLogoutAction());
               }
           }, 3000);
    };

    useEffect(() => {
        getAccount().catch(err => console.log(err));
    }, []);

    return (
        <>
            {isLoading ? <Loading /> : <RouterProvider router={router} />}
        </>
    );
}

export default App;

