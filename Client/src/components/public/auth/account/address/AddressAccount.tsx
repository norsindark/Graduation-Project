import { useState, useEffect } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { Button, Pagination } from "antd"; // Import Pagination
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import AddressNew from "./AddressNew";
import AddressEdit from "./AddressEdit";
import { callBulkAddress } from "../../../../../services/clientApi";
import Loading from "../../../../Loading/Loading";

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
}

const AddressAccount = () => {
    const [addresses, setAddresses] = useState([]);
    const [total, setTotal] = useState(0); // Total addresses
    const [currentPage, setCurrentPage] = useState(1); // Current page
    const pageSize = 2; // Number of addresses per page
    const [loading, setLoading] = useState(false);

    const userId = useSelector((state: RootState) => state.account.user?.id);

    useEffect(() => {
        if (userId) {
            const fetchAddresses = async () => {
                try {
                    setLoading(true);
                    await new Promise(resolve => setTimeout(resolve, 300));
                    const response = await callBulkAddress(userId, currentPage - 1, pageSize);
                    if (response.status === 200) {
                        const fetchedAddresses = response.data._embedded.addressByUserIdResponseList;
                        const flattenedAddresses = fetchedAddresses.flatMap((item: { addresses: Address[] }) => item.addresses);
                        setAddresses(flattenedAddresses);
                        setTotal(response.data.page.totalElements); // Set total number of addresses

                    }
                } catch (error) {
                    console.error("Error fetching addresses:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchAddresses();
        }
    }, [userId, currentPage, pageSize]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="tab-pane fade" id="v-pills-address" role="tabpanel"
            aria-labelledby="v-pills-address-tab">
            <div className="fp_dashboard_body address_body">
                <h3><FaLocationDot style={{ fontSize: '22px', marginRight: '5px' }} />YOUR ADDRESS</h3>
                <Button type="primary" className="mb-3 flex align-center justify-center">
                    <i className="far fa-plus"></i>
                    <span className="text-white align-center leading-4">Add new address</span>
                </Button>
                {/* Loading Spinner */}
                {loading ? (

                    <Loading />

                ) : (
                    <div className="fp_dashboard_address">
                        <div className="fp_dashboard_existing_address">
                            <div className="row">
                                {addresses?.map((address: Address, index: number) => (
                                    <div key={index} className="col-md-6">
                                        <div className="fp__checkout_single_address">
                                            <div className="form-check">
                                                <label className="form-check-label">
                                                    <span className="icon mb-3"><i className="fas fa-home"></i>
                                                        {address.addressType}
                                                    </span>
                                                    <div className="p-2 bg-white shadow-md rounded-lg">
                                                        <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                                                            <div className="flex flex-col">
                                                                <div className="flex items-center mb-1 text-2xl">
                                                                    <span className="font-semibold text-gray-700 mr-1">Email:</span>
                                                                    <span className="text-gray-600">{address.email}</span>
                                                                </div>
                                                                <div className="flex items-center mb-1">
                                                                    <span className="font-semibold text-gray-700 mr-1">Phone:</span>
                                                                    <span className="text-gray-600">{address.phoneNumber}</span>
                                                                </div>
                                                                <div className="flex items-center mb-1">
                                                                    <span className="font-semibold text-gray-700 mr-1">Street:</span>
                                                                    <span className="text-gray-600">{address.street}</span>
                                                                </div>
                                                                <div className="flex items-center mb-1">
                                                                    <span className="font-semibold text-gray-700 mr-1">City:</span>
                                                                    <span className="text-gray-600">{address.city}</span>
                                                                </div>
                                                                <div className="flex items-center mb-1">
                                                                    <span className="font-semibold text-gray-700 mr-1">State:</span>
                                                                    <span className="text-gray-600">{address.state}</span>
                                                                </div>
                                                                <div className="flex items-center mb-1">
                                                                    <span className="font-semibold text-gray-700 mr-1">Country:</span>
                                                                    <span className="text-gray-600">{address.country}</span>
                                                                </div>
                                                                <div className="flex items-center mb-1">
                                                                    <span className="font-semibold text-gray-700 mr-1">Postal Code:</span>
                                                                    <span className="text-gray-600">{address.postalCode}</span>
                                                                </div>

                                                            </div>

                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                            <ul>
                                                <li><a className="dash_edit_btn"><i className="far fa-edit"></i></a></li>
                                                <li><a className="dash_del_icon"><i className="fas fa-trash-alt"></i></a></li>
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>


                        <div className="fp_dashboard_new_address">
                            <AddressNew />
                        </div>
                        <div className="fp_dashboard_edit_address">
                            <AddressEdit />
                        </div>
                    </div>

                )}
                {addresses.length > 0 && (
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
        </div>
    );
};

export default AddressAccount;
