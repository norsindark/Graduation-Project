import React, { useState, useEffect } from 'react';
import { Table, Button, notification, Row, Col } from 'antd';
import OrderNew from './OrderNew';
import OrderEdit from './OrderEdit';
import axios from 'axios';
import VNPayPayment from '../payment/VNPayPayment';

interface OrderItem {
  id: number;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: string;
  products: {
    id: number;
    name: string;
    quantity: number;
    price: number;
  }[];
}

const Order: React.FC = () => {
  const [dataSource, setDataSource] = useState<OrderItem[]>([]);
  const [showOrderNew, setShowOrderNew] = useState<boolean>(false);
  const [showOrderEdit, setShowOrderEdit] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<OrderItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/orders');
      if (Array.isArray(response.data.orders)) {
        setDataSource(response.data.orders);
      } else {
        console.error('Dữ liệu nhận được không phải là mảng:', response.data);
        setDataSource([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách đơn hàng:', error);
      notification.error({
        message: 'Không thể tải danh sách đơn hàng',
        duration: 5,
      });
      setDataSource([]);
    }
    setLoading(false);
  };

  const handleAddSuccess = () => {
    setShowOrderNew(false);
    notification.success({
      message: 'Đơn hàng đã được thêm thành công!',
      duration: 5,
    });
    fetchOrders();
  };

  const handleEditSuccess = () => {
    setShowOrderEdit(false);
    setCurrentItem(null);
    notification.success({
      message: 'Đơn hàng đã được cập nhật thành công!',
      duration: 5,
    });
    fetchOrders();
  };

  const handleEditClick = (item: OrderItem) => {
    setCurrentItem(item);
    setShowOrderEdit(true);
  };

  const handleDeleteClick = async (id: number) => {
    try {
      await axios.delete(`/api/orders/${id}`);
      notification.success({
        message: 'Đơn hàng đã được xóa thành công!',
        duration: 5,
      });
      fetchOrders();
    } catch (error) {
      notification.error({
        message: 'Không thể xóa đơn hàng',
        duration: 5,
      });
    }
  };

  const handleShipOrder = async (id: number) => {
    try {
      await axios.put(`/api/orders/${id}/ship`);
      notification.success({
        message: 'Đơn hàng đã được chuyển sang trạng thái giao hàng!',
        duration: 5,
      });
      fetchOrders();
    } catch (error) {
      notification.error({
        message: 'Không thể cập nhật trạng thái giao hàng',
        duration: 5,
      });
    }
  };

  const handleCompleteOrder = async (id: number) => {
    try {
      await axios.put(`/api/orders/${id}/complete`);
      notification.success({
        message: 'Đơn hàng đã được hoàn thành!',
        duration: 5,
      });
      fetchOrders();
    } catch (error) {
      notification.error({
        message: 'Không thể hoàn thành đơn hàng',
        duration: 5,
      });
    }
  };

  const columns = [
    { title: 'Mã đơn hàng', dataIndex: 'id', key: 'id' },
    { title: 'Tên khách hàng', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Ngày đặt hàng', dataIndex: 'orderDate', key: 'orderDate' },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `${amount.toLocaleString()} VNĐ`,
    },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: OrderItem) => (
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
            <Button
              type="primary"
              shape="round"
              block
              onClick={() => handleEditClick(record)}
            >
              Sửa
            </Button>
          </Col>
          <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
            <Button
              type="primary"
              shape="round"
              danger
              block
              onClick={() => handleDeleteClick(record.id)}
            >
              Xóa
            </Button>
          </Col>
          {record.status === 'Đã xác nhận' && (
            <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
              <Button
                type="primary"
                shape="round"
                block
                onClick={() => handleShipOrder(record.id)}
              >
                Giao hàng
              </Button>
            </Col>
          )}
          {record.status === 'Đang giao hàng' && (
            <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
              <Button
                type="primary"
                shape="round"
                block
                onClick={() => handleCompleteOrder(record.id)}
              >
                Hoàn thành
              </Button>
            </Col>
          )}
          {record.paymentMethod === 'VNPay' &&
            record.paymentStatus === 'Chưa thanh toán' && (
              <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                <VNPayPayment orderId={record.id} amount={record.totalAmount} />
              </Col>
            )}
        </Row>
      ),
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
    },
    {
      title: 'Địa chỉ giao hàng',
      dataIndex: 'shippingAddress',
      key: 'shippingAddress',
    },
  ];

  return (
    <div className="layout-content">
      <Row>
        <Col xs={24} sm={12} md={12} lg={8} xl={4} xxl={4}>
          {!showOrderNew && !showOrderEdit && (
            <Button
              type="primary"
              className="mb-3"
              onClick={() => setShowOrderNew(true)}
              size="large"
              shape="round"
              block
            >
              Thêm đơn hàng mới
            </Button>
          )}
        </Col>
      </Row>

      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
          {showOrderNew ? (
            <OrderNew
              onAddSuccess={handleAddSuccess}
              setShowOrderNew={setShowOrderNew}
            />
          ) : showOrderEdit && currentItem ? (
            <OrderEdit
              currentItem={currentItem}
              onEditSuccess={handleEditSuccess}
              setShowOrderEdit={setShowOrderEdit}
            />
          ) : (
            <Table
              dataSource={dataSource}
              columns={columns}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                total: dataSource.length,
              }}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Order;
