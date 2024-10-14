import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { MdLockReset } from 'react-icons/md';
import { callChangePassword } from '../../../../../services/clientApi';
import { useNavigate } from 'react-router-dom';

const ResetPasswordAccount = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const userId = useSelector((state: RootState) => state.account.user?.id);
  const navigate = useNavigate();

  const onFinish = async (values: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    const { oldPassword, newPassword, confirmPassword } = values;

    if (!userId) {
      notification.error({
        message: 'User not found',
        description: 'Please login to change your password',
        duration: 5,
      });
      navigate('/login');
      return;
    }

    if (newPassword === confirmPassword) {
      setIsSubmit(true);
      try {
        const response = await callChangePassword(
          userId,
          oldPassword,
          newPassword
        );
        console.log('response', response);

        if (response?.status === 200) {
          notification.success({
            message: 'Password changed successfully',
            duration: 5,
            showProgress: true,
          });
        } else {
          notification.error({
            message: 'Password change failed',
            description:
              response.data.errors?.error || 'Password change failed',
            duration: 5,
            showProgress: true,
          });
        }
      } catch {
        notification.error({
          message: 'Error changing password',
          description: 'Old password is incorrect',
          duration: 5,
          showProgress: true,
        });
      } finally {
        setIsSubmit(false);
      }
    } else {
      notification.error({
        message: 'Password change failed',
        description: 'Password and confirm password do not match!',
        duration: 5,
        showProgress: true,
      });
    }
  };

  return (
    <div
      className="tab-pane fade"
      id="v-pills-settings"
      role="tabpanel"
      aria-labelledby="v-pills-settings-tab"
    >
      <div className="fp_dashboard_body fp__change_password">
        <div className="fp__review_input">
          <h3>
            <MdLockReset style={{ fontSize: '24px', marginRight: '5px' }} />
            CHANGE PASSWORD
          </h3>
          <div className="comment_input pt-[20px]">
            <Form onFinish={onFinish} layout="vertical">
              <div className="row">
                <div className="col-xl-7">
                  <Form.Item
                    label="Old Password"
                    name="oldPassword"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your old password!',
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="Old Password"
                      autoComplete="old-password"
                    />
                  </Form.Item>
                </div>
                <div className="col-xl-7">
                  <Form.Item
                    label="New Password"
                    name="newPassword"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your new password!',
                      },
                      {
                        pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,64}$/,
                        message:
                          'Password must be between 6 and 64 characters long and contain both letters and numbers!',
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="New Password"
                      autoComplete="new-password"
                    />
                  </Form.Item>
                </div>
                <div className="col-xl-7">
                  <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    dependencies={['password']} // This makes sure confirmPassword depends on the password field
                    rules={[
                      {
                        required: true,
                        message: 'Please confirm your password!',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error('Passwords do not match!')
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      placeholder="Confirm Password"
                      autoComplete="confirm-password"
                    />
                  </Form.Item>
                </div>
              </div>
              <Button
                type="primary"
                shape="round"
                htmlType="submit"
                size="large"
                loading={isSubmit}
              >
                <div className="text-[16px] font-medium text-center">
                  Update Password
                </div>
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordAccount;
