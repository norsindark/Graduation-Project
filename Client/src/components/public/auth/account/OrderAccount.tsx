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

  const handlePrintInvoice = () => {
    const printContent = document.createElement('div');
    printContent.innerHTML = `
      <html>
        <head>
          <title>invoice #${selectedOrder?.orderId.substring(0, 8).toUpperCase()}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              .print-button { display: none !important; }
            }
            body { font-family: 'Arial', sans-serif; }
          </style>
        </head>
        <body class="bg-gray-50 p-8">
          <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <!-- Header -->
            <div class="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4">
              <div class="flex justify-between items-center">
                <h1 class="text-2xl font-bold">
                  invoice #${selectedOrder?.orderId.substring(0, 8).toUpperCase()}
                </h1>
                <div class="text-sm">
                  <p>Order date: ${new Date(selectedOrder?.createdAt || '').toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
            </div>

            <!-- Thông tin khách hàng -->
            <div class="grid grid-cols-2 gap-8 p-8 bg-gray-50">
              <div>
                <h2 class="text-lg font-semibold text-gray-700 mb-4">Delivery information</h2>
                <div class="space-y-2 text-gray-600">
                  <p class="font-medium">Address:</p>
                  <p>${selectedOrder?.address?.street}, ${selectedOrder?.address?.commune}</p>
                  <p>${selectedOrder?.address?.city}, ${selectedOrder?.address?.state}</p>
                  <p class="font-medium mt-2">Phone number: ${selectedOrder?.address?.phoneNumber}</p>
                </div>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-700 mb-4">Order information</h2>
                <div class="space-y-2 text-gray-600">
                  <p><span class="font-medium">Email:</span> ${selectedOrder?.userEmail}</p>
                  <p><span class="font-medium">Status:</span> 
                    <span class="px-2 py-1 rounded-full text-sm ${
                      selectedOrder?.orderStatus === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }">
                      ${selectedOrder?.orderStatus}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <!-- Chi tiết đơn hàng -->
            <div class="p-8">
              <table class="w-full">
                <thead>
                  <tr class="bg-gray-50 border-b">
                    <th class="py-3 px-4 text-left text-sm font-semibold text-gray-600">STT</th>
                    <th class="py-3 px-4 text-left text-sm font-semibold text-gray-600">Dish name</th>
                    <th class="py-3 px-4 text-left text-sm font-semibold text-gray-600">Options</th>
                    <th class="py-3 px-4 text-right text-sm font-semibold text-gray-600">Price</th>
                    <th class="py-3 px-4 text-right text-sm font-semibold text-gray-600">Quantity</th>
                    <th class="py-3 px-4 text-right text-sm font-semibold text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody class="divide-y">
                  ${selectedOrder?.orderItems
                    .map(
                      (item, index) => `
                    <tr class="hover:bg-gray-50">
                      <td class="py-4 px-4 text-sm text-gray-600">${index + 1}</td>
                      <td class="py-4 px-4 text-sm text-gray-600">${item.dishName}</td>
                      <td class="py-4 px-4 text-sm text-gray-600">
                        ${item.options
                          .map(
                            (opt) =>
                              `<div class="text-xs text-gray-500">
                            ${opt.optionName} 
                            <span class="text-green-600">(+${opt.additionalPrice.toLocaleString()} VNĐ)</span>
                          </div>`
                          )
                          .join('')}
                      </td>
                      <td class="py-4 px-4 text-sm text-gray-600 text-right">
                        ${item.price.toLocaleString()} VNĐ
                      </td>
                      <td class="py-4 px-4 text-sm text-gray-600 text-right">${item.quantity}</td>
                      <td class="py-4 px-4 text-sm font-medium text-gray-900 text-right">
                        ${item.totalPrice.toLocaleString()} VNĐ
                      </td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
                <tfoot>
                  <tr class="border-t-2 border-gray-200">
                    <td colspan="5" class="py-4 px-4 text-right font-semibold text-gray-700">Tổng cộng:</td>
                    <td class="py-4 px-4 text-right font-bold text-lg text-green-600">
                      ${selectedOrder?.totalPrice.toLocaleString()} VNĐ
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <!-- Footer -->
            <div class="bg-gray-50 px-8 py-6 border-t">
              <div class="text-center text-gray-500 text-sm">
                <p>Thank you for using our service!</p>
                <p class="mt-1">For any questions, please contact: syncfood@example.com</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent.innerHTML);
      printWindow.document.close();
      printWindow.focus();

      printWindow.onload = function () {
        printWindow.print();
        printWindow.onafterprint = function () {
          printWindow.close();
        };
      };
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
            {listOrder.length > 0 && (
              <div className="absolute left-[50%] mt-2 transform z-1000 bg-white p-2 ">
                <Pagination
                  align="center"
                  current={current}
                  total={total}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                />
              </div>
            )}
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
                  {selectedOrder?.address?.city ?? ''},{' '}
                  {selectedOrder?.address?.state ?? ''}
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
                    #
                    {selectedOrder?.orderId?.substring(0, 8).toUpperCase() ??
                      ''}
                  </span>
                </p>
                <p>
                  <b>Email:</b> <span>{selectedOrder?.userEmail ?? ''}</span>
                </p>
                <p>
                  <b>Order date:</b>{' '}
                  <span>
                    {selectedOrder?.createdAt
                      ? new Date(selectedOrder.createdAt).toLocaleDateString(
                          'vi-VN'
                        )
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
            <a
              className="print_btn common_btn"
              onClick={handlePrintInvoice}
              style={{ cursor: 'pointer' }}
            >
              <i className="far fa-print"></i> Print invoice
            </a>
          </div>
        )}
        <PaymentModal />
      </div>
    </div>
  );
};

export default OrderAccount;
