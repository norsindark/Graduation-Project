package com.restaurant_management.services.impls;

import com.restaurant_management.configs.PaymentConfig;
import com.restaurant_management.entites.Order;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.repositories.OrderRepository;
import com.restaurant_management.services.interfaces.EmailService;
import com.restaurant_management.services.interfaces.PaymentService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final OrderRepository orderRepository;
    private final EmailService emailService;

    @Value("${vnp_TmnCode}")
    private String vnp_TmnCode;

    @Value("${vnp_ReturnUrl}")
    private String vnp_ReturnUrl;

    @Value("${vnp_PayUrl}")
    private String vnp_PayUrl;

    @Value("${vnp_secretKey}")
    private String secretKey;

    @Value("${vnp_ApiUrl}")
    private String vnp_ApiUrl;

    @Value("${timeOut}")
    private int timeOut;


    @Override
    public String createPaymentUrl(HttpServletRequest req, HttpSession session, String orderId) {

        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));

        String orderInfo = "Payment order: " + order.getId();
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String orderType = "other";
        long amount = (long) (order.getTotalPrice() * 100);
        String bankCode = req.getParameter("bankCode");

        String vnp_IpAddr = PaymentConfig.getIpAddress(req);

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_BankCode", bankCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", orderId);
        vnp_Params.put("vnp_OrderInfo", orderInfo);
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, timeOut);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        for (String fieldName : fieldNames) {
            String fieldValue = vnp_Params.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII)).append('=')
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (fieldNames.indexOf(fieldName) < fieldNames.size() - 1) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        String vnp_SecureHash = PaymentConfig.hmacSHA512(secretKey, hashData.toString());
        query.append("&vnp_SecureHash=").append(vnp_SecureHash);
        query.append("&vnp_SecureHashType=").append("SHA512");

        return vnp_PayUrl + "?" + query.toString();
    }

    @Override
    public ApiResponse paymentReturn(Map<String, String> params, HttpSession session)
            throws NoSuchAlgorithmException, UnsupportedEncodingException, MessagingException, DataExitsException {
        String vnp_SecureHash = params.get("vnp_SecureHash");

        params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");

        Map<String, String> fields = new TreeMap<>();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            String fieldName = URLEncoder.encode(entry.getKey(), StandardCharsets.US_ASCII);
            String fieldValue = URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII);

            if (fieldValue != null && !fieldValue.isEmpty()) {
                fields.put(fieldName, fieldValue);
            }
        }

        String signValue = PaymentConfig.hashAllFields(fields);

        if (!signValue.equals(vnp_SecureHash)) {
            throw new DataExitsException("Invalid signature");
        }

        String orderInfo = params.get("vnp_TxnRef");
        if (orderInfo == null) {
            throw new DataExitsException("Order not found");
        }

        if (!"00".equals(params.get("vnp_TransactionStatus"))) {
            updateOrderStatusToPaid(orderInfo, "FAILED");
            throw new DataExitsException("Payment failed with order: " + orderInfo);
        }

        updateOrderStatusToPaid(orderInfo, "PAID");
        return new ApiResponse(orderInfo, HttpStatus.OK);
    }

    private void updateOrderStatusToPaid(String orderId, String status) {
        Optional<Order> orderOptional = orderRepository.findById(orderId);
        if (orderOptional.isEmpty()) {
            throw new RuntimeException("Order not found");
        }
        Order order = orderOptional.get();
        order.setStatus(status);
        orderRepository.save(order);
    }
}
