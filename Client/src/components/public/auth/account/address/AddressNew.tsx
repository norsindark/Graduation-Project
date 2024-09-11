import { Form, Input, Radio, Button, message } from "antd";
import { callAddAddress } from "../../../../../services/clientApi"; // Import API call
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";

const AddressNew = ({ onAddSuccess, setShowAddressNew }: { onAddSuccess: () => void, setShowAddressNew: (show: boolean) => void }) => {
    const userId = useSelector((state: RootState) => state.account.user?.id);

    const onFinish = async (values: { street: string, city: string, country: string, state: string, postalCode: string, phoneNumber: string, email: string, addressType: string }) => {
        console.log(values);
        if (!userId) {
            message.error("User ID is missing");
            return;
        }
        try {
            const response = await callAddAddress(
                values.street,
                values.country,
                values.city,
                values.postalCode,
                values.addressType,
                values.state,
                values.phoneNumber,
                userId,
                values.email
            );

            if (response.status === 200) {
                message.success("Address added successfully");
                onAddSuccess(); // Call the success callback
            } else {
                message.error("Failed to add address");
            }
        } catch (error) {
            console.error("Error adding address:", error);
            message.error("Error adding address");
        }
    };

    return (
        <div className="container text-medium">
            <Form layout="vertical" onFinish={onFinish}>
                <div className="row">
                    <div className="col-md-12">
                        <Form.Item
                            label="Street"
                            name="street"
                            rules={[{ required: true, message: 'Please input your Street!' }]}
                        >
                            <Input.TextArea rows={2} placeholder="Street" autoComplete="street" />
                        </Form.Item>
                    </div>
                    <div className="col-md-6">
                        <Form.Item
                            label="City"
                            name="city"
                            rules={[{ required: true, message: 'Please input your City!' }]}
                        >
                            <Input placeholder="City" autoComplete="city" />
                        </Form.Item>
                    </div>
                    <div className="col-md-6">
                        <Form.Item
                            label="Country"
                            name="country"
                            rules={[{ required: true, message: 'Please input your Country!' }]}
                        >
                            <Input type="text" placeholder="Country" autoComplete="country" />
                        </Form.Item>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <Form.Item
                            label="State"
                            name="state"
                            rules={[{ required: true, message: 'Please input your State!' }]}
                        >
                            <Input type="text" placeholder="State" autoComplete="state" />
                        </Form.Item>
                    </div>
                    <div className="col-md-6">
                        <Form.Item
                            label="Postal Code"
                            name="postalCode"
                            rules={[{ required: true, message: 'Please input your Postal Code!' }]}
                        >
                            <Input type="text" placeholder="Postal Code" autoComplete="postal-code" />
                        </Form.Item>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <Form.Item
                            label="Phone Number"
                            name="phoneNumber"
                            rules={[{ required: true, message: 'Please input your Phone Number!' }]}
                        >
                            <Input type="text" placeholder="Phone Number" autoComplete="phone-number" />
                        </Form.Item>
                    </div>
                    <div className="col-md-6">
                        <Form.Item
                            name="addressType"
                            label="Address Type"
                            rules={[{ required: true, message: 'Please input your Address Type!' }]}
                        >
                            <Radio.Group>
                                <Radio value="home">Home</Radio>
                                <Radio value="office">Office</Radio>
                                <Radio value="other">Other</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </div>
                </div>
                <div className="row justify-content-start align-items-center">
                    <div className="col-md-3">
                        <Button type="primary" htmlType="submit" block size="large">
                            <div className="w-full font-medium text-center">Save Address</div>
                        </Button>
                    </div>
                    <div className="col-md-3">
                        <Button danger size="large" type="primary" className=" cancel_new_address" onClick={() => setShowAddressNew(false)}>
                            <div className="w-full font-medium text-center">Cancel</div>
                        </Button>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default AddressNew;



