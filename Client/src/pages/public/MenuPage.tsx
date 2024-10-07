import MenuHome from '../../components/public/menuhome/MenuHome';

function MenuPage() {
  return (
    <>
      <section
        className="fp__breadcrumb"
        style={{ background: 'url(images/counter_bg.jpg)' }}
      >
        <div className="fp__breadcrumb_overlay">
          <div className="container">
            <div className="fp__breadcrumb_text">
              <h1>Menu UniFood</h1>
              <ul>
                <li>
                  <a href="/">home</a>
                </li>
                <span>
                  <i className="fas fa-angle-right mr-4"></i>
                </span>
                <li>
                  <a href="/menu">menu</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <MenuHome />
    </>
  );
}

export default MenuPage;
