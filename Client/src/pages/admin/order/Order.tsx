import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  notification,
  Row,
  Col,
  Select,
  Modal,
  Space,
  Tag,
} from 'antd';

import {
  callGetAllOrder,
  callUpdateStatusOrder,
  callCancelOrder,
} from '../../../services/serverApi';
import { ColumnType } from 'antd/es/table';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
const { confirm } = Modal;

interface OrderItem {
  orderId: string;
  userId: string;
  userEmail: string;
  orderStatus: string;
  paymentMethod: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  address: {
    id: string;
    street: string;
    commune: string;
    district: string | null;
    city: string;
    country: string;
    state: string;
    phoneNumber: string;
  };
  orderItems: {
    itemId: string;
    dishId: string;
    dishName: string;
    price: number;
    quantity: number;
    totalPrice: number;
    thumbImage: string;
    options: {
      optionId: string;
      optionName: string;
      additionalPrice: number;
    }[];
  }[];
}

enum OrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  PROCESSING = 'PROCESSING',
  SHIPPING = 'SHIPPING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

const Order: React.FC = () => {
  const [dataSource, setDataSource] = useState<OrderItem[]>([]);

  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [sortQuery, setSortQuery] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);

  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string>('');
  const [newStatus, setNewStatus] = useState<OrderStatus>();

  useEffect(() => {
    fetchOrders();
  }, [currentPage, pageSize, sortQuery]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let query = `pageNo=${currentPage - 1}&pageSize=${pageSize}`;
      if (sortQuery) {
        query += `&sortBy=${sortQuery}`;
      } else {
        query += `&sortBy=createdAt&sortDir=desc`;
      }
      const response = await callGetAllOrder(query);
      if (response.data._embedded?.orderResponseList) {
        setDataSource(response.data._embedded.orderResponseList);
        setTotalItems(response.data.page.totalElements);
        setCurrentPage(response.data.page.number + 1);
      } else {
        setDataSource([]);
        setTotalItems(0);
      }
    } catch (error) {
      notification.error({
        message: 'Lỗi khi tải danh sách đơn hàng',
        description: 'Vui lòng thử lại sau.',
        duration: 5,
        showProgress: true,
      });
    }
    setLoading(false);
  };

  const onChange = (pagination: any, sortDir: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
    if (sortDir && sortDir.field) {
      const order = sortDir.order === 'ascend' ? 'asc' : 'desc';
      setSortQuery(`${sortDir.field},${order}`);
    } else {
      setSortQuery('');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    confirm({
      title: 'Confirm cancel order',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to cancel this order?',
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          setLoading(true);
          const cancelResponse = await callCancelOrder(orderId);

          if (cancelResponse.status === 200) {
            const updateResponse = await callUpdateStatusOrder(
              orderId,
              OrderStatus.CANCELLED
            );

            if (updateResponse.status === 200) {
              notification.success({
                message: 'Cancel order successfully',
                duration: 5,
                showProgress: true,
              });
              fetchOrders();
            }
          } else {
            notification.error({
              message: 'Unable to cancel order',
              description:
                cancelResponse.data.errors?.error ||
                'Error during cancel process!',
              duration: 5,
              showProgress: true,
            });
          }
        } catch (error) {
          notification.error({
            message: 'Unable to cancel order',
            description: 'Error during cancel process!',
            duration: 5,
            showProgress: true,
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const renderOrderStatus = (status: string, record: OrderItem) => {
    const statusColor = {
      PENDING: '#faad14',
      ACCEPTED: '#1890ff',
      PROCESSING: '#722ed1',
      SHIPPING: '#52c41a',
      COMPLETED: '#52c41a',
      CANCELLED: '#ff4d4f',
    };

    const statusText = {
      PENDING: 'Pending',
      ACCEPTED: 'Accepted',
      PROCESSING: 'Processing',
      SHIPPING: 'Shipping',
      COMPLETED: 'Completed',
      CANCELLED: 'Cancelled',
    };

    return (
      <Tag
        className="font-bold text-base"
        color={statusColor[status as keyof typeof statusColor]}
      >
        {statusText[status as keyof typeof statusText] || status}
      </Tag>
    );
  };

  const handleUpdateStatusOrder = async (orderId: string) => {
    setSelectedOrder(orderId);
    setIsStatusModalVisible(true);
  };

  const handleStatusUpdate = async () => {
    if (!newStatus || !selectedOrder) return;

    try {
      setLoading(true);
      const response = await callUpdateStatusOrder(selectedOrder, newStatus);
      if (response.status === 200) {
        notification.success({
          message: 'Update status successfully',
          duration: 5,
          showProgress: true,
        });
        setIsStatusModalVisible(false);
        fetchOrders();
      } else {
        notification.error({
          message: 'Unable to update status',
          description:
            response.data.errors?.error || 'Error during update process!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Unable to update status',
        description: 'Error during update process!',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 180,
      render: (orderId: string) => {
        return (
          <div
            style={{
              cursor: 'pointer',
              whiteSpace: isExpanded ? 'normal' : 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            onClick={() => setIsExpanded(!isExpanded)}
            title={orderId}
          >
            {orderId}
          </div>
        );
      },
    },
    {
      title: 'User Email',
      dataIndex: 'userEmail',
      key: 'userEmail',
      sorter: (a: any, b: any) => a.userEmail.localeCompare(b.userEmail),
    },
    {
      title: 'Order Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => new Date(date).toLocaleString('vi-VN'),
      sorter: (a: any, b: any) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 150,
      render: (amount: number) => `${amount.toLocaleString()} VNĐ`,
      sorter: (a: any, b: any) => a.totalPrice - b.totalPrice,
    },
    {
      title: 'Status',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      width: 150,
      render: (status: string, record: OrderItem) =>
        renderOrderStatus(status, record),
      sorter: (a: any, b: any) => a.orderStatus.localeCompare(b.orderStatus),
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 150,
      render: (method: string) => {
        const paymentMethods = {
          COD: 'Cash',
          BANKING: 'Banking',
        };
        return paymentMethods[method as keyof typeof paymentMethods] || method;
      },
      sorter: (a: any, b: any) =>
        a.paymentMethod.localeCompare(b.paymentMethod),
    },
    {
      title: 'Delivery Address',
      dataIndex: 'address',
      key: 'address',
      width: 300,
      render: (address: any) =>
        address ? (
          <div>
            <div>{address.street}</div>
            <div>{`${address.commune}, ${address.city}`}</div>
            <div>{`${address.state}, ${address.country}`}</div>
            <div>SĐT: {address.phoneNumber}</div>
          </div>
        ) : null,
      sorter: (a: any, b: any) => {
        if (!a.address || !b.address) return 0;
        return a.address.phoneNumber.localeCompare(b.address.phoneNumber);
      },
    },
    {
      title: 'Order Detail',
      key: 'orderItems',
      fixed: 'right',
      width: 120,
      render: (_: any, record: OrderItem) => (
        <Button
          type="default"
          shape="round"
          icon={<EyeOutlined />}
          onClick={() => {
            Modal.info({
              title: 'Order Detail',
              width: 800,
              content: (
                <div>
                  {record.orderItems.map((item, index) => (
                    <div
                      key={item.itemId}
                      style={{
                        marginBottom: 15,
                        borderBottom:
                          index !== record.orderItems.length - 1
                            ? '1px solid #f0f0f0'
                            : 'none',
                        paddingBottom: 10,
                      }}
                    >
                      <Row gutter={[16, 8]} align="middle">
                        <Col span={6}>
                          <img
                            src={item.thumbImage}
                            alt={item.dishName}
                            style={{ width: '100%', borderRadius: 8 }}
                          />
                        </Col>
                        <Col span={18}>
                          <h4 style={{ margin: '0 0 8px 0' }}>
                            {item.dishName}
                          </h4>
                          <p>Quantity: {item.quantity}</p>
                          <p>
                            Original Price: {item.price.toLocaleString()} VNĐ
                          </p>
                          {item.options && item.options.length > 0 && (
                            <div>
                              <p>Options:</p>
                              {item.options.map((opt) => (
                                <p key={opt.optionId}>
                                  - {opt.optionName}: +
                                  {opt.additionalPrice.toLocaleString()} VNĐ
                                </p>
                              ))}
                            </div>
                          )}
                          <p>
                            <strong>
                              Total: {item.totalPrice.toLocaleString()} VNĐ
                            </strong>
                          </p>
                        </Col>
                      </Row>
                    </div>
                  ))}
                  <div
                    style={{
                      marginTop: 15,
                      textAlign: 'right',
                      borderTop: '2px solid #f0f0f0',
                      paddingTop: 15,
                    }}
                  >
                    <h3>Total: {record.totalPrice.toLocaleString()} VNĐ</h3>
                  </div>
                </div>
              ),
            });
          }}
        >
          View
        </Button>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 280,
      render: (_: any, record: OrderItem) => {
        const canCancel =
          record.orderStatus === 'PENDING' ||
          record.orderStatus === 'CONFIRMED';

        return (
          <Space>
            <Button
              type="primary"
              onClick={() => handleUpdateStatusOrder(record.orderId)}
              shape="round"
              disabled={record.orderStatus === 'COMPLETED' || record.orderStatus === 'CANCELLED'}
              icon={<EditOutlined />}
            >
              Edit Status
            </Button>
            <Button
              type="primary"
              danger
              shape="round"
              disabled={!canCancel}
              icon={<DeleteOutlined />}
              onClick={() => handleCancelOrder(record.orderId)}
            >
              Cancel
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="layout-content">
      <Table
        dataSource={dataSource}
        columns={columns as ColumnType<OrderItem>[]}
        rowKey="orderId"
        loading={loading}
        onChange={onChange}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '50', '100'],
          onShowSizeChange: (_, size) => {
            setCurrentPage(1);
            setPageSize(size);
          },
          onChange: (page) => {
            setCurrentPage(page);
          },
        }}
        scroll={{ x: 'max-content' }}
        bordered
        rowClassName={(record, index) =>
          index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
        }
      />

      <Modal
        title="Update order status"
        open={isStatusModalVisible}
        onOk={handleStatusUpdate}
        onCancel={() => setIsStatusModalVisible(false)}
        okText="Update"
        cancelText="Cancel"
      >
        <Select
          style={{ width: '100%' }}
          placeholder="Select new status"
          onChange={(value) => setNewStatus(value as OrderStatus)}
        >
          {Object.values(OrderStatus).map((status) => (
            <Select.Option key={status} value={status}>
              {status}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default Order;
