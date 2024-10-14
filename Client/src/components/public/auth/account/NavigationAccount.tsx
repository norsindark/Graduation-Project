import AvatarAccount from './AvatarAccount';
import { useDispatch } from 'react-redux';
import { doLogoutAction } from '../../../../redux/account/accountSlice';
import { useNavigate } from 'react-router-dom';
import { callLogout } from '../../../../services/clientApi';
import { notification } from 'antd'; // Import Spin
import { useState } from 'react';
import Loading from '../../../Loading/Loading';

const NavigationAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submit, setSubmit] = useState(false);

  const handleLogout = async () => {
    try {
      setSubmit(true); // Set loading state to true
      const res = await callLogout();
      if (res?.status == 200) {
        dispatch(doLogoutAction());
        navigate('/');
        notification.success({
          message: 'Logout success!',
          duration: 5,
          showProgress: true,
        });
      } else {
        notification.error({
          message: 'Logout failed!',
          description: res?.data?.errors?.error || 'Something went wrong!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch {
      notification.error({
        message: 'Logout failed!',
        description: 'Something went wrong!',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setSubmit(false); // Set loading state to false
    }
  };

  return (
    <div className="fp__dashboard_menu">
      <AvatarAccount />
      {submit ? (
        <Loading />
      ) : (
        <div
          className="nav flex-column nav-pills"
          id="v-pills-tab"
          role="tablist"
          aria-orientation="vertical"
        >
          <button
            className="nav-link active"
            id="v-pills-home-tab"
            data-bs-toggle="pill"
            data-bs-target="#v-pills-home"
            type="button"
            role="tab"
            aria-controls="v-pills-home"
            aria-selected="true"
          >
            <span>
              <i className="fas fa-user"></i>
            </span>{' '}
            Personal Info
          </button>

          <button
            className="nav-link"
            id="v-pills-address-tab"
            data-bs-toggle="pill"
            data-bs-target="#v-pills-address"
            type="button"
            role="tab"
            aria-controls="v-pills-address"
            aria-selected="true"
          >
            <span>
              <i className="fas fa-user"></i>
            </span>{' '}
            Address
          </button>

          <button
            className="nav-link"
            id="v-pills-profile-tab"
            data-bs-toggle="pill"
            data-bs-target="#v-pills-profile"
            type="button"
            role="tab"
            aria-controls="v-pills-profile"
            aria-selected="false"
          >
            <span>
              <i className="fas fa-bags-shopping"></i>
            </span>{' '}
            Order
          </button>

          <button
            className="nav-link"
            id="v-pills-messages-tab2"
            data-bs-toggle="pill"
            data-bs-target="#v-pills-messages2"
            type="button"
            role="tab"
            aria-controls="v-pills-messages2"
            aria-selected="false"
          >
            <span>
              <i className="far fa-heart"></i>
            </span>{' '}
            Wishlist
          </button>

          <button
            className="nav-link"
            id="v-pills-messages-tab"
            data-bs-toggle="pill"
            data-bs-target="#v-pills-messages"
            type="button"
            role="tab"
            aria-controls="v-pills-messages"
            aria-selected="false"
          >
            <span>
              <i className="fas fa-star"></i>
            </span>{' '}
            Reviews
          </button>

          <button
            className="nav-link"
            id="v-pills-settings-tab"
            data-bs-toggle="pill"
            data-bs-target="#v-pills-settings"
            type="button"
            role="tab"
            aria-controls="v-pills-settings"
            aria-selected="false"
          >
            <span>
              <i className="fas fa-user-lock"></i>
            </span>{' '}
            Change Password{' '}
          </button>

          <button className="nav-link" type="button" onClick={handleLogout}>
            <span>
              <i className="fas fa-sign-out-alt"></i>
            </span>{' '}
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default NavigationAccount;
