import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { callResetPassword } from "../../../services/clientApi";

const ResetPassword = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token'); // Lấy token từ URL


    const onFinish = async (values: { password: string }) => {
        setIsSubmit(true);
        try {
            if (!token) {
                throw new Error('Token is missing');
            }
            console.log("values password", values.password);
            console.log("token", token);
            const res = await callResetPassword(token, values.password);
            console.log("resCallResetPassword", res);

            if (res?.status == 200) {
                message.success('Password reset successfully!');
            } else {
                message.error('Failed to reset password!');
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
                label="New Password"
                name="password"
                rules={[{ required: true, message: 'Please input your new password!' }]}
            >
                <Input.Password placeholder="New Password" autoComplete="new-password" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" block size="large" loading={isSubmit}>
                    Reset Password
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ResetPassword;