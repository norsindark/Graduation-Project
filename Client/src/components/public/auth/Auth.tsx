import {NavLink} from "react-router-dom";

const Auth = () => {
    return (
        <li>
            <NavLink to={"/register"}>
                <i className="fas fa-user"></i>
            </NavLink>
        </li>
    )
}

export default Auth