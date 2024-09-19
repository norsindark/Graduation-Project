import React, { useState } from 'react';
import { Button, Form, Input, notification, Select, Radio } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { callUpdateAddress } from '../../../../../services/clientApi';
import { useNavigate } from 'react-router-dom';
const AddressEdit = ({
  currentAddress,
  onEditSuccess,
  setShowAddressEdit,
}: {
  currentAddress: {
    id: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: number;
    phoneNumber: string;
    addressType: string;
    userId: string;
  };
  onEditSuccess: () => void;
  setShowAddressEdit: (show: boolean) => void;
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state: RootState) => state.account.user?.id);
  const navigate = useNavigate();
  const { Option } = Select;
  const countries = [
    { code: 'VN', name: 'Vietnam' },
    { code: 'KR', name: 'Korea' },
    { code: 'JP', name: 'Japan' },
    { code: 'TH', name: 'Thailand' },
    { code: 'CN', name: 'China' },
  ];

  const onFinish = async (values: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: number;
    phoneNumber: string;
    addressType: string;
  }) => {
    const {
      street,
      city,
      state,
      country,
      postalCode,
      phoneNumber,
      addressType,
    } = values;
    if (!userId) {
      notification.error({
        message: 'User not found',
        description: 'Please login to edit your address',
        duration: 5,
        showProgress: true,
      });
      setLoading(false);
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      const response = await callUpdateAddress(
        currentAddress.id,
        street,
        country,
        city,
        postalCode.toString(),
        addressType,
        state,
        phoneNumber,
        userId
      );
      if (response?.status === 200) {
        notification.success({
          message: 'Address updated successfully!',
          duration: 5,
          showProgress: true,
        });
        onEditSuccess();
      } else {
        notification.error({
          message: 'Address updated failed',
          description: response.data.errors?.error || 'Something went wrong!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error updating address',
        description:
          error instanceof Error
            ? error.message
            : 'Error during registration process!',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container text-medium">
      <h4 className="fp__dsahboard_overview_item text-center flex justify-center items-center p-3 font-[500] text-[18px]">
        Edit Address
      </h4>
      <Form
        form={form}
        layout="vertical"
        initialValues={currentAddress}
        onFinish={onFinish}
      >
        <div className="row">
          <div className="col-md-12">
            <Form.Item
              label="Street"
              name="street"
              rules={[{ required: true, message: 'Please input your Street!' }]}
            >
              <Input.TextArea
                rows={2}
                placeholder="Street"
                autoComplete="street"
              />
            </Form.Item>
          </div>
          <div className="col-md-6">
            <Form.Item
              label="City"
              name="city"
              rules={[{ required: true, message: 'Please input your City!' }]}
            >
              <Input placeholder="City" autoComplete="city" />
            </Form.Item>
          </div>
          <div className="col-md-6">
            <Form.Item
              label="State"
              name="state"
              rules={[{ required: true, message: 'Please input your State!' }]}
            >
              <Input type="text" placeholder="State" autoComplete="state" />
            </Form.Item>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <Form.Item
              label="Country"
              name="country"
              rules={[
                { required: true, message: 'Please select your Country!' },
              ]}
            >
              <Select
                placeholder="Select a country"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {countries.map((country) => (
                  <Option key={country.code} value={country.name}>
                    {country.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div className="col-md-6">
            <Form.Item
              label="Postal Code"
              name="postalCode"
              rules={[
                { required: true, message: 'Please input your Postal Code!' },
                {
                  pattern: /^\d{5}$/,
                  message: 'Postal Code must be exactly 5 digits!',
                },
              ]}
            >
              <Input
                type="text"
                placeholder="Postal Code"
                autoComplete="postal-code"
              />
            </Form.Item>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[
                { required: true, message: 'Please input your Phone Number!' },
                {
                  pattern: /^\d+$/,
                  message: 'Phone Number can only contain digits!',
                },
              ]}
            >
              <Input
                type="text"
                placeholder="Phone Number"
                autoComplete="phone-number"
              />
            </Form.Item>
          </div>
          <div className="col-md-6">
            <Form.Item
              name="addressType"
              label="Address Type"
              rules={[
                { required: true, message: 'Please input your Address Type!' },
              ]}
            >
              <Radio.Group>
                <Radio value="home">Home</Radio>
                <Radio value="office">Office</Radio>
                <Radio value="other">Other</Radio>
              </Radio.Group>
            </Form.Item>
          </div>
        </div>
        <Button
          type="primary"
          shape="round"
          htmlType="submit"
          size="large"
          loading={loading}
        >
          <div className=" text-[16px] font-medium text-center">
            Save Address
          </div>
        </Button>
        <Button
          danger
          size="large"
          style={{ fontWeight: 'medium', margin: '0 10px' }}
          shape="round"
          type="primary"
          className="cancel_new_address"
          onClick={() => setShowAddressEdit(false)}
        >
          <div className=" text-[16px] font-medium text-center">Cancel</div>
        </Button>
      </Form>
    </div>
  );
};

export default AddressEdit;
