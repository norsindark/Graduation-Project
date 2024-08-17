import {createBrowserRouter} from "react-router-dom";
import LayoutPublic from "../pages/public/LayoutPublic.tsx";
import LayoutAdmin from "../pages/admin/LayoutAdmin.tsx";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <LayoutPublic/>,
        children: [
            {
                index:true,
                element: <h1>home</h1>
            }
        ]
    },

    {
        path: "/admin",
        element: <LayoutAdmin/>,
        children: [
            {
                index:true,
                element: <h1>admin</h1>
            }
        ]
    }
])