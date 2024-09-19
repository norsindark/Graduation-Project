const Navigation = () => {
  return (
    <>
      <li className="nav-item">
        <a className="nav-link active" aria-current="page" href="/">
          Home
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/">
          Menu
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/">
          About
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/">
          Chefs
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#">
          Pages <i className="far fa-angle-down"></i>
        </a>
        <ul className="droap_menu">
          <li>
            <a href="menu_details.html">Menu Details</a>
          </li>
          <li>
            <a href="blog_details.html">Blog Details</a>
          </li>
          <li>
            <a href="cart_view.html">Cart View</a>
          </li>
          <li>
            <a href="check_out.html">Checkout</a>
          </li>
          <li>
            <a href="payment.html">Payment</a>
          </li>
          <li>
            <a href="testimonial.html">Testimonial</a>
          </li>
          <li>
            <a href="search_menu.html">Search Result</a>
          </li>
          <li>
            <a href="404.html">404/Error</a>
          </li>
          <li>
            <a href="faq.html">FAQs</a>
          </li>
          <li>
            <a href="sign_in.html">Sign In</a>
          </li>
          <li>
            <a href="sign_up.html">Sign Up</a>
          </li>
          <li>
            <a href="forgot_password.html">Forgot Password</a>
          </li>
          <li>
            <a href="privacy_policy.html">Privacy Policy</a>
          </li>
          <li>
            <a href="terms_condition.html">Terms and Condition</a>
          </li>
        </ul>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/">
          Blog
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/">
          Contact
        </a>
      </li>
    </>
  );
};
export default Navigation;
