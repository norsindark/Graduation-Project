import {
  Button,
  notification,
  Pagination,
  Tag,
  Modal,
  Popconfirm,
  Image,
} from 'antd';
import { useEffect, useState } from 'react';
import {
  callGetOrderById,
  callCancelOrder,
  callProcessPayment,
  callUpdateStatusOrder,
  callRepayOrder,
} from '../../../../services/clientApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import cod from '../../../../../public/images/cod.png';
import vnpay from '../../../../../public/images/vnpay.png';

interface OrderOption {
  optionId: string;
  optionName: string;
  additionalPrice: number;
}

interface OrderItem {
  itemId: string;
  dishId: string;
  dishName: string;
  price: number;
  quantity: number;
  totalPrice: number;
  thumbImage: string;
  options: OrderOption[];
}

interface Address {
  street: string;
  commune: string;
  city: string;
  state: string;
  country: string;
  phoneNumber: string;
}

interface Order {
  orderId: string;
  userEmail: string;
  orderStatus: string;
  totalPrice: number;
  createdAt: string;
  address: Address;
  orderItems: OrderItem[];
}

enum OrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  PROCESSING = 'PROCESSING',
  SHIPPING = 'SHIPPING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

const isStatusActive = (
  currentStatus: string | undefined,
  checkStatus: OrderStatus
): boolean => {
  if (!currentStatus) return false;

  if (currentStatus === OrderStatus.COMPLETED) return true;

  switch (checkStatus) {
    case OrderStatus.PENDING:
      return [
        OrderStatus.PENDING,
        OrderStatus.ACCEPTED,
        OrderStatus.PROCESSING,
        OrderStatus.SHIPPING,
      ].includes(currentStatus as OrderStatus);
    case OrderStatus.ACCEPTED:
      return [
        OrderStatus.ACCEPTED,
        OrderStatus.PROCESSING,
        OrderStatus.SHIPPING,
      ].includes(currentStatus as OrderStatus);
    case OrderStatus.PROCESSING:
      return [OrderStatus.PROCESSING, OrderStatus.SHIPPING].includes(
        currentStatus as OrderStatus
      );
    case OrderStatus.SHIPPING:
      return currentStatus === OrderStatus.SHIPPING;
    case OrderStatus.COMPLETED:
      return currentStatus === OrderStatus.COMPLETED;
    default:
      return false;
  }
};

