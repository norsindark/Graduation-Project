const Cart = ({
  showCart,
  setShowCart,
}: {
  showCart: boolean;
  setShowCart: (showCart: boolean) => void;
}) => {
  return (
    <>
      <div
        className={`fp__menu_cart_area  ${showCart ? 'show_mini_cart' : ''}`}
      >
        <div className="fp__menu_cart_boody">
          <div className="fp__menu_cart_header">
            <h5>total item (05)</h5>
            <span className="close_cart" onClick={() => setShowCart(false)}>
              <i className="fal fa-times"></i>
            </span>
          </div>
          <ul>
            <li>
              <div className="menu_cart_img">
                <img
                  src="images/menu8.png"
                  alt="menu"
                  className="img-fluid w-100"
                />
              </div>
              <div className="menu_cart_text">
                <a className="title" href="#">
                  Hyderabadi Biryani{' '}
                </a>
                <p className="size">small</p>
                <span className="extra">coca-cola</span>
                <span className="extra">7up</span>
                <p className="price">
                  $99.00 <del>$110.00</del>
                </p>
              </div>
              <span className="del_icon">
                <i className="fal fa-times"></i>
              </span>
            </li>
            <li>
              <div className="menu_cart_img">
                <img
                  src="images/menu4.png"
                  alt="menu"
                  className="img-fluid w-100"
                />
              </div>
              <div className="menu_cart_text">
                <a className="title" href="#">
                  Chicken Masalas
                </a>
                <p className="size">medium</p>
                <span className="extra">7up</span>
                <p className="price">$70.00</p>
              </div>
              <span className="del_icon">
                <i className="fal fa-times"></i>
              </span>
            </li>
            <li>
              <div className="menu_cart_img">
                <img
                  src="images/menu5.png"
                  alt="menu"
                  className="img-fluid w-100"
                />
              </div>
              <div className="menu_cart_text">
                <a className="title" href="#">
                  Competently Supply Customized Initiatives
                </a>
                <p className="size">large</p>
                <span className="extra">coca-cola</span>
                <span className="extra">7up</span>
                <p className="price">
                  $120.00 <del>$150.00</del>
                </p>
              </div>
              <span className="del_icon">
                <i className="fal fa-times"></i>
              </span>
            </li>
            <li>
              <div className="menu_cart_img">
                <img
                  src="images/menu6.png"
                  alt="menu"
                  className="img-fluid w-100"
                />
              </div>
              <div className="menu_cart_text">
                <a className="title" href="#">
                  Hyderabadi Biryani
                </a>
                <p className="size">small</p>
                <span className="extra">7up</span>
                <p className="price">$59.00</p>
              </div>
              <span className="del_icon">
                <i className="fal fa-times"></i>
              </span>
            </li>
            <li>
              <div className="menu_cart_img">
                <img
                  src="images/menu1.png"
                  alt="menu"
                  className="img-fluid w-100"
                />
              </div>
              <div className="menu_cart_text">
                <a className="title" href="#">
                  Competently Supply
                </a>
                <p className="size">medium</p>
                <span className="extra">coca-cola</span>
                <span className="extra">7up</span>
                <p className="price">
                  $99.00 <del>$110.00</del>
                </p>
              </div>
              <span className="del_icon">
                <i className="fal fa-times"></i>
              </span>
            </li>
          </ul>
          <p className="subtotal">
            sub total <span>$1220.00</span>
          </p>
          <a className="cart_view" href="cart_view.html">
            {' '}
            view cart
          </a>
          <a className="checkout" href="check_out.html">
            checkout
          </a>
        </div>
      </div>
    </>
  );
};

export default Cart;
