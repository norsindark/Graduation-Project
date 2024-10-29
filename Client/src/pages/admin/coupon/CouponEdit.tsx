import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  InputNumber,
  DatePicker,
  notification,
  Row,
  Col,
  Switch,
} from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { callUpdateCoupon } from '../../../services/serverApi';
import dayjs from 'dayjs';

interface CouponItem {
  couponId: string;
  couponCode: string;
  description: string;
  discountPercent: number;
  maxDiscount: number;
  minOrderValue: number;
  availableQuantity: number;
  startDate: string;
  expirationDate: string;
  status: string;
  code: string;
  maxUsage: string;
}

interface CouponEditProps {
  currentItem: CouponItem;
  onEditSuccess: () => void;
  setShowCouponEdit: (show: boolean) => void;
}

const CouponEdit: React.FC<CouponEditProps> = ({
  currentItem,
  onEditSuccess,
  setShowCouponEdit,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(currentItem.status === 'ACTIVE');

  useEffect(() => {
    form.setFieldsValue({
      ...currentItem,
      code: currentItem.couponCode,
      maxUsage: currentItem.availableQuantity,
      startDate: dayjs(currentItem.startDate),
      expirationDate: dayjs(currentItem.expirationDate),
      status: currentItem.status,
    });
  }, [currentItem, form]);


  const onFinish = async (values: any) => {
    const {
      code,
      discountPercent,
      minOrderValue,
      maxDiscount,
      description,
      maxUsage,
      startDate,
      expirationDate,
      status,
    } = values;

    setLoading(true);
    try {
      const res = await callUpdateCoupon(
        currentItem.couponId,
        code,
        discountPercent,
        minOrderValue,
        maxDiscount,
        description,
        maxUsage,
        startDate.format('YYYY-MM-DD'),
        expirationDate.format('YYYY-MM-DD'),
        status
      );

      if (res.status === 200) {
        notification.success({
          message: 'Update successful',
          description: 'Coupon information has been updated.',
          duration: 5,
          showProgress: true,
        });
        onEditSuccess();
      } else {
        notification.error({
          message: 'Update failed',
          description: res.data.errors?.error || 'An error occurred!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Update failed',
        description: 'An error occurred!',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h4 className="text-2xl font-medium text-center mb-4">Edit Coupon</h4>

      <Form form={form} name="couponEdit" onFinish={onFinish} layout="vertical">
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="code"
              label="Coupon Code"
              className="font-medium"
              rules={[
                { required: true, message: 'Please enter the coupon code!' },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="discountPercent"
              label="Discount Percentage"
              className="font-medium"
              rules={[
                {
                  required: true,
                  message: 'Please enter the discount percentage!',
                },
              ]}
            >
              <InputNumber
                min={0}
                max={100}
                formatter={(value) => `${value}%`}
                parser={(value) => {
                  const parsed = parseInt(value?.replace('%', '') ?? '', 10);
                  return isNaN(parsed)
                    ? 0
                    : (Math.max(0, Math.min(parsed, 100)) as 0 | 100);
                }}
                className="w-full"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="minOrderValue"
              label="Minimum Order Value"
              className="font-medium"
              rules={[
                {
                  required: true,
                  message: 'Please enter the minimum order value!',
                },
              ]}
            >
              <InputNumber
                min={0}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ'
                }
                parser={(value: string | undefined): number => {
                  const parsed = parseFloat(value?.replace(/,/g, '') ?? '');
                  return isNaN(parsed) ? 0 : parsed;
                }}
                className="w-full"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="maxDiscount"
              label="Maximum Discount"
              className="font-medium"
              rules={[
                {
                  required: true,
                  message: 'Please enter the maximum discount!',
                },
              ]}
            >
              <InputNumber
                min={0}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ'
                }
                parser={(value: string | undefined): number => {
                  const parsed = parseFloat(value?.replace(/,/g, '') ?? '');
                  return isNaN(parsed) ? 0 : parsed;
                }}
                className="w-full"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="Description"
          className="font-medium"
        >
          <Input.TextArea rows={2} />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              name="maxUsage"
              label="Maximum Usage"
              className="font-medium"
              rules={[
                { required: true, message: 'Please enter the maximum usage!' },
              ]}
            >
              <InputNumber min={1} className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="startDate"
              label="Start Date"
              className="font-medium"
              rules={[
                { required: true, message: 'Please select the start date!' },
              ]}
            >
              <DatePicker className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="expirationDate"
              label="Expiration Date"
              className="font-medium"
              rules={[
                {
                  required: true,
                  message: 'Please select the expiration date!',
                },
              ]}
            >
              <DatePicker className="w-full" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Status" name="status" className="font-medium">
          <Switch
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            checked={isActive}
            onChange={(checked) => {
              setIsActive(checked);
              form.setFieldsValue({ status: checked ? 'ACTIVE' : 'INACTIVE' });
            }}
          />
        </Form.Item>
        <Form.Item className="mt-6">
          <Button
            type="primary"
            shape="round"
            htmlType="submit"
            loading={loading}
            icon={<SaveOutlined />}
            className="mr-2"
          >
            Update Coupon
          </Button>
          <Button
            danger
            type="primary"
            shape="round"
            onClick={() => setShowCouponEdit(false)}
            icon={<CloseOutlined />}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default CouponEdit;
