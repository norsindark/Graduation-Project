// env.d.ts
/// <reference types="vite/client" />
// axiosConfig.ts
import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Lấy URL cơ sở từ biến môi trường
const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

// Tạo một instance của Axios với cấu hình URL cơ sở và tùy chọn gửi cookie
const instance = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Thêm interceptor cho yêu cầu
instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Làm điều gì đó trước khi yêu cầu được gửi
        return config;
    },
    (error: AxiosError) => {
        // Xử lý lỗi yêu cầu
        return Promise.reject(error);
    }
);

// Thêm interceptor cho phản hồi
instance.interceptors.response.use(
    (response: AxiosResponse<any>) => {
        // Mã trạng thái nằm trong phạm vi 2xx sẽ kích hoạt hàm này
        // Làm điều gì đó với dữ liệu phản hồi
        return response.data;
    },
    (error: AxiosError) => {
        // Mã trạng thái nằm ngoài phạm vi 2xx sẽ kích hoạt hàm này
        // Xử lý lỗi phản hồi
        return Promise.reject(error.response?.data);
    }
);

export default instance;