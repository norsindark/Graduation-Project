import TotalOrder from './TotalOrder';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { Form, Input, Button, notification } from 'antd';
import React, { useState } from 'react';
import { callUpdateProfile } from '../../../../../services/clientApi';
import { updateUser } from '../../../../../redux/account/accountSlice';
import { ProductOutlined } from '@ant-design/icons';
const DashboardAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state: RootState) => state.account.user);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const onFinish = async (values: { fullName: string; email: string }) => {
    try {
      setIsLoading(true);
      const res = await callUpdateProfile(values.fullName, values.email);
      if (res?.status === 200) {
        dispatch(
          updateUser({
            fullName: values.fullName,
            email: values.email,
          })
        );

        notification.success({
          message: 'Profile updated successfully!',
          duration: 5,
          showProgress: true,
        });
        setIsEditing(false);
      } else {
        notification.error({
          message: 'Failed to update profile',
          description: res?.data?.errors?.error || 'Something went wrong!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        message:
          'Error: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
        duration: 5,
        showProgress: true,
      });
    }
    setIsLoading(false);
  };

  return (
    <div
      className="tab-pane fade show active"
      id="v-pills-home"
      role="tabpanel"
      aria-labelledby="v-pills-home-tab"
    >
      <div className="fp_dashboard_body">
        <h3>
          <ProductOutlined style={{ fontSize: '24px', marginRight: '5px' }} />
          WELLCOME TO YOUR PROFILE
        </h3>
        <TotalOrder />

        <div className="fp_dash_personal_info">
          <h4>
            Personal Information
            <div className="row">
              <div className="col-md-12">
                {/* <button
                  onClick={() => setIsEditing(!isEditing)}
                  type="button"
                  className="bg-colorPrimary text-white rounded-full size-8 font-medium h-10 text-3xl text-white"
                >
                  <div className="text-[16px] font-medium text-center w-12">
                    {isEditing ? 'Cancel' : 'Edit'}
                  </div>
                </button> */}
                <div className="fp__login_imput">
                  <Button
                    type="primary"
                    shape="round"
                    htmlType="submit"
                    block
                    size="large"
                    disabled={isLoading}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? (
                      <span className="text-white font-medium text-center text-base">
                        <i className="fas fa-times mr-2"></i> Cancel
                      </span>
                    ) : (
                      <span className="text-white font-medium text-center text-base">
                        <i className="fas fa-edit mr-2"></i> Edit
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </h4>

          {!isEditing ? (
            <div className="personal_info_text">
              <p>
                <span className="font-medium text-base">Name:</span>{' '}
                {user?.fullName}
              </p>
              <p>
                <span className="font-medium text-base">Email:</span>{' '}
                {user?.email}
              </p>
            </div>
          ) : (
            <div className="fp_dash_personal_info_edit comment_input p-0">
              <Form
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                  fullName: user?.fullName,
                  email: user?.email,
                }}
              >
                <div className="row">
                  <div className="col-6">
                    <Form.Item
                      label="Full Name"
                      name="fullName"
                      rules={[
                        { required: true, message: 'Please input your name!' },
                      ]}
                    >
                      <Input placeholder="Full Name" />
                    </Form.Item>
                  </div>
                  <div className="col-xl-6 col-lg-6">
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        { required: true, message: 'Please input your email!' },
                      ]}
                    >
                      <Input placeholder="Email" />
                    </Form.Item>
                  </div>
                  <div className="col-xl-4">
                    <Button
                      type="primary"
                      shape="round"
                      htmlType="submit"
                      block
                      size="large"
                      disabled={isLoading}
                      loading={isLoading}
                    >
                      <span className="text-white font-medium text-center text-base">
                        <i className="fas fa-save mr-2"></i> Update Information
                      </span>
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardAccount;
