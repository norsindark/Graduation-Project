import { useSearchParams } from 'react-router-dom';
import { callPaymentReturn } from '../../services/clientApi';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doClearCartAction } from '../../redux/order/orderSlice';
import { notification } from 'antd';
import { useDispatch } from 'react-redux';

function PaymentReturn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const vnp_Amount = searchParams.get('vnp_Amount') || '';
  const vnp_BankCode = searchParams.get('vnp_BankCode') || '';
  const vnp_BankTranNo = searchParams.get('vnp_BankTranNo') || '';
  const vnp_CardType = searchParams.get('vnp_CardType') || '';
  const vnp_OrderInfo = searchParams.get('vnp_OrderInfo') || '';
  const vnp_PayDate = searchParams.get('vnp_PayDate') || '';
  const vnp_ResponseCode = searchParams.get('vnp_ResponseCode') || '';
  const vnp_TmnCode = searchParams.get('vnp_TmnCode') || '';
  const vnp_TransactionNo = searchParams.get('vnp_TransactionNo') || '';
  const vnp_TransactionStatus = searchParams.get('vnp_TransactionStatus') || '';
  const vnp_TxnRef = searchParams.get('vnp_TxnRef') || '';
  const vnp_SecureHash = searchParams.get('vnp_SecureHash') || '';

  useEffect(() => {
    const processPayment = async () => {
      if (vnp_TransactionStatus === '00') {
        try {
          const response = await callPaymentReturn(
            vnp_Amount,
            vnp_BankCode,
            vnp_BankTranNo,
            vnp_CardType,
            vnp_OrderInfo,
            vnp_PayDate,
            vnp_ResponseCode,
            vnp_TmnCode,
            vnp_TransactionNo,
            vnp_TransactionStatus,
            vnp_TxnRef,
            vnp_SecureHash
          );
          if (response.status === 200) {
            notification.success({
              message: 'Order success',
              description: (
                <div>
                  <p>Thank you for your order!</p>
                  <p>Please check your email for order details.</p>
                </div>
              ),
              duration: 5,
            });
            navigate('/order-success', {
              state: {
                orderId: response.data?.message,
                paymentMethod: 'VNPAY',
              },
            });
            dispatch(doClearCartAction());
          }
        } catch (error) {
          console.error('Payment return error:', error);
        }
      }
    };

    processPayment();
  }, []);

  return <></>;
}

export default PaymentReturn;
