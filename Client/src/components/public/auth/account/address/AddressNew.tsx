import React, { useEffect, useState } from 'react';
import { Form, Input, Radio, Button, notification, Select } from 'antd';
import { callAddAddress } from '../../../../../services/clientApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { useNavigate } from 'react-router-dom';

interface AddressNewProps {
  onAddSuccess: () => void;
  setShowAddressNew: (show: boolean) => void;
  fetchLocations: (
    type: 'cities' | 'states' | 'communes',
    parentCode?: string
  ) => Promise<any[]>;
}

const AddressNew: React.FC<AddressNewProps> = ({
  onAddSuccess,
  setShowAddressNew,
  fetchLocations,
}) => {
  const [form] = Form.useForm();
  const userId = useSelector((state: RootState) => state.account.user?.id);
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
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
    };

    loadInitialData();
  }, [fetchLocations]);

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
    state: string;
    commune: string;
    country: string;
    phoneNumber: string;
    addressType: string;
  }) => {
    const { street, city, country, state, commune, phoneNumber, addressType } =
      values;

    if (!userId) {
      notification.error({
        message: 'User not found',
        description: 'Please login to create an address',
        duration: 5,
        showProgress: true,
      });
      setIsSubmit(false);
      navigate('/login');
      return;
    }
    setIsSubmit(true);
    try {
      const response = await callAddAddress(
        street,
        country,
        state,
        addressType,
        city,
        commune,
        phoneNumber,
        userId
      );
      if (response?.status === 200) {
        notification.success({
          message: 'Address created successfully!',
          duration: 5,
          showProgress: true,
        });
        onAddSuccess();
      } else {
        notification.error({
          message: 'Address creation failed',
          description: response.data.errors?.error || 'Something went wrong!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (addressError) {
      notification.error({
        message: 'Error creating address',
        description:
          addressError instanceof Error
            ? addressError.message
            : 'Error during creation process!',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <div className="container text-medium">
      <h4 className="fp__dsahboard_overview_item text-center flex justify-center items-center p-3 font-[500] text-[18px]">
        Create New Address
      </h4>
      <Form layout="vertical" form={form} onFinish={onFinish}>
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
              label="Province/State"
              name="city"
              rules={[{ required: true, message: 'Please input your State!' }]}
            >
              <Select placeholder="Province/State" onChange={handleCityChange}>
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
              rules={[{ required: true, message: 'Please input your City!' }]}
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
              loading={isSubmit}
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
              loading={isSubmit}
              onClick={() => setShowAddressNew(false)}
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

export default AddressNew;
