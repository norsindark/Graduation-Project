import React from 'react';
import { Button } from 'antd';
import axios from 'axios';

interface VNPayPaymentProps {
  orderId: number;
  amount: number;
}

const VNPayPayment: React.FC<VNPayPaymentProps> = ({ orderId, amount }) => {
  const handleVNPayPayment = async () => {
    try {
      const response = await axios.post('/api/create-vnpay-payment', {
        orderId,
        amount,
      });
      window.location.href = response.data.paymentUrl;
    } catch (error) {
      console.error('Lỗi khi tạo thanh toán VNPay:', error);
    }
  };

  return (
    <Button onClick={handleVNPayPayment} type="primary">
      Thanh toán qua VNPay
    </Button>
  );
};

export default VNPayPayment;
