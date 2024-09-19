import { useState, useEffect } from 'react';
import { FaLocationDot } from 'react-icons/fa6';
import { Button, Pagination, notification } from 'antd'; // Import Pagination
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import AddressNew from './AddressNew';
import AddressEdit from './AddressEdit'; // Import AddressEdit
import { callBulkAddress } from '../../../../../services/clientApi';
import Loading from '../../../../Loading/Loading';
import { callDeleteAddress } from '../../../../../services/clientApi';
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

const AddressAccount = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [total, setTotal] = useState(0); // Total addresses
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const pageSize = 2; // Number of addresses per page
  const [loading, setLoading] = useState(false);
  const [showAddressNew, setShowAddressNew] = useState(false); // Control form visibility
  const [showAddressEdit, setShowAddressEdit] = useState(false); // Control edit form visibility
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null); // Current address being edited
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
          setTotal(response.data.page.totalElements); // Set total number of addresses
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

  const handleAddSuccess = () => {
    setShowAddressNew(false);
    fetchAddresses(); // Refresh addresses after adding a new one
  };

  const handleEditSuccess = () => {
    setShowAddressEdit(false);
    setCurrentAddress(null);
    fetchAddresses(); // Refresh addresses after editing
  };

  const handleEditClick = (address: Address) => {
    setCurrentAddress(address);
    setShowAddressEdit(true);
  };

  const handleDeleteClick = (id: string) => {
    callDeleteAddress(id)
      .then(() => {
        notification.success({
          message: 'Address deleted successfully!',
          duration: 5,
          showProgress: true,
        });

        // After deleting, adjust total count and check if we need to go back a page
        setTotal((prevTotal) => prevTotal - 1);

        // If the current page becomes empty and it's not the first page, go back one page
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

  return (
    <div
      className="tab-pane fade"
      id="v-pills-address"
      role="tabpanel"
      aria-labelledby="v-pills-address-tab"
    >
      <div className="fp_dashboard_body address_body">
        <h3>
          <FaLocationDot style={{ fontSize: '22px', marginRight: '5px' }} />
          YOUR ADDRESS
        </h3>
        {!showAddressNew && !showAddressEdit && (
          <Button
            type="primary"
            className="mb-3 flex align-center justify-center"
            onClick={() => setShowAddressNew(true)}
            size="large"
            shape="round"
          >
            <i className="far fa-plus"></i>
            <span className="text-white align-center leading-4 text-center font-medium">
              Create New Address
            </span>
          </Button>
        )}
        {loading ? (
          <Loading />
        ) : (
          <div className="fp_dashboard_address">
            {showAddressNew ? (
              <AddressNew
                onAddSuccess={handleAddSuccess}
                setShowAddressNew={setShowAddressNew}
              />
            ) : showAddressEdit && currentAddress ? (
              <AddressEdit
                currentAddress={currentAddress}
                onEditSuccess={handleEditSuccess}
                setShowAddressEdit={setShowAddressEdit}
              />
            ) : (
              <div className="fp_dashboard_existing_address">
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
                </div>
              </div>
            )}
            {addresses.length > 0 && !showAddressNew && !showAddressEdit && (
              <div className="absolute bottom-20 left-1/2 transform z-1000 bg-white p-2 ">
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
        )}
      </div>
    </div>
  );
};

export default AddressAccount;
