# Sử dụng image Node.js chính thức
FROM node:latest

# Đặt thư mục làm việc
WORKDIR /app

# Sao chép file cấu hình package và cài đặt dependencies
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn frontend vào container
COPY . .

# Expose cổng 3000 để truy cập frontend
EXPOSE 3000

# Chạy Vite trong chế độ phát triển
CMD ["npm", "run", "dev", "--", "--host"]
