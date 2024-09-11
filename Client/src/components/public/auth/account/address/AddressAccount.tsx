import { FaLocationDot } from "react-icons/fa6";
import { Button } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import AddressNew from "./AddressNew";
import AddressEdit from "./AddressEdit";
const AddressAccount = () => {
    const addresses = useSelector((state: RootState) => state.account.user?.addresses);
    console.log(addresses);

    return (
        <div className="tab-pane fade" id="v-pills-address" role="tabpanel"
            aria-labelledby="v-pills-address-tab">
            <div className="fp_dashboard_body address_body">
                <h3><FaLocationDot style={{ fontSize: '22px', marginRight: '5px' }} />YOUR ADDRESS</h3>
                <Button type="primary" className="mb-3 flex align-center justify-center"><i className="far fa-plus"></i><span className="text-white align-center leading-4">Add new address</span></Button>
                <div className="fp_dashboard_address">
                    <div className="fp_dashboard_existing_address">
                        <div className="row">
                            {addresses?.map((address, index) => (
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
                    <div className="fp_dashboard_new_address ">
                        <AddressNew />
                    </div>
                    <div className="fp_dashboard_edit_address ">
                        <AddressEdit />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddressAccount;