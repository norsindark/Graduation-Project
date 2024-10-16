import { Modal } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import NavigationAccount from './NavigationAccount';
import DashboardAccount from './dashboard/DashboardAccount';
import AddressAccount from './address/AddressAccount';
import OrderAccount from './OrderAccount';
import WishListAccount from './WishListAccount';
import ReviewAccount from './ReviewAccount';
import ResetPasswordAccount from './changepassword/ResetPasswordAccount';

interface AccountProps {
  onClose: () => void;
  setActiveModal: (modal: string | null) => void;
}

const Account: React.FC<AccountProps> = ({ onClose, setActiveModal }) => {
  return (
    <Modal
      open={true}
      onCancel={onClose}
      footer={null}
      width={1300}
      centered
      styles={{ body: { height: 'auto', overflowY: 'auto' } }}
      closeIcon={
        <div className="fp__menu_cart_header">
          <span className="close_cart-client" onClick={onClose}>
            <i className="fal fa-times"></i>
          </span>
        </div>
      }
    >
      <section className="fp__dashboard xs_mt_90 xs_mb_70">
        <div className="container">
          <div className="fp__dashboard_area">
            <div className="row">
              <div
                className="col-xl-3 col-lg-4 wow fadeInUp"
                data-wow-duration="1s"
              >
                <NavigationAccount />
              </div>
              <div
                className="col-xl-9 col-lg-8 wow fadeInUp"
                data-wow-duration="1s"
              >
                <div className="fp__dashboard_content">
                  <div className="tab-content" id="v-pills-tabContent">
                    <DashboardAccount />

                    <AddressAccount />

                    <OrderAccount />

                    <WishListAccount />

                    <ReviewAccount />

                    <ResetPasswordAccount />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Modal>
  );
};

export default Account;
