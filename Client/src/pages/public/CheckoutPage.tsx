import { Button, Form, Radio, Select } from 'antd';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import {
  callBulkAddress,
  callDeleteAddress,
  callGeocoding,
} from '../../services/clientApi';
import { Input, notification, Pagination } from 'antd';
import Loading from '../../components/Loading/Loading';
import Account from '../../components/public/auth/account/Account';

interface Address {
  id: string;
  street: string;
  city: string;
  country: string;
  postalCode: number;
  state: string;
  addressType: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string | null;
  userId: string;
  commune: string;
  district: string;
}

interface OrderSummary {
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
  appliedCoupon: {
    couponId: string;
    couponCode: string;
    discountAmount: number;
    // ... other coupon properties
  } | null;
}

interface DeliveryResponse {
  from: string;
  to: string;
  distance: string;
  fee: string;
}

function CheckoutPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [loading, setLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [updatedOrderSummary, setUpdatedOrderSummary] =
    useState<OrderSummary | null>(null);

  const userId = useSelector((state: RootState) => state.account.user?.id);

  const location = useLocation();
  const orderSummary = location.state?.orderSummary as OrderSummary;

  const formatPrice = (price: number) => {
    return Math.round(price).toLocaleString('vi-VN');
  };

  const fetchAddresses = async () => {
    if (userId) {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 300));
        const response = await callBulkAddress(
          userId,
          currentPage - 1,
          pageSize
        );
        if (response.status === 200) {
          const fetchedAddresses =
            response.data._embedded.addressByUserIdResponseList;
          const flattenedAddresses = fetchedAddresses.flatMap(
            (item: { addresses: Address[] }) => item.addresses
          );
          setAddresses(flattenedAddresses);
          setTotal(response.data.page.totalElements);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [userId, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = async (id: string) => {
    try {
      setLoading(true);
      const response = await callDeleteAddress(id);
      if (response.status === 200) {
        notification.success({
          message: 'Deleted successfully!',
          duration: 5,
          showProgress: true,
        });
        setTotal((prevTotal) => prevTotal - 1);
        if (addresses.length === 1 && currentPage > 1) {
          setCurrentPage((prevPage) => prevPage - 1);
        } else {
          setAddresses((prevAddresses) =>
            prevAddresses.filter((address) => address.id !== id)
          );
        }
        if (total % pageSize === 1 && currentPage > 1) {
          setCurrentPage((prevPage) => prevPage - 1);
        }
        fetchAddresses();
      } else {
        notification.error({
          message: 'Error deleting address',
          description:
            response.data.errors?.error || 'Error during deletion process!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      notification.error({
        message: 'Error deleting address',
        description: 'An unexpected error occurred. Please try again later.',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAddress = async (id: string) => {
    const address = addresses.find((address) => address.id === id);

    if (!address) {
      console.error('Address not found');
      return;
    }

    const { street, commune, district, city, state, country } = address;
    const addressString = [street, commune, district, city, state, country]
      .filter(Boolean)
      .join(', ');

    try {
      const response = await callGeocoding(addressString);
      setSelectedAddressId(id);

      const feeString = response.data.fee;
      const feeAmount = Math.round(
        parseFloat(feeString.replace(' VND', '').replace(',', ''))
      );

      const newOrderSummary = {
        ...orderSummary,
        delivery: feeAmount,
        total: Math.round(
          orderSummary.subtotal + feeAmount - (orderSummary.discount || 0)
        ),
      };
      setUpdatedOrderSummary(newOrderSummary);
    } catch (error) {
      console.error('Error calling geocoding API', error);
      notification.error({
        message: 'Error calculating delivery fee',
        description: 'Unable to calculate delivery fee. Please try again.',
        duration: 5,
      });
    }
  };

  const handleCreateNewAddress = () => {
    setIsAccountModalOpen(true);
    setEditingAddressId(null);
  };

  const handleEditClick = (address: Address) => {
    setEditingAddressId(address.id);
    setIsAccountModalOpen(true);
  };

  const handleAddressUpdate = () => {
    fetchAddresses(); // Refresh addresses when changes occur in AddressAccount
  };

  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      notification.warning({
        message: 'Please select delivery address',
        description: 'You need to select a delivery address before proceeding',
        duration: 5,
        showProgress: true,
      });
      return;
    }

    navigate('/payment', {
      state: {
        orderSummary: updatedOrderSummary || orderSummary,
        selectedAddressId,
      },
    });
  };

  return (
    <>
      <section
        className="fp__breadcrumb"
        style={{ background: 'url(images/counter_bg.jpg)' }}
      >
        <div className="fp__breadcrumb_overlay">
          <div className="container">
            <div className="fp__breadcrumb_text">
              <h1>Checkout</h1>
              <ul>
                <li>
                  <NavLink to="/">home</NavLink>
                </li>
                <span>
                  <i className="fas fa-angle-right mr-4"></i>
                </span>
                <li>
                  <NavLink to="/cart">Cart</NavLink>
                </li>
                <span>
                  <i className="fas fa-angle-right mr-4"></i>
                </span>
                <li>
                  <NavLink to="/checkout">Checkout</NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="fp__cart_view mt_125 xs_mt_95 mb_100 xs_mb_70">
        <div className="container">
          <div className="row">
            <div
              className="col-lg-8 col-lg-7 wow fadeInUp"
              data-wow-duration="1s"
            >
              <div className="fp__checkout_form">
                {loading ? (
                  <Loading />
                ) : (
                  <div className="fp__check_form">
                    <h5>
                      select address{' '}
                      <a href="#" onClick={handleCreateNewAddress}>
                        <i className="far fa-plus"></i> Create new address
                      </a>
                    </h5>

                    <div className="row">
                      {addresses?.map((address: Address, index: number) => (
                        <div key={index} className="col-md-6">
                          <div className="fp__checkout_single_address">
                            <div className="form-check">
                              <label className="form-check-label">
                                <span className="icon mb-3">
                                  <i className="fas fa-home"></i>
                                  {address.addressType}
                                </span>
                                <div className="p-2 bg-white shadow-md rounded-lg">
                                  <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-1">
                                    <div className="flex flex-col">
                                      <div className="flex items-center mb-1 ">
                                        <span className="font-semibold text-gray-700 mr-1">
                                          Phone:
                                        </span>
                                        <span className="text-gray-600">
                                          {address.phoneNumber}
                                        </span>
                                      </div>
                                      <div className="flex items-center mb-1 ">
                                        <span className="font-semibold text-gray-700 mr-1">
                                          Street:
                                        </span>
                                        <span className="text-gray-600">
                                          {address.street}
                                        </span>
                                      </div>
                                      <div className="flex items-center mb-1 ">
                                        <span className="font-semibold text-gray-700 mr-1">
                                          Commune:
                                        </span>
                                        <span className="text-gray-600">
                                          {address.commune}
                                        </span>
                                      </div>
                                      <div className="flex items-center mb-1">
                                        <span className="font-semibold text-gray-700 mr-1">
                                          State:
                                        </span>
                                        <span className="text-gray-600">
                                          {address.state}
                                        </span>
                                      </div>
                                      <div className="flex items-center mb-1">
                                        <span className="font-semibold text-gray-700 mr-1">
                                          City:
                                        </span>
                                        <span className="text-gray-600">
                                          {address.city}
                                        </span>
                                      </div>
                                      <div className="flex items-center mb-1">
                                        <span className="font-semibold text-gray-700 mr-1">
                                          Country:
                                        </span>
                                        <span className="text-gray-600">
                                          {address.country}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </label>
                            </div>
                            <ul>
                              <li>
                                <a
                                  className={`dash_check_icon ${selectedAddressId === address.id ? 'selected' : ''}`}
                                  onClick={() =>
                                    handleSelectAddress(address.id)
                                  }
                                >
                                  <i className="far fa-check"></i>
                                </a>
                              </li>
                              <li>
                                <a
                                  className="dash_edit_btn"
                                  onClick={() => handleEditClick(address)}
                                >
                                  <i className="far fa-edit"></i>
                                </a>
                              </li>
                              <li>
                                <a
                                  className="dash_del_icon"
                                  onClick={() => handleDeleteClick(address.id)}
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      ))}
                      {addresses.length > 0 && (
                        <div className=" bottom-20 left-1/2 transform z-1000 bg-white p-2 ">
                          <Pagination
                            align="center"
                            current={currentPage}
                            total={total}
                            pageSize={pageSize}
                            onChange={handlePageChange}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-4 wow fadeInUp" data-wow-duration="1s">
              <div id="sticky_sidebar" className="fp__cart_list_footer_button">
                <h6>total cart</h6>
                <p>
                  subtotal:{' '}
                  <span>
                    {formatPrice(
                      (updatedOrderSummary || orderSummary)?.subtotal || 0
                    )}{' '}
                    VNĐ
                  </span>
                </p>
                <p>
                  delivery:{' '}
                  <span>
                    {formatPrice(
                      (updatedOrderSummary || orderSummary)?.delivery || 0
                    )}{' '}
                    VNĐ
                  </span>
                </p>
                <p>
                  discount:{' '}
                  <span>
                    {formatPrice(
                      (updatedOrderSummary || orderSummary)?.discount || 0
                    )}{' '}
                    VNĐ
                  </span>
                </p>
                <p className="total">
                  <span>total:</span>{' '}
                  <span>
                    {formatPrice(
                      (updatedOrderSummary || orderSummary)?.total || 0
                    )}{' '}
                    VNĐ
                  </span>
                </p>

                <form>
                  {orderSummary?.appliedCoupon && (
                    <>
                      <div className="flex items-center ">
                        <span className=" w-[181px] ml-4">
                          Applied Coupon:{' '}
                        </span>
                        <input
                          type="text"
                          value={orderSummary.appliedCoupon.couponCode}
                          disabled
                          className="applied-coupon-input"
                        />
                      </div>
                    </>
                  )}
                </form>
                <a
                  className="common_btn"
                  onClick={handlePlaceOrder}
                  style={{ cursor: 'pointer' }}
                >
                  place order
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {isAccountModalOpen && (
        <Account
          onClose={() => {
            setIsAccountModalOpen(false);
            setEditingAddressId(null);
            fetchAddresses(); // Refresh addresses when modal is closed
          }}
          initialActiveTab="address"
          editingAddressId={editingAddressId}
          onAddressUpdate={handleAddressUpdate} // Pass the callback
        />
      )}
    </>
  );
}

export default CheckoutPage;
