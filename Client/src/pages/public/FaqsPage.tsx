import { useState } from 'react';

function FaqsPage() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handleAccordionClick = (index: number) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  return (
    <>
      <section
        className="fp__breadcrumb"
        style={{ background: 'url(images/counter_bg.jpg)' }}
      >
        <div className="fp__breadcrumb_overlay">
          <div className="container">
            <div className="fp__breadcrumb_text">
              <h1>frequently asked question</h1>
              <ul>
                <li>
                  <a href="/">home</a>
                </li>
                <span>
                  <i className="fas fa-angle-right mr-4"></i>
                </span>
                <li>
                  <a href="/faqs">FAQs</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="fp__faq pt_100 xs_pt_70 pb_100 xs_pb_70">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9 wow fadeInUp" data-wow-duration="1s">
              <div className="fp__faq_area">
                <div className="accordion">
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button ${activeIndex !== 0 ? 'collapsed' : ''}`}
                        type="button"
                        onClick={() => handleAccordionClick(0)}
                      >
                        01. How can OnDemand Services help me?
                      </button>
                    </h2>
                    <div
                      className={`accordion-collapse ${activeIndex === 0 ? 'show' : 'collapse'}`}
                    >
                      <div className="accordion-body">
                        <p>
                          Lorem ipsum dolor sit amet,consecteturmae adipiscing
                          elit, sed do eiusmod tempor incidi incididuntu iut
                          labore et dolore magna duisr aliqua ut enim ad minim
                          veniam . Lorem ipsum dolor sit amet,consecteturmae
                          adipiscing elit, sed do eiusmod tempor incidi
                          incididuntu iut labore et dolore magna duisr aliqua ut
                          enim ad minim veniam . Lorem ipsum dolor sit amet.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button ${activeIndex !== 1 ? 'collapsed' : ''}`}
                        type="button"
                        onClick={() => handleAccordionClick(1)}
                      >
                        02. Why is this such an important problem for you to
                        fix?
                      </button>
                    </h2>
                    <div
                      className={`accordion-collapse ${activeIndex === 1 ? 'show' : 'collapse'}`}
                    >
                      <div className="accordion-body">
                        <p>
                          Lorem ipsum dolor sit amet,consecteturmae adipiscing
                          elit, sed do eiusmod tempor incidi incididuntu iut
                          labore et dolore magna duisr aliqua ut enim ad minim
                          veniam . Lorem ipsum dolor sit amet,consecteturmae
                          adipiscing elit, sed do eiusmod tempor incidi
                          incididuntu iut labore et dolore magna duisr aliqua ut
                          enim ad minim veniam .{' '}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button ${activeIndex !== 2 ? 'collapsed' : ''}`}
                        type="button"
                        onClick={() => handleAccordionClick(2)}
                      >
                        03. What is the Printing Quality?
                      </button>
                    </h2>
                    <div
                      className={`accordion-collapse ${activeIndex === 2 ? 'show' : 'collapse'}`}
                    >
                      <div className="accordion-body">
                        <p>
                          Lorem ipsum dolor sit amet,consecteturmae adipiscing
                          elit, sed do eiusmod tempor incidi incididuntu iut
                          labore et dolore magna duisr aliqua ut enim ad minim
                          veniam . Lorem ipsum dolor sit amet,consecteturmae
                          adipiscing elit, sed do eiusmod tempor incidi
                          incididuntu iut labore et dolore magna duisr aliqua ut
                          enim ad minim veniam .{' '}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button ${activeIndex !== 3 ? 'collapsed' : ''}`}
                        type="button"
                        onClick={() => handleAccordionClick(3)}
                      >
                        04. Can I request a service with an on-site consultant?
                      </button>
                    </h2>
                    <div
                      className={`accordion-collapse ${activeIndex === 3 ? 'show' : 'collapse'}`}
                    >
                      <div className="accordion-body">
                        <p>
                          Lorem ipsum dolor sit amet,consecteturmae adipiscing
                          elit, sed do eiusmod tempor incidi incididuntu iut
                          labore et dolore magna duisr aliqua ut enim ad minim
                          veniam . Lorem ipsum dolor sit amet,consecteturmae
                          adipiscing elit, sed do eiusmod tempor incidi
                          incididuntu iut labore et dolore magna duisr aliqua ut
                          enim ad minim veniam .{' '}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button ${activeIndex !== 4 ? 'collapsed' : ''}`}
                        type="button"
                        onClick={() => handleAccordionClick(4)}
                      >
                        05. Who is the service provider for On-Demand Delivery?
                      </button>
                    </h2>
                    <div
                      className={`accordion-collapse ${activeIndex === 4 ? 'show' : 'collapse'}`}
                    >
                      <div className="accordion-body">
                        <p>
                          Lorem ipsum dolor sit amet,consecteturmae adipiscing
                          elit, sed do eiusmod tempor incidi incididuntu iut
                          labore et dolore magna duisr aliqua ut enim ad minim
                          veniam . Lorem ipsum dolor sit amet,consecteturmae
                          adipiscing elit, sed do eiusmod tempor incidi
                          incididuntu iut labore et dolore magna duisr aliqua ut
                          enim ad minim veniam .{' '}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button ${activeIndex !== 5 ? 'collapsed' : ''}`}
                        type="button"
                        onClick={() => handleAccordionClick(5)}
                      >
                        06. Do I pay processing fees on delivery charges?
                      </button>
                    </h2>
                    <div
                      className={`accordion-collapse ${activeIndex === 5 ? 'show' : 'collapse'}`}
                    >
                      <div className="accordion-body">
                        <p>
                          Lorem ipsum dolor sit amet,consecteturmae adipiscing
                          elit, sed do eiusmod tempor incidi incididuntu iut
                          labore et dolore magna duisr aliqua ut enim ad minim
                          veniam . Lorem ipsum dolor sit amet,consecteturmae
                          adipiscing elit, sed do eiusmod tempor incidi
                          incididuntu iut labore et dolore magna duisr aliqua ut
                          enim ad minim veniam .{' '}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button ${activeIndex !== 6 ? 'collapsed' : ''}`}
                        type="button"
                        onClick={() => handleAccordionClick(6)}
                      >
                        07. How should I prepare my business for an On-Demand ?
                      </button>
                    </h2>
                    <div
                      className={`accordion-collapse ${activeIndex === 6 ? 'show' : 'collapse'}`}
                    >
                      <div className="accordion-body">
                        <p>
                          Lorem ipsum dolor sit amet,consecteturmae adipiscing
                          elit, sed do eiusmod tempor incidi incididuntu iut
                          labore et dolore magna duisr aliqua ut enim ad minim
                          veniam . Lorem ipsum dolor sit amet,consecteturmae
                          adipiscing elit, sed do eiusmod tempor incidi
                          incididuntu iut labore et dolore magna duisr aliqua ut
                          enim ad minim veniam .{' '}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default FaqsPage;
