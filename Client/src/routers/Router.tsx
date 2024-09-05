import { createBrowserRouter } from "react-router-dom";
import LayoutPublic from "../pages/public/LayoutPublic";
import LayoutAdmin from "../pages/admin/LayoutAdmin";
import HomePage from "../pages/public/HomePage";
import RegisterModal from "../pages/public/RegisterModal";

import LoginModal from "../pages/public/LoginModal";
import NotFound from "../components/NotFound/NotFound";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import ForgotPassword from "../components/public/auth/forgotpassword/ForgotPassword";
import ResetPassword from "../components/public/auth/resetpassword/ResetPassword";
import ResendVerifyEmail from "../components/public/auth/resendverifyemail/ResendVerifyEmail";
import VerifyEmail from "../components/public/auth/verifyemail/VerifyEmail";
import SocialLogin from "../components/public/sociallogin/SocialLogin";
export const router = createBrowserRouter([
    {
        path: "/",
        element: <LayoutPublic />,
        errorElement: <NotFound />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: "/register",
                element: <RegisterModal />
            },
            {
                path: "/login",
                element: <LoginModal />
            },
            {
                path: "/forgot-password",
                element: <ForgotPassword />
            },
            {
                path: "/reset-password",
                element: <ResetPassword />
            },
            {
                path: "/resend-verification-email",
                element: <ResendVerifyEmail />
            },
            {
                path: "/verify-email",
                element: <VerifyEmail />
            },
            // {
            //     path: "/oauth2/authorization/google",
            //     element: <SocialLogin />
            // }
            // {
            //     path: "/account",
            //     element: <Account />
            // }
        ]
    },
    {
        path: "/admin",
        element: <LayoutAdmin />,
        errorElement: <NotFound />,
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