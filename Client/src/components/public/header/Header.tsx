import LogoHeader from "../logo/LogoHeader.tsx";
import Navigation from "../navigation/Navigation.tsx";
import Search from "../search/Search.tsx";
import Cart from "../cart/Cart.tsx";
import Auth from "../auth/Auth.tsx";
import Reservation from "../reservation/Reservation.tsx";

const Header = () => {
    return (
        <>
            <nav className="navbar navbar-expand-lg main_menu">
                <div className="container">
                    <LogoHeader/>
                    <Navigation/>
                    <ul className="menu_icon d-flex flex-wrap">
                        <Search/>
                        <Cart/>
                        <Auth/>
                        <Reservation/>
                    </ul>
                </div>
            </nav>
        </>
    );
}

export default Header;
