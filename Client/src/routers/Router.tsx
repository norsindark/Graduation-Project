import {createBrowserRouter} from "react-router-dom";
import LayoutPublic from "../pages/public/LayoutPublic.tsx";
import LayoutAdmin from "../pages/admin/LayoutAdmin.tsx";
import HomePage from "../pages/public/HomePage.tsx";
import RegisterModal from "../pages/public/RegisterModal.tsx";

import LoginModal from "../pages/public/LoginModal.tsx";
import NotFound from "../components/NotFound/NotFound.tsx";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <LayoutPublic/>,
        errorElement: <NotFound/>,
        children: [
            {
                index: true,
                element: <HomePage/>
            },
            {
                path: "/register",
                element: <RegisterModal/>
            },
            {
                path: "/login",
                element: <LoginModal/>
            }
        ]
    },
    {
        path: "/admin",
        element: <LayoutAdmin/>,
        errorElement: <NotFound/>,
        children: [
            {
                index: true,
                element:
                    <ProtectedRoute>
                        <h1>admin</h1>
                    </ProtectedRoute>
            }
        ]
    },

])