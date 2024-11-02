import { useParams, useSearchParams } from 'react-router-dom';

function PaymentReturn() {
  const [searchParams] = useSearchParams();
  const vnp_Amount = searchParams.get('vnp_Amount');
  const vnp_BankCode = searchParams.get('vnp_BankCode');
  console.log(vnp_Amount);
  console.log(vnp_BankCode);
  return <></>;
}

export default PaymentReturn;
