import React, { useState, useEffect } from 'react';
import LogoHeader from "../../logo/LogoHeader";
import Navigation from "../../navigation/Navigation";
import Search from "../../search/Search";
import Cart from "../../cart/Cart";
import Auth from "../../auth/Auth";
import Reservation from "../../reservation/Reservation";


const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const newIsMobile = window.innerWidth < 992;
            setIsMobile(newIsMobile);
            if (!newIsMobile) {
                setIsMenuOpen(false);
            }
        };

        handleResize(); // Gọi ngay lập tức để set giá trị ban đầu
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar navbar-expand-lg main_menu">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <LogoHeader />
                <button className="navbar-toggler lg:hidden" type="button" onClick={toggleMenu}
                    aria-controls="navbarNav" aria-expanded={isMenuOpen} aria-label="Toggle navigation">
                    <i className="far fa-bars"></i>
                </button>
                <div className={`
                    navbar-collapse 
                    ${isMobile ? `${"mobileMenu"} ${isMenuOpen ? "show" : ''}` : ''}
                    lg:block
                `} id="navbarNav">
                    <ul className="navbar-nav mx-auto flex-grow justify-center">
                        <Navigation />
                    </ul>
                    <ul className="menu_icon flex flex-wrap px-3">
                        <Search />
                        <Cart />
                        <Auth />
                        <Reservation />
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;

