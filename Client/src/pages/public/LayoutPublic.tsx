import {Outlet} from "react-router-dom";

// import Footer from "../../components/public/footer/Footer.tsx";
import HeaderTop from "../../components/public/header/HeaderTop";
import Header from "../../components/public/header/Header";


const LayoutPublic = () => {
    return (
        <>
            <header>
                <HeaderTop/>
                <Header/>
            </header>
            <main>
                <Outlet/>
            </main>
            <footer>
                {/*<Footer/>*/}
            </footer>
        </>
    )
}

export default LayoutPublic;