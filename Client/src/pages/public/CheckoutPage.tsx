import { Button, Form, Radio, Select } from 'antd';
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { callBulkAddress, callDeleteAddress } from '../../services/clientApi';
import { Input, notification, Pagination } from 'antd';
import Loading from '../../components/Loading/Loading';
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

  const countries = [
    { code: 'VN', name: 'Vietnam' },
    { code: 'KR', name: 'Korea' },
    { code: 'JP', name: 'Japan' },
    { code: 'TH', name: 'Thailand' },
    { code: 'CN', name: 'China' },
    // Add more countries as needed
  ];
  const onFinish = (values: any) => {
    console.log(values);
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
                      <a
                        href="#"
                        data-bs-toggle="modal"
                        data-bs-target="#address_modal"
                      >
                        <i className="far fa-plus"></i> Create new address
                      </a>
                    </h5>

                    <div className="fp__address_modal">
                      <div
                        className="modal fade"
                        id="address_modal"
                        data-bs-backdrop="static"
                        data-bs-keyboard="false"
                        tabIndex={-1}
                        aria-labelledby="address_modalLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog modal-dialog-centered">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h1
                                className="modal-title fs-5"
                                id="address_modalLabel"
                              >
                                Create new address
                              </h1>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              ></button>
                            </div>
                            <div className="modal-body">
                              <Form layout="vertical" onFinish={onFinish}>
                                <div className="row">
                                  <div className="col-md-6 col-lg-12 col-xl-12">
                                    <div className="fp__check_single_form">
                                      <Form.Item
                                        label="Street"
                                        name="street"
                                        className="font-medium"
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              'Please input your Street!',
                                          },
                                        ]}
                                      >
                                        <Input.TextArea
                                          rows={2}
                                          placeholder="Street"
                                          autoComplete="street"
                                        />
                                      </Form.Item>
                                    </div>
                                  </div>
                                  <div className="col-md-6 col-lg-12 col-xl-6">
                                    <div className="fp__check_single_form">
                                      <Form.Item
                                        label="City"
                                        name="city"
                                        className="font-medium"
                                        rules={[
                                          {
                                            required: true,
                                            message: 'Please input your City!',
                                          },
                                        ]}
                                      >
                                        <Input
                                          placeholder="City"
                                          autoComplete="city"
                                        />
                                      </Form.Item>
                                    </div>
                                  </div>
                                  <div className="col-md-12 col-lg-12 col-xl-6">
                                    <div className="fp__check_single_form">
                                      <Form.Item
                                        label="State"
                                        name="state"
                                        className="font-medium"
                                        rules={[
                                          {
                                            required: true,
                                            message: 'Please input your State!',
                                          },
                                        ]}
                                      >
                                        <Input
                                          type="text"
                                          placeholder="State"
                                          autoComplete="state"
                                        />
                                      </Form.Item>
                                    </div>
                                  </div>
                                  <div className="col-md-6 col-lg-12 col-xl-6">
                                    <div className="fp__check_single_form ">
                                      <Form.Item
                                        label="Country"
                                        name="country"
                                        className="font-medium"
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              'Please select your Country!',
                                          },
                                        ]}
                                      >
                                        <Select
                                          placeholder="Select a country"
                                          showSearch
                                          optionFilterProp="children"
                                          filterOption={(input, option) =>
                                            option?.children
                                              ?.toString()
                                              .toLowerCase()
                                              .includes(input.toLowerCase()) ||
                                            false
                                          }
                                        >
                                          {countries.map((country) => (
                                            <Select.Option
                                              key={country.code}
                                              value={country.code}
                                            >
                                              {country.name}
                                            </Select.Option>
                                          ))}
                                        </Select>
                                      </Form.Item>
                                    </div>
                                  </div>
                                  <div className="col-md-6 col-lg-12 col-xl-6">
                                    <div className="fp__check_single_form">
                                      <Form.Item
                                        label="Postal Code"
                                        name="postalCode"
                                        className="font-medium"
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              'Please input your Postal Code!',
                                          },
                                          {
                                            pattern: /^\d{5}$/,
                                            message:
                                              'Postal Code must be exactly 5 digits!',
                                          },
                                        ]}
                                      >
                                        <Input
                                          type="text"
                                          placeholder="Postal Code"
                                          autoComplete="postal-code"
                                        />
                                      </Form.Item>
                                    </div>
                                  </div>
                                  <div className="col-md-6 col-lg-12 col-xl-6">
                                    <div className="fp__check_single_form">
                                      <Form.Item
                                        label="Phone Number"
                                        name="phoneNumber"
                                        className="font-medium"
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              'Please input your Phone Number!',
                                          },
                                          {
                                            pattern: /^\d+$/,
                                            message:
                                              'Phone Number can only contain digits!',
                                          },
                                        ]}
                                      >
                                        <Input
                                          type="text"
                                          placeholder="Phone Number"
                                          autoComplete="phone-number"
                                        />
                                      </Form.Item>
                                    </div>
                                  </div>
                                  <div className="col-md-6 col-lg-12 col-xl-6">
                                    <div className="fp__check_single_form">
                                      <Form.Item
                                        name="addressType"
                                        label="Address Type"
                                        className="font-medium"
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              'Please select your Address Type!',
                                          },
                                        ]}
                                      >
                                        <Radio.Group>
                                          <Radio value="home">Home</Radio>
                                          <Radio value="office">Office</Radio>
                                          <Radio value="other">Other</Radio>
                                        </Radio.Group>
                                      </Form.Item>
                                    </div>
                                  </div>

                                  <div className="row">
                                    <div className="col-md-3">
                                      <Button
                                        type="primary"
                                        shape="round"
                                        htmlType="submit"
                                        block
                                        size="large"
                                        // loading={isSubmit}
                                      >
                                        <div className=" text-[16px] font-medium text-center">
                                          <i className="fas fa-save mr-2"></i>{' '}
                                          Save Address
                                        </div>
                                      </Button>
                                    </div>
                                    <div className="col-md-3">
                                      <Button
                                        danger
                                        size="large"
                                        shape="round"
                                        type="primary"
                                        // loading={isSubmit}
                                        // onClick={() => setShowAddressNew(false)}
                                      >
                                        <div className=" text-[16px] font-medium text-center">
                                          <i className="fas fa-times mr-2"></i>{' '}
                                          Cancel
                                        </div>
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </Form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

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
    </>
  );
}

export default CheckoutPage;
