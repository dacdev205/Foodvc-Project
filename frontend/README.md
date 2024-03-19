# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Tên Dự Án

Foodvc

# Mô tả sơ về dự án và các công nghệ sử dụng

Mục tiêu website: Xây dựng một trang bán hàng, với đầy đủ chức năng, phân
quyền, admin page. Phân chia component một cách tối ưu để tái sử dụng
code với giao diện bắt mắt, dễ sử dụng.
• Trang web được thiết kế theo mô hình MERN.

- Frontend: sử dụng HTML, CSS, framework ReacJS + ViteJS, Tailwind
  CSS, daisyui để làm giao diện người dùng.
- Backend: sử dụng NodeJS, ExpressJS, MongoDB để lưu trữ dữ liệu,
  JWT để phân quyền, dùng ¦rebase để quản lý người dùng

## Cài Đặt

Đảm bảo bạn đã cài đặt [Node.js](https://nodejs.org/en/) trước khi bắt đầu.

2. **Di chuyển vào thư mục dự án:**

   ```bash
   cd Foodvc
   ```

3. **Cài đặt dependencies:**

   Sử dụng npm:

   ```bash
   npm install
   ```

   hoặc sử dụng Yarn:

   ```bash
   yarn
   ```

## Sử Dụng

1.  **Chạy ứng dụng trong môi trường development:**

    - Đối với thư mục frontend => cd Foodvc/frontend
      Sử dụng npm:

      ```bash
      npm run dev
      ```

      hoặc sử dụng Yarn:

      ```bash
      yarn dev
      ```

    - Đối với thư mục backend => cd Foodvc/backend
      Sử dụng npm:

      ```bash
      npm start "vì có sử dụng nodemon để auto chạy lại server khi save"

      ```

      Ứng dụng sẽ được chạy trên `http://localhost:3000`.

2.  **Tạo production build:**

    Sử dụng npm:

    ```bash
    npm run build
    ```

    hoặc sử dụng Yarn:

    ```bash
    yarn build
    ```

## Các Chức Năng

Bao gồm hầu như toàn bộ các chức năng cơ bản của một website E-commerce

## Thông Tin Thêm

Sản phẩm chỉ dùng để học tập các công nghệ không dùng cho mục đích thương mại

---
