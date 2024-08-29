import {Outlet} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";

const LayoutAdmin = () => {
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    const user = useSelector((state: RootState) => state.account.user);
    const userRole = user?.role?.name;
    return (
        <>
            {
                isAdminRoute && userRole === 'ADMIN' && <h3>Header admin</h3>
            }
            <div className="container">
                <Outlet/>
            </div>
            {
                isAdminRoute && userRole === 'ADMIN' && <h3>footer admin</h3>
            }
        </>
    )
}

export default LayoutAdmin;