const OrderAccount = () => {
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [listOrder, setListOrder] = useState<Order[]>([]);

  const [loading, setLoading] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [processingOrderId, setProcessingOrderId] = useState<string>('');

  const statusColor = {
    PENDING: '#faad14',
    ACCEPTED: '#1890ff',
    PROCESSING: '#722ed1',
    SHIPPING: '#52c41a',
    COMPLETED: '#52c41a',
    CANCELLED: '#ff4d4f',
  };

  const userId = useSelector((state: RootState) => state.account.user?.id);

  if (!userId) {
    return;
  }

  useEffect(() => {
    fetchItems();
  }, [current, pageSize]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      let query = `pageNo=${current - 1}&pageSize=${pageSize}`;
      query += `&sortBy=createdAt&sortDir=desc`;

      const response = await callGetOrderById(userId || '', query);
      if (response?.status === 200) {
        if (
          response?.data?._embedded?.orderResponseList &&
          Array.isArray(response.data._embedded.orderResponseList)
        ) {
          setListOrder(response.data._embedded.orderResponseList);
          setTotal(response.data.page.totalElements);
        } else {
          setListOrder([]);
          setTotal(0);
        }
      }
    } catch {
      notification.error({
        message: 'Can not fetch order list',
        description: 'Error in loading data!',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewInvoice = (order: Order) => {
    setSelectedOrder(order);
    setIsInvoiceModalOpen(true);
  };

  const handleGoBack = () => {
    setIsInvoiceModalOpen(false);
    setSelectedOrder(null);
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrent(page);
    if (pageSize) setPageSize(pageSize);
  };

  const handleCancelOrder = async (orderId: string) => {
    const { confirm } = Modal;
    confirm({
      title: 'Confirm cancel order',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to cancel this order?',
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          setLoading(true);
          const response = await callCancelOrder(orderId);

          if (response.status === 200) {
            notification.success({
              message: 'Cancel order successfully',
              duration: 5,
              showProgress: true,
            });
            fetchItems(); // Refresh lại danh sách
          } else {
            notification.error({
              message: 'Unable to cancel order',
              description:
                response.data.errors?.error || 'Error during cancel process!',
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

  const handlePayment = async (paymentMethod: 'COD' | 'BANKING') => {
    setLoading(true);
    try {
      if (paymentMethod === 'COD') {
        const response = await callRepayOrder(processingOrderId);
        if (response.status === 200) {
          notification.success({
            message: 'Order success',
            description: (
              <div>
                <p>Thank you for your order!</p>
                <p>Please check your email for order details.</p>
              </div>
            ),
            duration: 5,
            placement: 'top',
          });
          fetchItems();
        } else {
          notification.error({
            message: 'Error',
            description: response.data?.errors?.error || 'Update order failed',
            duration: 5,
            showProgress: true,
          });
        }
      } else if (paymentMethod === 'BANKING') {
        await callProcessPayment(processingOrderId);
      }
      setIsPaymentModalOpen(false);
    } catch (error) {
      console.error('Payment error:', error);
      notification.error({
        message: 'Payment error',
        description: 'An error occurred during the payment process',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const PaymentModal = () => {
    return (
      <Modal
        open={isPaymentModalOpen}
        onCancel={() => setIsPaymentModalOpen(false)}
        footer={null}
        width={600}
        centered
      >
        <div className="flex flex-col space-y-6">
          <h2 className="text-2xl font-bold text-center text-white bg-[#81c784] p-2 rounded-lg mt-4">
            Select Payment Method
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="transform transition-all hover:scale-105">
              <Popconfirm
                title="Are you sure you want to pay by cash on delivery?"
                onConfirm={() => handlePayment('COD')}
                okButtonProps={{ loading: loading }}
              >
                <button className="w-full p-4 border-2 rounded-lg hover:border-primary-500">
                  <div className="flex flex-col items-center space-y-3">
                    <Image
                      src={cod}
                      alt="COD"
                      className="w-16 h-16 object-contain"
                      preview={false}
                    />
                    <span className="font-bold text-gray-700">
                      Cash on delivery
                    </span>
                  </div>
                </button>
              </Popconfirm>
            </div>

            <div className="transform transition-all hover:scale-105">
              <Popconfirm
                title="Are you sure you want to pay by banking?"
                onConfirm={() => handlePayment('BANKING')}
                okButtonProps={{ loading: loading }}
              >
                <button className="w-full p-4 border-2 rounded-lg hover:border-primary-500">
                  <div className="flex flex-col items-center space-y-3">
                    <Image
                      src={vnpay}
                      alt="VNPay"
                      className="w-16 h-16 object-contain"
                      preview={false}
                    />
                    <span className="font-bold text-gray-700">Banking</span>
                  </div>
                </button>
              </Popconfirm>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div
      className="tab-pane fade"
      id="v-pills-order"
      role="tabpanel"
      aria-labelledby="v-pills-order-tab"
    >
      <div className="fp_dashboard_body">
        {!isInvoiceModalOpen ? (
          <>
            <h3>Order list</h3>
            <div className="fp_dashboard_order">
              <div className="table-responsive">
                <table className="table">
                  <tbody>
                    <tr className="t_header">
                      <th>Order ID</th>
                      <th>Order date</th>
                      <th>Status</th>
                      <th>Total price</th>
                      <th>Action</th>
                    </tr>
                    {listOrder.map((order) => (
                      <tr key={order.orderId}>
                        <td>
                          <h5>
                            #{order.orderId.substring(0, 8).toUpperCase()}
                          </h5>
                        </td>
                        <td>
                          <p>
                            {new Date(order.createdAt).toLocaleDateString(
                              'vi-VN'
                            )}
                          </p>
                        </td>
                        <td>
                          <span className="status">
                            <Tag
                              color={
                                statusColor[
                                  order.orderStatus as keyof typeof statusColor
                                ]
                              }
                            >
                              <p className="font-bold text-base">
                                {order.orderStatus}
                              </p>
                            </Tag>
                          </span>
                        </td>
                        <td>
                          <h5>{order.totalPrice.toLocaleString()} VNĐ</h5>
                        </td>
                        <td>
                          <a
                            className="view_invoice mr-2"
                            onClick={() => handleViewInvoice(order)}
                          >
                            <p className="text-base font-bold">View</p>
                          </a>
                          <a
                            className="cancel_order"
                            onClick={() => {
                              setProcessingOrderId(order.orderId);
                              setIsPaymentModalOpen(true);
                            }}
                            style={{
                              display:
                                order.orderStatus === 'FAILED'
                                  ? 'inline'
                                  : 'none',
                              cursor: 'pointer',
                            }}
                          >
                            <p className="text-base font-bold">Pay again</p>
                          </a>
                          <a
                            className="cancel_order"
                            onClick={() => handleCancelOrder(order.orderId)}
                            style={{
                              display:
                                order.orderStatus === 'PENDING'
                                  ? 'inline'
                                  : 'none',
                              cursor: 'pointer',
                            }}
                          >
                            <p className="text-base font-bold">Cancel</p>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="">
            <Button
              type="primary"
              shape="round"
              className="go_back"
              onClick={handleGoBack}
            >
              <i className="fas fa-long-arrow-alt-left"></i> Go back
            </Button>
            <div className="fp__track_order">
              <ul>
                {Object.values(OrderStatus).map((status) => (
                  <li
                    key={status}
                    className={
                      isStatusActive(selectedOrder?.orderStatus, status)
                        ? 'active'
                        : ''
                    }
                  >
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </li>
                ))}
              </ul>
            </div>
            <div className="fp__invoice_header">
              <div className="header_address">
                <h4>Delivery address</h4>
                <p>
                  {selectedOrder?.address?.street ?? ''},{' '}
                  {selectedOrder?.address?.commune ?? ''}
                  <br />
                  {selectedOrder?.address?.city ?? ''}, {selectedOrder?.address?.state ?? ''}
                </p>
                <p>
                  <b>Phone:</b>{' '}
                  <span>{selectedOrder?.address?.phoneNumber ?? ''}</span>
                </p>
              </div>
              <div className="header_address">
                <p>
                  <b>Invoice code: </b>
                  <span>
                    #{selectedOrder?.orderId?.substring(0, 8).toUpperCase() ?? ''}
                  </span>
                </p>
                <p>
                  <b>Email:</b> <span>{selectedOrder?.userEmail ?? ''}</span>
                </p>
                <p>
                  <b>Order date:</b>{' '}
                  <span>
                    {selectedOrder?.createdAt
                      ? new Date(selectedOrder.createdAt).toLocaleDateString('vi-VN')
                      : ''}
                  </span>
                </p>
              </div>
            </div>
            <div className="fp__invoice_body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <tbody>
                    <tr className="border_none">
                      <th className="sl_no">STT</th>
                      <th className="package">Dish name</th>
                      <th className="option">Options</th>
                      <th className="price">Price</th>
                      <th className="qnty">Quantity</th>
                      <th className="total">Total price option</th>
                    </tr>
                    {selectedOrder?.orderItems.map((item, index) => (
                      <tr key={item.itemId}>
                        <td className="sl_no">{index + 1}</td>
                        <td className="package">
                          <p>{item.dishName}</p>
                        </td>
                        <td className="option flex flex-col  gap-2">
                          {item.options.map((option) => (
                            <span key={option.optionId} className="size">
                              {option.optionName} (+
                              {option.additionalPrice.toLocaleString()} VNĐ)
                            </span>
                          ))}
                        </td>
                        <td className="price">
                          <b>{item.price.toLocaleString()} VNĐ</b>
                        </td>
                        <td className="qnty">
                          <b>{item.quantity}</b>
                        </td>
                        <td className="total">
                          <b>{item.totalPrice.toLocaleString()} VNĐ</b>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td className="package" colSpan={3}>
                        <b>Total price</b>
                      </td>
                      <td className="qnty">
                        <b></b>
                      </td>
                      <td className="total">
                        <b>{selectedOrder?.totalPrice.toLocaleString()} VNĐ</b>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <a className="print_btn common_btn" href="#">
              <i className="far fa-print"></i> Print invoice
            </a>
          </div>
        )}
        {listOrder.length > 0 && (
          <div className="absolute left-[55%] transform z-1000 bg-white p-2 ">
            <Pagination
              align="center"
              current={current}
              total={total}
              pageSize={pageSize}
              onChange={handlePageChange}
            />
          </div>
        )}
        <PaymentModal />
      </div>
    </div>
  );
};

export default OrderAccount;
