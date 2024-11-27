import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // Hữu ích khi chạy trong môi trường Docker hoặc hệ thống file không hỗ trợ theo dõi sự thay đổi file tự động.
    },
    host: true, // Để container Docker hoặc máy chủ khác có thể truy cập
    strictPort: true, // Đảm bảo dùng chính xác port đã cấu hình
    port: 3000, // Thay đổi nếu cần port khác
  },
  build: {
    outDir: '../public',  
    rollupOptions: {
      // input: '/index.html', // Đường dẫn tệp HTML chính
      external: [
        'jquery', // Đánh dấu là external, sẽ không được bundle
        'bootstrap',
        'slick-carousel',
        'isotope-layout',
        'simplycountdown',
        'venobox',
        'wowjs',
      ],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'], // Để lại các thư viện cần thiết
        },
      },
    },
    chunkSizeWarningLimit: 1500, // Tăng giới hạn cảnh báo kích thước chunk lên 1000 kB
  },
  resolve: {
    alias: {
      '@': '/src', // Giúp dễ dàng import các tệp trong src (ví dụ: `import utils from '@/utils'`)
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/global.scss";`, // Tự động import SCSS toàn cục nếu bạn dùng SCSS
      },
    },
  },
  optimizeDeps: {
    exclude: ['js-big-decimal'], // Loại trừ thư viện khỏi quá trình optimization
  },
  // base: './', // Đặt đường dẫn gốc, hữu ích nếu bạn deploy ứng dụng trong subfolder
  
});
