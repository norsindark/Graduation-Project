import React, { useEffect, useState } from 'react';
import { Button, Form, Input, notification, Select, Radio } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { callUpdateAddress } from '../../../../../services/clientApi';
import { useNavigate } from 'react-router-dom';

interface AddressEditProps {
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
    commune: string;
  };
  onEditSuccess: () => void;
  setShowAddressEdit: (show: boolean) => void;
  fetchLocations: (
    type: 'cities' | 'states' | 'communes',
    parentCode?: string
  ) => Promise<any[]>;
}

const AddressEdit: React.FC<AddressEditProps> = ({
  currentAddress,
  onEditSuccess,
  setShowAddressEdit,
  fetchLocations,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state: RootState) => state.account.user?.id);
  const navigate = useNavigate();
  const { Option } = Select;

  const [cities, setCities] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [communes, setCommunes] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedState, setSelectedState] = useState('');

  useEffect(() => {
    const loadInitialData = async () => {
      const citiesData = await fetchLocations('cities');
      setCities(citiesData);
      form.setFieldsValue({
        street: currentAddress.street,
        phoneNumber: currentAddress.phoneNumber,
        addressType: currentAddress.addressType,
        country: currentAddress.country,
      });
    };

    loadInitialData();
  }, [currentAddress, form, fetchLocations]);

  const handleCityChange = async (value: string, option: any) => {
    setSelectedCity(option.key);
    form.setFieldsValue({ state: undefined, commune: undefined });
    setSelectedState('');
    setCommunes([]);

    const newStates = await fetchLocations('states', option.key);
    setStates(newStates);
  };

  const handleStateChange = async (value: string, option: any) => {
    setSelectedState(option.key);
    form.setFieldsValue({ commune: undefined });

    const newCommunes = await fetchLocations('communes', option.key);
    setCommunes(newCommunes);
  };

  const onFinish = async (values: {
    street: string;
    city: string;
    country: string;
    state: string;
    commune: string;
    phoneNumber: string;
    addressType: string;
  }) => {
    const { street, city, country, state, commune, phoneNumber, addressType } =
      values;
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
        addressType,
        state,
        commune,
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
          message: 'Address update failed',
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
            : 'Error during update process!',
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
        onFinish={onFinish}
      >
        <div className="row">
        <div className="col-md-6">
            <Form.Item label="Country" name="country" initialValue="Việt Nam">
              <Input
                type="text"
                placeholder="Viet Nam"
                autoComplete="country"
                disabled
              />
            </Form.Item>
          </div>
          <div className="col-md-6">
            <Form.Item
              label="State/Province"
              name="city"
              rules={[{ required: true, message: 'Please input your City!' }]}
            >
              <Select placeholder="State/Province" onChange={handleCityChange}>
                {cities.map((city: any) => (
                  <Option key={city.code} value={city.name}>
                    {city.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div className="col-md-6">
            <Form.Item
              label="City/Town"
              name="state"
              rules={[{ required: true, message: 'Please input your State!' }]}
            >
              <Select
                placeholder="City/Town"
                onChange={handleStateChange}
                disabled={!selectedCity}
              >
                {states.map((state: any) => (
                  <Option key={state.code} value={state.name}>
                    {state.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div className="col-md-6">
            <Form.Item
              label="Commune/District"
              name="commune"
              rules={[
                { required: true, message: 'Please input your Commune!' },
              ]}
            >
              <Select placeholder="Commune/District" disabled={!selectedState}>
                {communes.map((commune: any) => (
                  <Option key={commune.code} value={commune.name}>
                    {commune.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </div>
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
        <div className="row">
          <div className="col-md-3">
            <Button
              type="primary"
              shape="round"
              htmlType="submit"
              block
              size="large"
              disabled={loading}
              loading={loading}
            >
              <div className=" text-[16px] font-medium text-center">
                <i className="fas fa-save mr-2"></i> Save Address
              </div>
            </Button>
          </div>
          <div className="col-md-3">
            <Button
              danger
              size="large"
              shape="round"
              type="primary"
              loading={loading}
              disabled={loading}
              onClick={() => setShowAddressEdit(false)}
            >
              <div className=" text-[16px] font-medium text-center">
                <i className="fas fa-times mr-2"></i> Cancel
              </div>
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default AddressEdit;
