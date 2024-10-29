import React, { useState, useEffect } from 'react';
import { Modal, Table, Spin, Typography, notification } from 'antd';
import dayjs from 'dayjs';
import { callGetCouponByCode } from '../../../services/serverApi';

interface CouponDetailProps {
  couponCode: string | undefined;
  visible: boolean;
  onClose: () => void;
}

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
}

const CouponDetail: React.FC<CouponDetailProps> = ({
  couponCode,
  visible,
  onClose,
}) => {
  const [coupon, setCoupon] = useState<CouponItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCouponDetail = async () => {
      setLoading(true);
      try {
        // Lấy chi tiết coupon từ API
        const response = await callGetCouponByCode(couponCode || '');

        if (response.status === 200) {
          setCoupon(response.data);
        } else {
          // Xử lý lỗi
          notification.error({
            message: 'Unable to load coupon detail',
            description:
              response.data.errors?.error || 'Error loading coupon detail',
            duration: 5,
          });
        }
      } catch (error) {
        notification.error({
          message: 'Unable to load coupon detail',
          description: 'Error loading coupon detail',
          duration: 5,
        });
      } finally {
        setLoading(false);
      }
    };

    if (visible && couponCode) {
      fetchCouponDetail();
    }
  }, [visible, couponCode]);

  const descriptionColumns = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => (
        <Typography.Paragraph
          ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
          style={{ wordBreak: 'break-word', margin: 0 }}
        >
          {description}
        </Typography.Paragraph>
      ),
    },
    {
      title: 'Available Quantity',
      dataIndex: 'availableQuantity',
      key: 'availableQuantity',
      sorter: (a: any, b: any) =>
        a.availableQuantity.localeCompare(b.availableQuantity),
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (startDate: string) => dayjs(startDate).format('DD/MM/YYYY'),
    },
    {
      title: 'Expiration Date',
      dataIndex: 'expirationDate',
      key: 'expirationDate',
      render: (expirationDate: string) =>
        dayjs(expirationDate).format('DD/MM/YYYY'),
    },
  ];

  return (
    <Modal
      title="Coupon Detail"
      open={visible}
      onCancel={onClose}
      width={800}
      footer={null}
      centered
    >
      {loading ? (
        <Spin tip="Loading coupon detail..." />
      ) : coupon ? (
        <>
          <h4 className="text-center text-xl font-semibold mb-4">
            Coupon Information
          </h4>
          <Table
            dataSource={[coupon]}
            columns={descriptionColumns}
            rowKey="couponId"
            pagination={false}
            bordered
          />
        </>
      ) : (
        <Typography.Text>No coupon details available</Typography.Text>
      )}
    </Modal>
  );
};

export default CouponDetail;
