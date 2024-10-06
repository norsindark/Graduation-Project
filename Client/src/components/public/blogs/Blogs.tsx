function Blogs() {
  return (
    <section className="fp__blog fp__blog2">
      <div className="fp__blog_overlay pt_95 pt_xs_60 pb_100 xs_pb_70">
        <div className="container">
          <div className="row wow fadeInUp" data-wow-duration="1s">
            <div className="col-md-8 col-lg-7 col-xl-6 m-auto text-center">
              <div className="fp__section_heading mb_25">
                <h4>news & blogs</h4>
                <h2>our latest foods blog</h2>
                <span>
                  <img
                    src="images/heading_shapes.png"
                    alt="shapes"
                    className="img-fluid w-100"
                  />
                </span>
              </div>
            </div>
          </div>
          <div className="row">
            <div
              className="col-xl-4 col-sm-6 col-lg-4 wow fadeInUp"
              data-wow-duration="1s"
            >
              <div className="fp__single_blog">
                <a href="#" className="fp__single_blog_img">
                  <img
                    src="images/menu2_img_1.jpg"
                    alt="blog"
                    className="img-fluid w-100"
                  />
                </a>
                <div className="fp__single_blog_text">
                  <a className="category" href="#">
                    chicken
                  </a>
                  <ul className="d-flex flex-wrap mt_15">
                    <li>
                      <i className="fas fa-user"></i>admin
                    </li>
                    <li>
                      <i className="fas fa-calendar-alt"></i> 25 oct 2022
                    </li>
                    <li>
                      <i className="fas fa-comments"></i> 25 comment
                    </li>
                  </ul>
                  <a className="title" href="blog_details.html">
                    Competently supply customized initiatives
                  </a>
                </div>
              </div>
            </div>
            <div
              className="col-xl-4 col-sm-6 col-lg-4 wow fadeInUp"
              data-wow-duration="1s"
            >
              <div className="fp__single_blog">
                <a href="#" className="fp__single_blog_img">
                  <img
                    src="images/menu2_img_2.jpg"
                    alt="blog"
                    className="img-fluid w-100"
                  />
                </a>
                <div className="fp__single_blog_text">
                  <a className="category" href="#">
                    kabab
                  </a>
                  <ul className="d-flex flex-wrap mt_15">
                    <li>
                      <i className="fas fa-user"></i>admin
                    </li>
                    <li>
                      <i className="fas fa-calendar-alt"></i> 27 oct 2022
                    </li>
                    <li>
                      <i className="fas fa-comments"></i> 41 comment
                    </li>
                  </ul>
                  <a className="title" href="blog_details.html">
                    Unicode UTF8 Character Sets They Sltimate Guide Systems
                  </a>
                </div>
              </div>
            </div>
            <div
              className="col-xl-4 col-sm-6 col-lg-4 wow fadeInUp"
              data-wow-duration="1s"
            >
              <div className="fp__single_blog">
                <a href="#" className="fp__single_blog_img">
                  <img
                    src="images/menu2_img_3.jpg"
                    alt="blog"
                    className="img-fluid w-100"
                  />
                </a>
                <div className="fp__single_blog_text">
                  <a className="category" href="#">
                    grill
                  </a>
                  <ul className="d-flex flex-wrap mt_15">
                    <li>
                      <i className="fas fa-user"></i>admin
                    </li>
                    <li>
                      <i className="fas fa-calendar-alt"></i> 27 oct 2022
                    </li>
                    <li>
                      <i className="fas fa-comments"></i> 32 comment
                    </li>
                  </ul>
                  <a className="title" href="blog_details.html">
                    Quality Foods Requirments For Every Human Body’s
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Blogs;
