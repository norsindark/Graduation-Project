import { NavLink } from 'react-router-dom';

function PaymentPage() {
  return (
    <>
      <section
        className="fp__breadcrumb"
        style={{ background: 'url(images/counter_bg.jpg)' }}
      >
        <div className="fp__breadcrumb_overlay">
          <div className="container">
            <div className="fp__breadcrumb_text">
              <h1>Checkout</h1>
              <ul>
                <li>
                  <NavLink to="/">home</NavLink>
                </li>
                <span>
                  <i className="fas fa-angle-right mr-4"></i>
                </span>
                <li>
                  <NavLink to="/cart">Cart</NavLink>
                </li>
                <span>
                  <i className="fas fa-angle-right mr-4"></i>
                </span>
                <li>
                  <NavLink to="/checkout">Checkout</NavLink>
                </li>
                <span>
                  <i className="fas fa-angle-right mr-4"></i>
                </span>
                <li>
                  <NavLink to="/payment">Payment</NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="fp__payment_page mt_100 xs_mt_70 mb_100 xs_mb_70">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="fp__payment_area">
                <div className="row">
                  <div
                    className="col-lg-3 col-6 col-sm-4 col-md-3 wow fadeInUp"
                    data-wow-duration="1s"
                  >
                    <a
                      className="fp__single_payment"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      <img
                        src="images/pay_1.jpg"
                        alt="payment method"
                        className="img-fluid w-100"
                      />
                    </a>
                  </div>
                  <div
                    className="col-lg-3 col-6 col-sm-4 col-md-3 wow fadeInUp"
                    data-wow-duration="1s"
                  >
                    <a
                      className="fp__single_payment"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      <img
                        src="images/pay_4.jpg"
                        alt="payment method"
                        className="img-fluid w-100"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 mt_25 wow fadeInUp" data-wow-duration="1s">
              <div className="fp__cart_list_footer_button">
                <h6>total cart</h6>
                <p>
                  subtotal: <span>$124.00</span>
                </p>
                <p>
                  delivery: <span>$00.00</span>
                </p>
                <p>
                  discount: <span>$10.00</span>
                </p>
                <p className="total">
                  <span>total:</span> <span>$134.00</span>
                </p>
                <form>
                  <input type="text" placeholder="Coupon Code" />
                  <button type="submit">apply</button>
                </form>
                <a className=" common_btn" href=" #">
                  checkout
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default PaymentPage;
