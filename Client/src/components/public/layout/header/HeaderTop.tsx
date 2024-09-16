const HeaderTop = () => {
    return (
        <section className="fp__topbar">
            <div className="container">
                <div className="row">
                    <div className="col-xl-6 col-md-8">
                        <ul className="fp__topbar_info d-flex flex-wrap">
                            <li>
                                <a href="mailto:example@gmail.com">
                                    <i className="fas fa-envelope"></i> Unifood@gmail.com
                                </a>
                            </li>
                            <li>
                                <a href="callto:123456789">
                                    <i className="fas fa-phone-alt"></i> +96487452145214
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-xl-6 col-md-4 d-none d-md-block">
                        <ul className="topbar_icon d-flex flex-wrap">
                            <li>
                                <a href="#">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <i className="fab fa-twitter"></i>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <i className="fab fa-linkedin-in"></i>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <i className="fab fa-behance"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </section>
    )
}

export default HeaderTop