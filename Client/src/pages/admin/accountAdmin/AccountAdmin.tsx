import { Modal } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import NavigationAccountAdmin from './NavigationAccountAdmin';
import DashboardAccountAdmin from './Information/DashboardAccountAdmin';
import EmployeeShiftManagement from './employeeShiftManagement/EmployeeShiftManagement';
import TimekeepingManagement from './timekeepingmanagement/TimekeepingManagement';
import InformationAdmin from './Information/InformationAdmin';
import EmployeeStatistics from './dashboard/EmployeeStatistics';

const AccountAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <Modal
      open={location.pathname === '/account-admin'}
      onCancel={handleCancel}
      footer={null}
      styles={{ body: { height: '90vh', overflowY: 'hidden' } }}
      width={1300}
      centered
      closeIcon={
        <div className="fp__menu_cart_header">
          <span className="close_cart bg-primary" onClick={handleCancel}>
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
                <NavigationAccountAdmin />
              </div>
              <div
                className="col-xl-9 col-lg-8 wow fadeInUp"
                data-wow-duration="1s"
              >
                <div className="fp__dashboard_content">
                  <div className="tab-content" id="v-pills-tabContent">
                    <EmployeeStatistics />

                    <EmployeeShiftManagement />

                    <TimekeepingManagement />

                    <InformationAdmin />
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

export default AccountAdmin;
