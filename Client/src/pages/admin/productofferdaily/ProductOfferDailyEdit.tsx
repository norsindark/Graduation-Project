import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  notification,
  Row,
  Col,
  DatePicker,
  Space,
  Card,
  InputNumber,
} from 'antd';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import {
  callUpdateOffers,
  callDishNameAndId,
} from '../../../services/serverApi';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

const { Option } = Select;

interface DishOption {
  dishId: string;
  dishName: string;
}

interface OfferItem {
  id: string;
  offerType: string;
  discountPercentage: number;
  availableQuantityOffer: number;
  startDate: string;
  endDate: string;
  dish: {
    dishId: string;
    dishName: string;
  };
}

const ProductOfferDailyEdit: React.FC<{
  currentItem: OfferItem;
  onEditSuccess: () => void;
  setShowOfferEdit: (show: boolean) => void;
}> = ({ currentItem, onEditSuccess, setShowOfferEdit }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dishes, setDishes] = useState<DishOption[]>([]);

  useEffect(() => {
    fetchDishes();
    form.setFieldsValue({
      dishId: currentItem.dish.dishId,
      offerType: currentItem.offerType,
      startDate: dayjs(currentItem.startDate),
      endDate: dayjs(currentItem.endDate),
      availableQuantityOffer: currentItem.availableQuantityOffer,
      discountPercentage: currentItem.discountPercentage,
    });
  }, [currentItem]);

  const fetchDishes = async () => {
    try {
      const response = await callDishNameAndId();
      if (response?.status === 200 && response.data) {
        setDishes(response.data);
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to fetch dish list',
        duration: 5,
        showProgress: true,
      });
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const formattedOffer = {
        id: currentItem.id,
        dishId: values.dishId,
        offerType: values.offerType,
        startDate: dayjs(values.startDate).format('YYYY-MM-DD'),
        endDate: dayjs(values.endDate).format('YYYY-MM-DD'),
        availableQuantityOffer: values.availableQuantityOffer,
        discountPercentage: values.discountPercentage,
      };

      const response = await callUpdateOffers([formattedOffer]);

      if (response?.status === 200) {
        notification.success({
          message: 'Success',
          description: 'Offer updated successfully',
          duration: 5,
          showProgress: true,
        });
        onEditSuccess();
      } else {
        notification.error({
          message: 'Error',
          description:
            response?.data?.errors?.error || 'Failed to update offer',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'An error occurred while updating the offer',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const validateDates = async (_: any, value: Dayjs) => {
    const startDate = form.getFieldValue('startDate');
    const endDate = form.getFieldValue('endDate');
    const offerType = form.getFieldValue('offerType');

    if (startDate && endDate && endDate.isBefore(startDate)) {
      return Promise.reject('End date must be after start date');
    }

    switch (offerType) {
      case 'DAILY':
        if (endDate && !endDate.isSame(startDate, 'day')) {
          return Promise.reject('Daily offer must be within the same day');
        }
        break;

      case 'WEEKLY_OFFER':
        if (endDate && endDate.diff(startDate, 'day') > 7) {
          return Promise.reject('Weekly offer cannot exceed 7 days');
        }
        break;

      case 'MONTHLY_SPECIAL':
        if (endDate && endDate.diff(startDate, 'day') > 30) {
          return Promise.reject('Monthly special cannot exceed 30 days');
        }
        break;

      case 'MEMBERSHIP':
        if (endDate && endDate.diff(startDate, 'day') > 365) {
          return Promise.reject('Membership offer cannot exceed 1 year');
        }
        break;

      case 'FIRST_TIME_CUSTOMER_OFFER':
        if (endDate && endDate.diff(startDate, 'day') > 90) {
          return Promise.reject(
            'First time customer offer cannot exceed 90 days'
          );
        }
        break;
    }

    return Promise.resolve();
  };

  const validateStartDate = async (_: any, value: Dayjs) => {
    if (value && value.isBefore(dayjs(), 'day')) {
      return Promise.reject('Start date cannot be before today');
    }
    return Promise.resolve();
  };

  const handleOfferTypeChange = (value: string) => {
    const startDate = form.getFieldValue('startDate') || dayjs();
    let newEndDate;

    switch (value) {
      case 'DAILY':
        newEndDate = startDate;
        break;
      case 'WEEKLY_OFFER':
        newEndDate = startDate.add(7, 'day');
        break;
      case 'MONTHLY_SPECIAL':
        newEndDate = startDate.add(30, 'day');
        break;
      case 'MEMBERSHIP':
        newEndDate = startDate.add(365, 'day');
        break;
      case 'FIRST_TIME_CUSTOMER_OFFER':
        newEndDate = startDate.add(90, 'day');
        break;
      default:
        newEndDate = startDate;
    }

    form.setFieldValue('endDate', newEndDate);
  };

  return (
    <>
      <h4 className="text-2xl font-medium text-center mb-4">Edit Offer</h4>
      <Form form={form} name="offerEdit" onFinish={onFinish} layout="vertical">
        <Card>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="dishId"
                label="Select Dish"
                className="font-medium"
                rules={[{ required: true, message: 'Please select a dish!' }]}
              >
                <Select
                  showSearch
                  placeholder="Select a dish"
                  optionFilterProp="children"
                  disabled
                >
                  {dishes.map((dish) => (
                    <Option key={dish.dishId} value={dish.dishId}>
                      {dish.dishName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="offerType"
                label="Offer Type"
                className="font-medium"
                rules={[
                  { required: true, message: 'Please select offer type!' },
                ]}
              >
                <Select onChange={handleOfferTypeChange}>
                  <Option value="DAILY">Daily</Option>
                  <Option value="WEEKLY_OFFER">Weekly Offer</Option>
                  <Option value="MONTHLY_SPECIAL">Monthly Special</Option>
                  <Option value="MEMBERSHIP">Membership</Option>
                  <Option value="FIRST_TIME_CUSTOMER_OFFER">
                    First Time Customer Offer
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="startDate"
                label="Start Date"
                className="font-medium"
                rules={[
                  { required: true, message: 'Please select start date!' },
                  { validator: validateStartDate },
                ]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="DD-MM-YYYY"
                  disabledDate={(current) => {
                    return current && current < dayjs().startOf('day');
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="endDate"
                label="End Date"
                className="font-medium"
                rules={[
                  { required: true, message: 'Please select end date!' },
                  { validator: validateDates },
                ]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="DD-MM-YYYY"
                  disabledDate={(current) => {
                    const startDate = form.getFieldValue('startDate');
                    const offerType = form.getFieldValue('offerType');

                    if (startDate) {
                      switch (offerType) {
                        case 'DAILY':
                          return !current?.isSame(startDate, 'day');
                        case 'WEEKLY_OFFER':
                          return (
                            current &&
                            (current < startDate ||
                              current > startDate.add(7, 'day'))
                          );
                        case 'MONTHLY_SPECIAL':
                          return (
                            current &&
                            (current < startDate ||
                              current > startDate.add(30, 'day'))
                          );
                        case 'MEMBERSHIP':
                          return (
                            current &&
                            (current < startDate ||
                              current > startDate.add(365, 'day'))
                          );
                        case 'FIRST_TIME_CUSTOMER_OFFER':
                          return (
                            current &&
                            (current < startDate ||
                              current > startDate.add(90, 'day'))
                          );
                        default:
                          return current && current < startDate;
                      }
                    }
                    return current && current < dayjs().startOf('day');
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="availableQuantityOffer"
                label="Available Quantity"
                className="font-medium"
                rules={[
                  {
                    required: true,
                    message: 'Please enter available quantity!',
                  },
                ]}
              >
                <Input type="number" min={1} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="discountPercentage"
                label="Discount Percentage"
                className="font-medium"
                rules={[
                  {
                    required: true,
                    message: 'Please enter discount percentage!',
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  formatter={(value) => `${value}%`}
                  parser={(value: any) => {
                    const parsed = parseInt(value?.replace('%', '') ?? '', 10);
                    return isNaN(parsed)
                      ? 0
                      : Math.min(Math.max(parsed, 0), 100);
                  }}
                  className="w-full"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Form.Item className="mt-4">
          <Space>
            <Button
              type="primary"
              shape="round"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
            >
              Save Changes
            </Button>
            <Button
              type="primary"
              shape="round"
              danger
              onClick={() => setShowOfferEdit(false)}
              icon={<CloseOutlined />}
            >
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};

export default ProductOfferDailyEdit;
