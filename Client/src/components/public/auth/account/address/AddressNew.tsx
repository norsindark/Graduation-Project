import { Form, Input, Radio, Button } from "antd";

const AddressNew = () => {

    const onFinish = (values: { street: string, city: string, country: string, state: string, postalCode: string, phoneNumber: string, email: string, address: string, addressType: string }) => {
        console.log(values);
    }

    return (
        <Form
            layout="vertical"
            onFinish={onFinish}
        >
            <Form.Item
                label="Street"
                name="street"
                rules={[{ required: true, message: 'Please input your Street!' }]}
            >
                <Input placeholder="Street" />
            </Form.Item>

            <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: 'Please input your City!' }]}
            >
                <Input placeholder="City" />
            </Form.Item>

            <Form.Item
                label="Country"
                name="country"
                rules={[{ required: true, message: 'Please input your Country!' }]}
            >
                <Input placeholder="Country" />
            </Form.Item>

            <Form.Item
                label="State"
                name="state"
            >
                <Input placeholder="State" />
            </Form.Item>

            <Form.Item
                label="Postal Code"
                name="postalCode"
                rules={[{ required: true, message: 'Please input your Postal Code!' }]}
            >
                <Input placeholder="Zip *" />
            </Form.Item>

            <Form.Item
                label="Phone Number"
                name="phoneNumber"
                rules={[{ required: true, message: 'Please input your Phone Number!' }]}
            >
                <Input placeholder="Phone *" />
            </Form.Item>

            <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please input your Email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
            >
                <Input type="email" placeholder="Email *" />
            </Form.Item>

            <Form.Item
                label="Address"
                name="address"
            >
                <Input.TextArea rows={4} placeholder="Address" />
            </Form.Item>

            <Form.Item
                name="addressType"
                label="Address Type"
                rules={[{ required: true, message: 'Please select an address type!' }]}
            >
                <Radio.Group>
                    <Radio value="home">Home</Radio>
                    <Radio value="office">Office</Radio>
                </Radio.Group>
            </Form.Item>

            <Form.Item>
                <Button type="default" className="common_btn cancel_new_address">Cancel</Button>
                <Button type="primary" htmlType="submit" className="common_btn">Save Address</Button>
            </Form.Item>
        </Form>
    )
}

export default AddressNew;