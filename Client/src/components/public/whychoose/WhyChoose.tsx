function WhyChoose() {
  const whyChooseData = [
    {
      id: 1,
      icon: 'fas fa-percent',
      iconClass: 'icon_1',
      title: 'Exclusive Rewards',
      description:
        'Earn points, get birthday specials and monthly member-only discounts up to 25% off.',
    },
    {
      id: 2,
      icon: 'fas fa-burger-soda',
      iconClass: 'icon_2',
      title: 'Quality Ingredients',
      description:
        'Farm-fresh produce, premium grade meats and authentic imported ingredients daily.',
    },
    {
      id: 3,
      icon: 'far fa-hat-chef',
      iconClass: 'icon_3',
      title: 'Expert Chefs',
      description:
        'Internationally trained chefs with 30+ years experience crafting authentic flavors.',
    },
  ];

  return (
    <section className="fp__why_choose mt_100 xs_mt_70">
      <div className="container">
        <div className="row wow fadeInUp" data-wow-duration="1s">
          <div className="col-md-8 col-lg-7 col-xl-6 m-auto text-center">
            <div className="fp__section_heading mb_25">
              <h4>why choose us</h4>
              <h2>Why We're the Best</h2>
              <span>
                <img
                  src="images/heading_shapes.png"
                  alt="shapes"
                  className="img-fluid w-100"
                />
              </span>
              <p className="text-base">
                Experience excellence in every bite with our quality ingredients
                and exceptional service.
              </p>
            </div>
          </div>
        </div>

        <div className="row">
          {whyChooseData.map((item) => (
            <div className="col-xl-4 col-md-6 col-lg-4" key={item.id}>
              <div className="fp__choose_single">
                <div className={`icon ${item.iconClass}`}>
                  <i className={item.icon}></i>
                </div>
                <div className="text">
                  <h3 className="text-xl font-medium">{item.title}</h3>
                  <p className="text-base">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChoose;
