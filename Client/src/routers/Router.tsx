import {createBrowserRouter} from "react-router-dom";
import LayoutPublic from "../pages/public/LayoutPublic.tsx";
import LayoutAdmin from "../pages/admin/LayoutAdmin.tsx";
import HomePage from "../pages/public/HomePage.tsx";
import RegisterPage from "../pages/public/RegisterPage.tsx";
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
                element: <RegisterPage/>
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