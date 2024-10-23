import { Button, Form, Radio, Select } from 'antd';
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { callBulkAddress, callDeleteAddress } from '../../services/clientApi';
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
  const [activeAccountTab, setActiveAccountTab] = useState<string | null>(null);

  const userId = useSelector((state: RootState) => state.account.user?.id);
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

  const handleDeleteClick = (id: string) => {
    callDeleteAddress(id)
      .then(() => {
        notification.success({
          message: 'Address deleted successfully!',
          duration: 5,
          showProgress: true,
        });

        setTotal((prevTotal) => prevTotal - 1);

        if (addresses.length === 1 && currentPage > 1) {
          setCurrentPage((prevPage) => prevPage - 1);
        } else {
          fetchAddresses();
        }
      })
      .catch((error) => {
        notification.error({
          message: 'Error deleting address',
          description:
            error instanceof Error
              ? error.message
              : 'Error during deletion process!',
          duration: 5,
          showProgress: true,
        });
      });
  };

  const handleSelectAddress = (id: string) => {
    setSelectedAddressId(id);
    // Thêm logic khác nếu cần
  };

  const handleCreateNewAddress = () => {
    setIsAccountModalOpen(true);
    setActiveAccountTab('address');
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
                                          State:
                                        </span>
                                        <span className="text-gray-600">
                                          {address.state}
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
                                      <div className="flex items-center mb-1">
                                        <span className="font-semibold text-gray-700 mr-1">
                                          Postal Code:
                                        </span>
                                        <span className="text-gray-600">
                                          {address.postalCode}
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
                                  // onClick={() => handleEditClick(address)}
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
                  subtotal: <span>$124.00</span>
                </p>
                <p>
                  delivery: <span>$00.00</span>
                </p>
                <p>
                  discount: <span>$10.00</span>
                </p>
                <p className="total">
                  <span>total:</span> <span>$134.00</span>
                </p>
                <form>
                  <input type="text" placeholder="Coupon Code" />
                  <button type="submit">apply</button>
                </form>
                <a className="common_btn" href=" #">
                  checkout
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {isAccountModalOpen && (
        <Account
          onClose={() => setIsAccountModalOpen(false)}
          setActiveModal={setActiveAccountTab}
          initialActiveTab={activeAccountTab}
        />
      )}
    </>
  );
}

export default CheckoutPage;
