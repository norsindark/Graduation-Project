import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useState, useEffect, useRef } from "react";
import { callLogout } from "../../../services/clientApi";
import { doLogoutAction } from "../../../redux/account/accountSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { Link } from "react-router-dom";
const Auth = () => {
    const style = "w-[245px] h-[51px]";
    const isAuthenticated = useSelector((state: RootState) => state.account.isAuthenticated);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const user = useSelector((state: RootState) => state.account.user);
    const userRole = user?.role?.name;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [messageApi, contextHolder] = message.useMessage();
    const key = 'updatable';
    const [messageContent, setMessageContent] = useState<{ type: 'loading' | 'success' | 'error', content: string } | null>(null);

    useEffect(() => {
        if (messageContent) {
            messageApi.open({
                key,
                type: messageContent.type,
                content: messageContent.content,
                duration: messageContent.type === 'loading' ? 0 : 2,
            });
        }
    }, [messageContent, messageApi]);

    const handleLogout = async () => {
        try {
            setMessageContent({ type: 'loading', content: 'Loading logout...' });
            messageApi.open({
                key,
                type: 'loading',
                content: 'Loading logout...',
            });
            const res = await callLogout();
            console.log("resLogout", res);

            if (res?.status == 200) {
                dispatch(doLogoutAction());
                navigate('/');
                setTimeout(() => {
                    messageApi.open({
                        key,
                        type: 'success',
                        content: 'Logout success!',
                        duration: 2,
                    });
                }, 1000);
            } else {
                setTimeout(() => {
                    messageApi.open({
                        key,
                        type: 'error',
                        content: 'Logout failed!',
                        duration: 2,
                    });
                }, 1000);
            }
        } catch (error) {
            setTimeout(() => {
                messageApi.open({
                    key,
                    type: 'error',
                    content: 'Logout failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
                    duration: 2,
                });
            }, 1000);
            console.error("Logout failed:", error);
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

    const items = [
        {
            label: <label>Account management</label>,
            key: 'account',
        },
        {
            label:
                <Link
                    to="/"
                    onClick={() => handleLogout()}
                    className={style} // Thêm class style vào đây
                >Logout
                </Link>,
            key: '/',
        },
    ];
    if (userRole === 'ADMIN') {
        items.unshift({
            label: <label>Dashboard</label>,
            key: 'admin',
        })
    }

    return (
        <>
            {contextHolder}
            <div className="navbar-nav md:px-1" ref={menuRef}>
                <li className="nav-item">
                    <button className="nav-link mx-1" onClick={toggleMenu}>
                        <i className="fas fa-user pr-1"></i>
                        <i className="far fa-angle-down"></i>
                    </button>
                    {isMenuOpen && (
                        <ul className="droap_menu overflow-y-hidden">
                            {!isAuthenticated ? (
                                <>
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
                                            Forgot Password
                                        </NavLink>
                                    </li>
                                    <li className={style}>
                                        <NavLink
                                            to="https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox"
                                            className={style}
                                        >
                                            Gmail
                                        </NavLink>
                                    </li>
                                </>
                            ) : (
                                <>
                                    {items.map(item => (
                                        <li key={item.key} className={style}>
                                            {item.key == '/' ? (
                                                <span>{item.label}</span>
                                            ) : (
                                                <NavLink to={item.key}>{item.label}</NavLink>
                                            )}
                                        </li>
                                    ))}
                                </>
                            )}
                        </ul>
                    )}
                </li>
            </div>
        </>
    )
}

export default Auth
