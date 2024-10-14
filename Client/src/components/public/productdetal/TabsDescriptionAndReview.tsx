function TabsDescriptionAndReview() {
  return (
    <>
      <div className="fp__menu_description_area mt_100 xs_mt_70">
        <ul className="nav nav-pills" id="pills-tab" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className="nav-link active"
              id="pills-home-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-home"
              type="button"
              role="tab"
              aria-controls="pills-home"
              aria-selected="true"
            >
              Description
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="pills-contact-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-contact"
              type="button"
              role="tab"
              aria-controls="pills-contact"
              aria-selected="false"
            >
              Reviews
            </button>
          </li>
        </ul>
        <div className="tab-content" id="pills-tabContent">
          <div
            className="tab-pane fade show active"
            id="pills-home"
            role="tabpanel"
            aria-labelledby="pills-home-tab"
            tabIndex={0}
          >
            <div className="menu_det_description">
              <p>
                Ipsum dolor, sit amet consectetur adipisicing elit. Doloribus
                consectetur ullam in? Beatae, dolorum ad ea deleniti ratione
                voluptatum similique omnis voluptas tempora optio soluta vero
                veritatis reiciendis blanditiis architecto. Debitis nesciunt
                inventore voluptate tempora ea incidunt iste, corporis, quo
                cumque facere doloribus possimus nostrum sed magni quasi,
                assumenda autem! Repudiandae nihil magnam provident illo alias
                vero odit repellendus, ipsa nemo itaque. Aperiam fuga, magnam
                quia illum minima blanditiis tempore. vero veritatis reiciendis
                blanditiis architecto. Debitis nesciunt inventore voluptate
                tempora ea incidunt iste, corporis, quo cumque facere doloribus
                possimus nostrum sed magni quasi
              </p>
              <ul>
                <li>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Doloribus consectetur ullam in
                </li>
                <li>
                  Dolor sit amet consectetur adipisicing elit. Earum itaque
                  nesciunt.
                </li>
                <li>
                  Corporis, quo cumque facere doloribus possimus nostrum sed
                  magni quasi.
                </li>
                <li>
                  Reiciendis blanditiis architecto. Debitis nesciunt inventore
                  voluptate tempora ea.
                </li>
                <li>
                  Incidunt iste, corporis, quo cumque facere doloribus possimus
                  nostrum sed magni quasi
                </li>
                <li>
                  Architecto. Debitis nesciunt inventore voluptate tempora ea
                  incidunt iste corporis.
                </li>
                <li>
                  Earum itaque nesciunt dolor laudantium placeat sed velit
                  aspernatur.
                </li>
                <li>
                  Laudantium placeat sed velit aspernatur, nobis quos quibusdam
                  distinctio voluptatum.
                </li>
              </ul>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum
                itaque nesciunt dolor laudantium placeat sed velit aspernatur,
                nobis quos quibusdam distinctio voluptatum officia vel sapiente
                enim, reprehenderit impedit beatae molestias dolorum. A laborum
                consectetur sed quis exercitationem optio consequatur, unde
                neque est odit, pariatur quae incidunt quasi dolorem nihil
                aliquid ut veritatis porro eaque cupiditate voluptatem vel ad!
                Asperiores, praesentium. sit amet consectetur adipisicing elit.
                Doloribus consectetur ullam in? Beatae, dolorum ad ea deleniti
                ratione voluptatum similique omnis voluptas tempora optio soluta
              </p>

              <ul>
                <li>
                  Reiciendis blanditiis architecto. Debitis nesciunt inventore
                  voluptate tempora ea.
                </li>
                <li>
                  Incidunt iste, corporis, quo cumque facere doloribus possimus
                  nostrum sed magni quasi
                </li>
                <li>
                  Architecto. Debitis nesciunt inventore voluptate tempora ea
                  incidunt iste corporis.
                </li>
                <li>
                  Earum itaque nesciunt dolor laudantium placeat sed velit
                  aspernatur.
                </li>
                <li>
                  Laudantium placeat sed velit aspernatur, nobis quos quibusdam
                  distinctio voluptatum.
                </li>
              </ul>
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Doloribus consectetur ullam in? Beatae, dolorum ad ea deleniti
                ratione voluptatum similique omnis voluptas tempora optio soluta
                vero veritatis reiciendis blanditiis architecto. Debitis
                nesciunt inventore voluptate tempora ea incidunt iste, corporis,
                quo cumque facere doloribus possimus nostrum sed magni quasi,
                assumenda autem! Repudiandae nihil magnam provident illo alias
                vero odit repellendus, ipsa nemo itaque. Aperiam fuga, magnam
                quia illum minima blanditiis tempore.
              </p>
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="pills-contact"
            role="tabpanel"
            aria-labelledby="pills-contact-tab"
            tabIndex={0}
          >
            <div className="fp__review_area">
              <div className="row">
                <div className="col-lg-8">
                  <h4>04 reviews</h4>
                  <div className="fp__comment pt-0 mt_20">
                    <div className="fp__single_comment m-0 border-0">
                      <img
                        src="../../../public/images/comment_img_1.png"
                        alt="review"
                        className="img-fluid"
                      />
                      <div className="fp__single_comm_text">
                        <h3>
                          Michel Holder <span>29 oct 2022 </span>
                        </h3>
                        <span className="rating">
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fad fa-star-half-alt"></i>
                          <i className="fal fa-star"></i>
                          <b>(120)</b>
                        </span>
                        <p>
                          Sure there isn't anything embarrassing hiidden in the
                          middles of text. All erators on the Internet tend to
                          repeat predefined chunks
                        </p>
                      </div>
                    </div>
                    <div className="fp__single_comment">
                      <img
                        src="../../../public/images/chef_1.jpg"
                        alt="review"
                        className="img-fluid"
                      />
                      <div className="fp__single_comm_text">
                        <h3>
                          salina khan <span>29 oct 2022 </span>
                        </h3>
                        <span className="rating">
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fad fa-star-half-alt"></i>
                          <i className="fal fa-star"></i>
                          <b>(120)</b>
                        </span>
                        <p>
                          Sure there isn't anything embarrassing hiidden in the
                          middles of text. All erators on the Internet tend to
                          repeat predefined chunks
                        </p>
                      </div>
                    </div>
                    <div className="fp__single_comment">
                      <img
                        src="../../../public/images/comment_img_2.png"
                        alt="review"
                        className="img-fluid"
                      />
                      <div className="fp__single_comm_text">
                        <h3>
                          Mouna Sthesia <span>29 oct 2022 </span>
                        </h3>
                        <span className="rating">
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fad fa-star-half-alt"></i>
                          <i className="fal fa-star"></i>
                          <b>(120)</b>
                        </span>
                        <p>
                          Sure there isn't anything embarrassing hiidden in the
                          middles of text. All erators on the Internet tend to
                          repeat predefined chunks
                        </p>
                      </div>
                    </div>
                    <div className="fp__single_comment">
                      <img
                        src="../../../public/images/chef_3.jpg"
                        alt="review"
                        className="img-fluid"
                      />
                      <div className="fp__single_comm_text">
                        <h3>
                          marjan janifar <span>29 oct 2022 </span>
                        </h3>
                        <span className="rating">
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fad fa-star-half-alt"></i>
                          <i className="fal fa-star"></i>
                          <b>(120)</b>
                        </span>
                        <p>
                          Sure there isn't anything embarrassing hiidden in the
                          middles of text. All erators on the Internet tend to
                          repeat predefined chunks
                        </p>
                      </div>
                    </div>
                    <a href="#" className="load_more">
                      load More
                    </a>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="fp__post_review">
                    <h4>write a Review</h4>
                    <form>
                      <p className="rating">
                        <span>select your rating : </span>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </p>
                      <div className="row">
                        <div className="col-xl-12">
                          <input type="text" placeholder="Name" />
                        </div>
                        <div className="col-xl-12">
                          <input type="email" placeholder="Email" />
                        </div>
                        <div className="col-xl-12">
                          <textarea
                            rows={3}
                            placeholder="Write your review"
                          ></textarea>
                        </div>
                        <div className="col-12">
                          <button className="common_btn" type="submit">
                            submit review
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TabsDescriptionAndReview;
