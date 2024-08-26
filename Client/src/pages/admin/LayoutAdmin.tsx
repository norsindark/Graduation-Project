import {Outlet} from "react-router-dom";

const LayoutAdmin = () => {
    return (
        <>
            <div className="container">
                <Outlet />
            </div>
        </>
    )
}

export default LayoutAdmin;