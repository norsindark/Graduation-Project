import { Button, notification, Pagination } from 'antd';
import { useEffect, useState } from 'react';
import { callGetOrderById } from '../../../../services/clientApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

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

const OrderAccount = () => {
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [listOrder, setListOrder] = useState<Order[]>([]);

  const [loading, setLoading] = useState(false);

  const userId = useSelector((state: RootState) => state.account.user?.id);

  if (!userId) {
    notification.error({
      message: 'Can not fetch order list',
      description: 'Please login to continue!',
      duration: 5,
      showProgress: true,
    });
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
      } else {
        notification.error({
          message: 'Can not fetch order list',
          description: response.data.errors?.error || 'Error in loading data!',
          duration: 5,
          showProgress: true,
        });
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
                          <span
                            className={`status ${order.orderStatus.toLowerCase()} ${order.orderStatus === 'PENDING' ? 'active' : ''} ${order.orderStatus === 'PAID' ? 'complete' : ''} ${order.orderStatus === 'CANCELLED' ? 'cancelled' : ''} `}
                          >
                            {order.orderStatus}
                          </span>
                        </td>
                        <td>
                          <h5>{order.totalPrice.toLocaleString()} VNĐ</h5>
                        </td>
                        <td>
                          <a
                            className="view_invoice"
                            onClick={() => handleViewInvoice(order)}
                          >
                            View detail
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
                <li
                  className={
                    selectedOrder?.orderStatus === 'PENDING' ||
                    selectedOrder?.orderStatus === 'PAID' ||
                    selectedOrder?.orderStatus === 'PROCESSING' ||
                    selectedOrder?.orderStatus === 'SHIPPING' ||
                    selectedOrder?.orderStatus === 'COMPLETED'
                      ? 'active'
                      : ''
                  }
                >
                  Pending
                </li>
                <li
                  className={
                    selectedOrder?.orderStatus === 'ACCEPTED' ||
                    selectedOrder?.orderStatus === 'PAID'
                      ? 'active'
                      : ''
                  }
                >
                  Accepted
                </li>
                <li
                  className={
                    selectedOrder?.orderStatus === 'PROCESSING' ? 'active' : ''
                  }
                >
                  Processing
                </li>
                <li
                  className={
                    selectedOrder?.orderStatus === 'SHIPPING' ? 'active' : ''
                  }
                >
                  Shipping
                </li>
                <li
                  className={
                    selectedOrder?.orderStatus === 'COMPLETED' ? 'active' : ''
                  }
                >
                  Completed
                </li>
              </ul>
            </div>
            <div className="fp__invoice_header">
              <div className="header_address">
                <h4>Delivery address</h4>
                <p>
                  {selectedOrder?.address.street},{' '}
                  {selectedOrder?.address.commune}
                  <br />
                  {selectedOrder?.address.city}, {selectedOrder?.address.state}
                </p>
                <p>
                  <b>Phone:</b>{' '}
                  <span>{selectedOrder?.address.phoneNumber}</span>
                </p>
              </div>
              <div className="header_address">
                <p>
                  <b>Invoice code: </b>
                  <span>
                    #{selectedOrder?.orderId.substring(0, 8).toUpperCase()}
                  </span>
                </p>
                <p>
                  <b>Email:</b> <span>{selectedOrder?.userEmail}</span>
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
      </div>
    </div>
  );
};

export default OrderAccount;
