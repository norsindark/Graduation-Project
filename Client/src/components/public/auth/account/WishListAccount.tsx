const WishListAccount = () => {
  return (
    <div
      className="tab-pane fade "
      id="v-pills-messages2"
      role="tabpanel"
      aria-labelledby="v-pills-messages-tab2"
    >
      <div className="fp_dashboard_body">
        <h3>wishlist</h3>
        <div className="fp__dashoard_wishlist">
          <div className="row">
            <div className="col-xl-4 col-sm-6 col-lg-6">
              <div className="fp__menu_item">
                <div className="fp__menu_item_img">
                  <img
                    src="images/menu2_img_2.jpg"
                    alt="menu"
                    className="img-fluid w-100"
                  />
                  <a className="category" href="#">
                    chicken
                  </a>
                </div>
                <div className="fp__menu_item_text">
                  <p className="rating">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star-half-alt"></i>
                    <i className="far fa-star"></i>
                    <span>145</span>
                  </p>
                  <a className="title" href="menu_details.html">
                    chicken Masala
                  </a>
                  <h5 className="price">
                    $80.00 <del>90.00</del>
                  </h5>
                  <ul className="d-flex flex-wrap justify-content-center">
                    <li>
                      <a
                        href="#"
                        data-bs-toggle="modal"
                        data-bs-target="#cartModal"
                      >
                        <i className="fas fa-shopping-basket"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fal fa-heart"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="far fa-eye"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-sm-6 col-lg-6">
              <div className="fp__menu_item">
                <div className="fp__menu_item_img">
                  <img
                    src="images/menu2_img_3.jpg"
                    alt="menu"
                    className="img-fluid w-100"
                  />
                  <a className="category" href="#">
                    grill
                  </a>
                </div>
                <div className="fp__menu_item_text">
                  <p className="rating">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star-half-alt"></i>
                    <i className="far fa-star"></i>
                    <span>54</span>
                  </p>
                  <a className="title" href="menu_details.html">
                    daria shevtsova
                  </a>
                  <h5 className="price">$99.00</h5>
                  <ul className="d-flex flex-wrap justify-content-center">
                    <li>
                      <a
                        href="#"
                        data-bs-toggle="modal"
                        data-bs-target="#cartModal"
                      >
                        <i className="fas fa-shopping-basket"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fal fa-heart"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="far fa-eye"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-sm-6 col-lg-6">
              <div className="fp__menu_item">
                <div className="fp__menu_item_img">
                  <img
                    src="images/menu2_img_4.jpg"
                    alt="menu"
                    className="img-fluid w-100"
                  />
                  <a className="category" href="#">
                    chicken
                  </a>
                </div>
                <div className="fp__menu_item_text">
                  <p className="rating">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star-half-alt"></i>
                    <i className="far fa-star"></i>
                    <span>74</span>
                  </p>
                  <a className="title" href="menu_details.html">
                    chicken Masala
                  </a>
                  <h5 className="price">
                    $80.00 <del>90.00</del>
                  </h5>
                  <ul className="d-flex flex-wrap justify-content-center">
                    <li>
                      <a
                        href="#"
                        data-bs-toggle="modal"
                        data-bs-target="#cartModal"
                      >
                        <i className="fas fa-shopping-basket"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fal fa-heart"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="far fa-eye"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="fp__pagination mt_35">
            <div className="row">
              <div className="col-12">
                <nav aria-label="...">
                  <ul className="pagination justify-content-start">
                    <li className="page-item">
                      <a className="page-link" href="#">
                        <i className="fas fa-long-arrow-alt-left"></i>
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        1
                      </a>
                    </li>
                    <li className="page-item active">
                      <a className="page-link" href="#">
                        2
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        3
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        <i className="fas fa-long-arrow-alt-right"></i>
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishListAccount;
