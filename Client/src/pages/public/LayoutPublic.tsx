import {Outlet} from "react-router-dom";
import Header from "../../components/public/header/Header.tsx";
import Footer from "../../components/public/footer/Footer.tsx";

const LayoutPublic = () => {
    return (
        <>
            <header>
                <Header/>
            </header>
            <main>
                <Outlet/>
            </main>
            <footer>
                <Footer/>
            </footer>
        </>
    )
}

export default LayoutPublic;