import React, { useEffect, useRef, useState } from 'react';
import CountUp from 'react-countup';

const Counter = () => {
  const [startCounter, setStartCounter] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setStartCounter(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Trigger when 10% of the section is visible
      }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, []);

  return (
    <section
      className="fp__counter mt-5"
      style={{ background: 'url(images/counter_bg2.jpg)' }}
      ref={counterRef} // Reference to the section
    >
      <div className="fp__counter_overlay pt_100 xs_pt_70 pb_100 xs_pb_70">
        <div className="container">
          <div className="row">
            <div
              className="col-xl-3 col-sm-6 col-lg-3 wow fadeInUp"
              data-wow-duration="1s"
            >
              <div className="fp__single_counter">
                <i className="fas fa-burger-soda"></i>
                <div className="text">
                  <h2 className="counter">
                    {startCounter && (
                      <CountUp
                        end={85000}
                        duration={3}
                        separator=","
                        className="text-[73%]"
                      />
                    )}
                  </h2>
                  <p>customer serve</p>
                </div>
              </div>
            </div>
            <div
              className="col-xl-3 col-sm-6 col-lg-3 wow fadeInUp"
              data-wow-duration="1s"
            >
              <div className="fp__single_counter">
                <i className="fal fa-hat-chef"></i>
                <div className="text">
                  <h2 className="counter">
                    {startCounter && (
                      <CountUp end={120} duration={3} className="text-[73%]" />
                    )}
                  </h2>
                  <p>experience chef</p>
                </div>
              </div>
            </div>
            <div
              className="col-xl-3 col-sm-6 col-lg-3 wow fadeInUp"
              data-wow-duration="1s"
            >
              <div className="fp__single_counter">
                <i className="far fa-handshake"></i>
                <div className="text">
                  <h2 className="counter">
                    {startCounter && (
                      <CountUp
                        end={72000}
                        duration={3}
                        separator=","
                        className="text-[73%]"
                      />
                    )}
                  </h2>
                  <p>happy customer</p>
                </div>
              </div>
            </div>
            <div
              className="col-xl-3 col-sm-6 col-lg-3 wow fadeInUp"
              data-wow-duration="1s"
            >
              <div className="fp__single_counter">
                <i className="far fa-trophy"></i>
                <div className="text">
                  <h2 className="counter">
                    {startCounter && (
                      <CountUp end={30} duration={3} className="text-[73%]" />
                    )}
                  </h2>
                  <p>winning award</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Counter;
