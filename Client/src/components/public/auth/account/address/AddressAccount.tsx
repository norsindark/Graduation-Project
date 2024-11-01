import React, { useState, useEffect, useCallback } from 'react';
import { FaLocationDot } from 'react-icons/fa6';
import { Button, Pagination, notification } from 'antd'; // Import Pagination
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import AddressNew from './AddressNew';
import AddressEdit from './AddressEdit'; // Import AddressEdit
import {
  callBulkAddress,
  callDeleteAddress,
} from '../../../../../services/clientApi';
import Loading from '../../../../Loading/Loading';
import axios from 'axios';

// Định nghĩa interface cho props
interface AddressAccountProps {
  editingAddressId: string | null;
  onAddressUpdate?: () => void;
}

// Định nghĩa interface cho Address (nếu chưa có)
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
}

const AddressAccount: React.FC<AddressAccountProps> = ({
  editingAddressId,
  onAddressUpdate,
}) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [total, setTotal] = useState(0); // Total addresses
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const pageSize = 2; // Number of addresses per page
  const [loading, setLoading] = useState(false);
  const [showAddressNew, setShowAddressNew] = useState(false); // Control form visibility
  const [showAddressEdit, setShowAddressEdit] = useState(false); // Control edit form visibility
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null); // Current address being edited
  const userId = useSelector((state: RootState) => state.account.user?.id);

  //fetch city, state, commune
  const [cities, setCities] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [communes, setCommunes] = useState<any[]>([]);

  const [selectedCity, setSelectedCity] = useState('');
  const [selectedState, setSelectedState] = useState('');

  const fetchLocations = useCallback(
    async (type: 'cities' | 'states' | 'communes', parentCode?: string) => {
      const endpoints = {
        cities: 'https://api.mysupership.vn/v1/partner/areas/province',
        states: `https://api.mysupership.vn/v1/partner/areas/district?province=${parentCode}`,
        communes: `https://api.mysupership.vn/v1/partner/areas/commune?district=${parentCode}`,
      };

      try {
        const response = await axios.get(endpoints[type]);
        return response.data.results;
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
        return [];
      }
    },
    []
  );

  const fetchAddresses = useCallback(async () => {
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
  }, [userId, currentPage, pageSize]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddSuccess = () => {
    setShowAddressNew(false);
    fetchAddresses();
    onAddressUpdate?.();
  };

  const handleEditSuccess = () => {
    setShowAddressEdit(false);
    setCurrentAddress(null);
    fetchAddresses();
    onAddressUpdate?.();
  };

  const handleEditClick = useCallback(
    (address: Address) => {
      setCurrentAddress(address);
      setSelectedCity(address.city);
      setSelectedState(address.state);
      setShowAddressEdit(true);

      fetchLocations('states', address.city).then(setStates);
      fetchLocations('communes', address.state).then(setCommunes);
    },
    [fetchLocations]
  );

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

  useEffect(() => {
    fetchLocations('cities').then(setCities);
  }, [fetchLocations]);

  // Fetch states khi selectedCity thay đổi
  useEffect(() => {
    if (selectedCity) {
      fetchLocations('states', selectedCity).then(setStates);
      setSelectedState('');
      setCommunes([]);
    }
  }, [selectedCity, fetchLocations]);

  // Fetch communes khi selectedState thay đổi
  useEffect(() => {
    if (selectedState) {
      fetchLocations('communes', selectedState).then(setCommunes);
    }
  }, [selectedState, fetchLocations]);

  useEffect(() => {
    if (editingAddressId) {
      const addressToEdit = addresses.find(
        (addr) => addr.id === editingAddressId
      );
      if (addressToEdit) {
        handleEditClick(addressToEdit);
      }
    }
  }, [editingAddressId, addresses, handleEditClick]);

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
            shape="round"
            htmlType="submit"
            block
            size="large"
            disabled={loading}
            loading={loading}
            onClick={() => setShowAddressNew(true)}
          >
            <span className="text-white align-center leading-4 text-center font-medium">
              <i className="far fa-plus mr-2"></i> Create New Address
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
                fetchLocations={fetchLocations}
              />
            ) : showAddressEdit && currentAddress ? (
              <AddressEdit
                currentAddress={currentAddress}
                onEditSuccess={handleEditSuccess}
                setShowAddressEdit={setShowAddressEdit}
                fetchLocations={fetchLocations}
              />
            ) : (
              <div className="fp_dashboard_existing_address mt-8">
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
              <div className="absolute left-[55%] transform z-1000 bg-white p-2 ">
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
