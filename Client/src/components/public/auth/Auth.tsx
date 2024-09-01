import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useState, useEffect, useRef } from "react";
import { callLogout } from "../../../services/clientApi";
import { doLogoutAction } from "../../../redux/account/accountSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Auth = () => {
    const style = "w-[245px] h-[51px]";
    const isAuthenticated = useSelector((state: RootState) => state.account.isAuthenticated);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    console.log("isAuthenticated", isAuthenticated);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const res = await callLogout();
            console.log("tesst", res);
            dispatch(doLogoutAction());
            navigate('/');
        } catch (error) {
            console.error("Lỗi khi đăng xuất:", error);
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleMenu = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="navbar-nav md:px-1" ref={menuRef}>
            <li className="nav-item">
                <button className="nav-link mx-1" onClick={toggleMenu}>
                    <i className="fas fa-user pr-1"></i>
                    <i className="far fa-angle-down"></i>
                </button>
                {isMenuOpen && (
                    <ul className="droap_menu overflow-y-hidden " >
                        <li className={style}>
                            <NavLink
                                to="/login"
                                className={style}
                            >
                                Login
                            </NavLink>
                        </li>
                        <li className={style}>
                            <NavLink
                                to="/register"
                                className={style}
                            >
                                Register
                            </NavLink>
                        </li>
                        <li className={style}>
                            <NavLink
                                to="/forgot-password"
                                className={style}
                            >
                                forgot password
                            </NavLink>
                        </li>
                        <li className={style}>
                            <NavLink
                                to="https://mail.google.com/mail/u/0/#inbox"
                                className={style}
                            >
                                Gmail
                            </NavLink>
                        </li>
                        <li className={style}>
                            <NavLink
                                to="/"
                                className={style}
                                onClick={handleLogout}
                            >
                                logout
                            </NavLink>
                        </li>
                    </ul>
                )}
            </li>
        </div>
    )
}

export default Auth
