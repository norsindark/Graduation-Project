import {NavLink} from "react-router-dom";

const Auth = () => {
    return (
        <>
            <ul className="navbar-nav m-auto">
                <li className="nav-item">
                    <a className="nav-link mx-auto px-2" href="#">
                        <i className="fas fa-user pr-1"></i>
                        <i className="far fa-angle-down"></i>
                    </a>
                    <ul className="droap_menu ">
                        <li>
                            <NavLink
                                to="/register"

                            >
                                Register
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/register"

                            >
                                Register
                            </NavLink>
                        </li>
                    </ul>
                </li>
            </ul>
        </>

    )
}

export default Auth