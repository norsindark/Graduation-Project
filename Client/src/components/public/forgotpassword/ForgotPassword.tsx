import React from 'react'; // Add this import
import { Form, Input, Button, message } from 'antd';
import { useState } from 'react';
import { callForgotPassword } from "../../../services/clientApi";
const ForgotPassword = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const onFinish = async (values: { email: string }) => {

        setIsSubmit(true);
        try {
            const res = await callForgotPassword(values.email); 
            console.log("res", res);

            if (res?.status === 200) {
                message.success('Password reset email sent successfully!');
            } else {
                message.error('Failed to send password reset email!');
            }
        } catch (error) {
            message.error('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
        } finally {
            setIsSubmit(false);
        }
    };

    return (
        <Form layout="vertical" className='mt-40' onFinish={onFinish}>
            <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
            >
                <Input type="email" placeholder="Email" autoComplete="email" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" block size="large" loading={isSubmit}>
                    Send Reset Link
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ForgotPassword;