const ReviewAccount = () => {
  return (
    <div
      className="tab-pane fade"
      id="v-pills-messages"
      role="tabpanel"
      aria-labelledby="v-pills-messages-tab"
    >
      <div className="fp_dashboard_body dashboard_review">
        <h3>review</h3>
        <div className="fp__review_area">
          <div className="fp__comment pt-0 mt_20">
            <div className="fp__single_comment m-0 border-0">
              <img src="images/menu1.png" alt="review" className="img-fluid" />
              <div className="fp__single_comm_text">
                <h3>
                  <a href="#">mamun ahmed shuvo</a> <span>29 oct 2022 </span>
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
                  Sure there isn't anything embarrassing hiidden in the middles
                  of text. All erators on the Internet tend to repeat predefined
                  chunks
                </p>
                <span className="status active">active</span>
              </div>
            </div>
            <div className="fp__single_comment">
              <img src="images/menu2.png" alt=" review" className="img-fluid" />
              <div className="fp__single_comm_text">
                <h3>
                  <a href="#">asaduzzaman khan</a> <span>29 oct 2022 </span>
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
                  Sure there isn't anything embarrassing hiidden in the middles
                  of text. All erators on the Internet tend to repeat predefined
                  chunks
                </p>
                <span className="status inactive">inactive</span>
              </div>
            </div>

            <a href="#" className="load_more">
              load More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewAccount;
