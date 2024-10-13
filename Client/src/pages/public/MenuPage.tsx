import { NavLink } from 'react-router-dom';
import MenuAbout from '../../components/public/menuabout/MenuAbout';

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
                  <NavLink to="/">home</NavLink>
                </li>
                <span>
                  <i className="fas fa-angle-right mr-4"></i>
                </span>
                <li>
                  <NavLink to="/menu">menu</NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <MenuAbout />
    </>
  );
}

export default MenuPage;
