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
import {
  MinusCircleOutlined,
  PlusOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import {
  callAddNewOffers,
  callDishNameAndId,
} from '../../../services/serverApi';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

const { Option } = Select;

interface DishOption {
  dishId: string;
  dishName: string;
}

interface OfferFormValues {
  offers: {
    dishId: string;
    offerType:
      | 'DAILY'
      | 'BANNER'
      | 'MONTHLY_SPECIAL'
      | 'MEMBERSHIP'
      | 'FIRST_TIME_CUSTOMER_OFFER';
    startDate: Dayjs;
    endDate: Dayjs;
    availableQuantityOffer: number;
    discountPercentage: number;
  }[];
}

const ProductOfferDailyNew: React.FC<{
  onAddSuccess: () => void;
  setShowOfferNew: (show: boolean) => void;
}> = ({ onAddSuccess, setShowOfferNew }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dishes, setDishes] = useState<DishOption[]>([]);

  useEffect(() => {
    fetchDishes();
  }, []);

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

  const onFinish = async (values: OfferFormValues) => {
    setLoading(true);
    try {
      const formattedOffers = values.offers.map((offer) => ({
        dishId: offer.dishId,
        offerType: offer.offerType,
        startDate: dayjs(offer.startDate).format('YYYY-MM-DD'),
        endDate: dayjs(offer.endDate).format('YYYY-MM-DD'),
        availableQuantityOffer: offer.availableQuantityOffer,
        discountPercentage: offer.discountPercentage,
      }));

      const response = await callAddNewOffers(formattedOffers);

      if (response?.status === 200) {
        notification.success({
          message: 'Offers added successfully',
          description: 'The new offers have been added to the system.',
          duration: 5,
          showProgress: true,
        });
        form.resetFields();
        onAddSuccess();
      } else {
        notification.error({
          message: 'Error adding offers',
          description:
            response?.data?.errors?.error ||
            'An error occurred while adding the new offers.',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error adding offers',
        description:
          'An error occurred while adding the new offers. Please try again.',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const validateDates = (fieldName: number) => async (_: any, value: Dayjs) => {
    const startDate = form.getFieldValue(['offers', fieldName, 'startDate']);
    const endDate = form.getFieldValue(['offers', fieldName, 'endDate']);
    const offerType = form.getFieldValue(['offers', fieldName, 'offerType']);

    switch (offerType) {
      case 'DAILY':
        if (
          endDate &&
          (endDate < startDate || endDate > startDate.add(1, 'day'))
        ) {
          return Promise.reject('Daily offer must be within the same day');
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

  const getDefaultEndDate = (offerType: string, startDate: Dayjs) => {
    switch (offerType) {
      case 'DAILY':
        return startDate.add(1, 'day');
      case 'MONTHLY_SPECIAL':
        return startDate.add(30, 'day');
      case 'MEMBERSHIP':
        return startDate.add(365, 'day');
      case 'FIRST_TIME_CUSTOMER_OFFER':
        return startDate.add(90, 'day');
      default:
        return startDate;
    }
  };

  const handleOfferTypeChange = (value: string, fieldName: number) => {
    const startDate =
      form.getFieldValue(['offers', fieldName, 'startDate']) || dayjs();
    const newEndDate = getDefaultEndDate(value, startDate);
    form.setFieldValue(['offers', fieldName, 'endDate'], newEndDate);
  };

  const getAvailableDishes = (currentFieldName: number) => {
    const allOffers = form.getFieldValue('offers') || [];
    const selectedDishIds = allOffers
      .map((offer: any, index: number) =>
        index !== currentFieldName ? offer?.dishId : null
      )
      .filter(Boolean);

    return dishes.filter((dish) => !selectedDishIds.includes(dish.dishId));
  };

  return (
    <>
      <h4 className="text-2xl font-medium text-center mb-4">
        Create New Offers
      </h4>
      <Form
        form={form}
        name="offerNew"
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          offers: [
            {
              offerType: 'DAILY',
              startDate: dayjs(),
              endDate: dayjs().add(1, 'day'),
            },
          ],
        }}
      >
        <Form.List name="offers">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Card
                  key={key}
                  title={`Offer #${index + 1}`}
                  extra={
                    fields.length > 1 && (
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    )
                  }
                  style={{ marginBottom: 24 }}
                >
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'dishId']}
                        label="Select Dish"
                        className="font-medium"
                        rules={[
                          { required: true, message: 'Please select a dish!' },
                        ]}
                      >
                        <Select
                          showSearch
                          placeholder="Select a dish"
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            (option?.children as unknown as string)
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          onChange={() => {
                            // Force re-render để cập nhật danh sách món ăn có sẵn
                            form.setFields([
                              {
                                name: 'offers',
                                value: form.getFieldValue('offers'),
                              },
                            ]);
                          }}
                        >
                          {getAvailableDishes(name).map((dish) => (
                            <Option key={dish.dishId} value={dish.dishId}>
                              {dish.dishName}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'offerType']}
                        label="Offer Type"
                        className="font-medium"
                        rules={[
                          {
                            required: true,
                            message: 'Please select offer type!',
                          },
                        ]}
                      >
                        <Select
                          onChange={(value) =>
                            handleOfferTypeChange(value, name)
                          }
                        >
                          <Option value="DAILY">Daily</Option>
                          <Option value="BANNER">Banner</Option>
                          <Option value="MONTHLY_SPECIAL">
                            Monthly Special
                          </Option>
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
                        {...restField}
                        name={[name, 'startDate']}
                        label="Start Date"
                        className="font-medium"
                        rules={[
                          {
                            required: true,
                            message: 'Please select start date!',
                          },
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
                        {...restField}
                        name={[name, 'endDate']}
                        label="End Date"
                        className="font-medium"
                        rules={[
                          {
                            required: true,
                            message: 'Please select end date!',
                          },
                          { validator: validateDates(name) },
                        ]}
                      >
                        <DatePicker
                          style={{ width: '100%' }}
                          format="DD-MM-YYYY"
                          disabledDate={(current) => {
                            const startDate = form.getFieldValue([
                              'offers',
                              name,
                              'startDate',
                            ]);
                            const offerType = form.getFieldValue([
                              'offers',
                              name,
                              'offerType',
                            ]);

                            if (startDate) {
                              switch (offerType) {
                                case 'DAILY':
                                  return (
                                    current &&
                                    (current < startDate ||
                                      current > startDate.add(1, 'day'))
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
                        {...restField}
                        name={[name, 'availableQuantityOffer']}
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
                        {...restField}
                        name={[name, 'discountPercentage']}
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
                          parser={(value) => {
                            const parsed = parseInt(
                              value?.replace('%', '') ?? '',
                              10
                            );
                            return isNaN(parsed)
                              ? 0
                              : (Math.max(0, Math.min(parsed, 100)) as 0 | 100);
                          }}
                          className="w-full"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => {
                    // Kiểm tra xem còn món ăn nào chưa được chọn không
                    const availableDishes = getAvailableDishes(-1); // -1 để lấy tất cả món đã chọn
                    if (availableDishes.length === 0) {
                      notification.warning({
                        message: 'No dishes available',
                        description:
                          'All dishes have been selected in other offers.',
                        duration: 5,
                        showProgress: true,
                      });
                      return;
                    }
                    add({
                      offerType: 'DAILY',
                      startDate: dayjs(),
                      endDate: dayjs().add(1, 'day'),
                    });
                  }}
                  block
                  icon={<PlusOutlined />}
                  disabled={getAvailableDishes(-1).length === 0}
                >
                  Add Offer
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              shape="round"
              htmlType="submit"
              loading={loading}
              icon={<PlusOutlined />}
            >
              Save All Offers
            </Button>
            <Button
              type="primary"
              shape="round"
              danger
              onClick={() => setShowOfferNew(false)}
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

export default ProductOfferDailyNew;
