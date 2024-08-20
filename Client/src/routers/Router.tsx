import {createBrowserRouter} from "react-router-dom";
import LayoutPublic from "../pages/public/LayoutPublic.tsx";
import LayoutAdmin from "../pages/admin/LayoutAdmin.tsx";
import HomePage from "../pages/public/HomePage.tsx";
import RegisterModal from "../pages/public/RegisterModal.tsx";
import LoginPage from "../pages/public/LoginPage.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <LayoutPublic/>,
        children: [
            {
                index:true,
                element: <HomePage/>
            },
            {
                path: "/register",
                element: <RegisterModal/>
            },
            {
                path: "/login",
                element: <LoginPage/>
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
    },

])