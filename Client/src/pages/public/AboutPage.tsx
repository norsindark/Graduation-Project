import FeedBack from '../../components/public/feedbacks/FeedBack';
import WhyChoose from '../../components/public/whychoose/WhyChoose';
import Chef from '../../components/public/chef/Chef';
import Counter from '../../components/public/counter/Counter';

function AboutPage() {
  return (
    <>
      <section
        className="fp__breadcrumb"
        style={{ background: 'url(images/counter_bg.jpg)' }}
      >
        <div className="fp__breadcrumb_overlay">
          <div className="container">
            <div className="fp__breadcrumb_text">
              <h1>about UniFood</h1>
              <ul>
                <li>
                  <a href="/">home</a>
                </li>
                <span>
                  <i className="fas fa-angle-right mr-4"></i>
                </span>
                <li>
                  <a href="/about">about us</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="fp__about_us mt_120 xs_mt_90">
        <div className="container">
          <div className="row">
            <div
              className="col-xl-6 col-lg-5 wow fadeInUp"
              data-wow-duration="1s"
            >
              <div className="fp__about_us_img">
                <img
                  src="images/about_chef.jpg"
                  alt="about us"
                  className="img-fluid w-100"
                />
              </div>
            </div>
            <div
              className="col-xl-6 col-lg-7 wow fadeInUp"
              data-wow-duration="1s"
            >
              <div className="fp__section_heading mb_40">
                <h4>About Company</h4>
                <h2>Helathy Foods Provider</h2>
                <span>
                  <img
                    src="images/heading_shapes.png"
                    alt="shapes"
                    className="img-fluid w-100"
                  />
                </span>
              </div>
              <div className="fp__about_us_text">
                <p>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Cupiditate aspernatur molestiae minima pariatur consequatur
                  voluptate sapiente deleniti soluta, animi ab necessitatibus
                  optio similique quasi fuga impedit corrupti obcaecati neque
                  consequatur sequi.
                </p>
                <ul>
                  <li>Delicious & Healthy Foods </li>
                  <li>Spacific Family & Kids Zone</li>
                  <li>Best Price & Offers</li>
                  <li>Made By Fresh Ingredients</li>
                  <li>Music & Other Facilities</li>
                  <li>Delicious & Healthy Foods </li>
                  <li>Spacific Family & Kids Zone</li>
                  <li>Best Price & Offers</li>
                  <li>Made By Fresh Ingredients</li>
                  <li>Delicious & Healthy Foods </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="fp__about_video mt_100 xs_mt_70">
        <div className="container wow fadeInUp" data-wow-duration="1s">
          <div
            className="fp__about_video_bg"
            style={{ background: 'url(images/about_video_bg.jpg)' }}
          >
            <div className="fp__about_video_overlay">
              <div className="row">
                <div className="col-12">
                  <div className="fp__about_video_text">
                    <p>Watch Videos</p>
                    <a
                      className="play_btn venobox"
                      data-autoplay="true"
                      data-vbtype="video"
                      href="https://youtu.be/F3zw1Gvn4Mk"
                    >
                      <i className=" fas fa-play"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <WhyChoose />

      <Counter />
      <FeedBack />
    </>
  );
}

export default AboutPage;
