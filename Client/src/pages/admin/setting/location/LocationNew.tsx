import React, { useEffect, useState } from 'react';
import { Form, Input, Button, notification, Select, InputNumber } from 'antd';
import { callAddNewLocation } from '../../../../services/serverApi';

interface LocationNewProps {
  onAddSuccess: () => void;
  setShowAddressNew: (show: boolean) => void;
  fetchLocations: (
    type: 'cities' | 'states' | 'communes',
    parentCode?: string
  ) => Promise<any[]>;
}

const LocationNew: React.FC<LocationNewProps> = ({
  onAddSuccess,
  setShowAddressNew,
  fetchLocations,
}) => {
  const [form] = Form.useForm();
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
    states: string; // changed from state to states
    city: string;
    commune: string;
    country: string;
    feePerKm: number;
  }) => {
    const { street, states, city, commune, country, feePerKm } = values;

    setIsSubmit(true);

    try {
      const response = await callAddNewLocation(
        street,
        commune,
        city,
        states,
        country,
        feePerKm
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
    } catch (error) {
      notification.error({
        message: 'Error creating address',
        description:
          error instanceof Error
            ? error.message
            : 'Error during creation process!',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setIsSubmit(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedCity('');
    setSelectedState('');
    setShowAddressNew(false);
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
              name="states"
              rules={[{ required: true, message: 'Please input your City!' }]}
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
              name="city"
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
          <div className="col-md-12">
            <Form.Item
              label="Fee Per Km"
              name="feePerKm"
              className="w-full"
              rules={[
                { required: true, message: 'Please input your Fee Per Km!' },
                {
                  pattern: /^\d+$/,
                  message: 'Fee Per Km can only contain digits!',
                },
              ]}
            >
              <InputNumber
                min={0}
                placeholder="Fee Per Km"
                autoComplete="fee-per-km"
                style={{ width: '100%' }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ'
                }
                parser={(value: string | undefined) =>
                  parseFloat(value?.replace(/\s?₫|(,*)/g, '') ?? '') || 0
                }
              />
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
              <div className="text-[16px] font-medium text-center">
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
              onClick={handleCancel}
            >
              <div className="text-[16px] font-medium text-center">
                <i className="fas fa-times mr-2"></i> Cancel
              </div>
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default LocationNew;
