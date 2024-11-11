# Cart App

## Tampilan Aplikasi
### Halaman Awal
![image](https://github.com/user-attachments/assets/1854f031-965c-46a9-8c2d-4125a3d1045f)
### Modal Login
![image](https://github.com/user-attachments/assets/45e48261-7a25-4336-b739-30b99121bd61)
### Tambah Produk (Admin Only)
![image](https://github.com/user-attachments/assets/59513aaa-dc07-4c8c-b23e-ffb64f81c9a5)
### Autocomplete Tambah Keranjang Input
![image](https://github.com/user-attachments/assets/d9821cff-0994-44b4-8401-829a9dcef1de)
### Table Cart List
![image](https://github.com/user-attachments/assets/de15392f-e7fd-40f0-84f9-3c3bca2bf0cf)

---

## Technology Stack

### Frontend
- **React** (dengan **TypeScript**): Library JavaScript untuk membangun antarmuka pengguna, menggunakan TypeScript untuk pengetikan statis.
- **ShadCn**: Library komponen React yang digunakan untuk membangun komponen UI di frontend.
- **TenStackTable**: Library React untuk menampilkan data dalam bentuk tabel di frontend.

### Backend
- **Spring Boot**: Framework Java yang digunakan untuk membangun aplikasi backend dan microservices, menyediakan lingkungan yang kuat untuk aplikasi web.
- **Jakarta Validation**: Sekumpulan anotasi validasi yang digunakan untuk melakukan pemeriksaan validasi pada objek Java.
- **JPA (Java Persistence API)**: Spesifikasi Java untuk mengakses, menyimpan, dan mengelola data antara objek Java dan database relasional.
- **Bcrypt**: Algoritma hash password yang digunakan untuk menyimpan dan membandingkan password secara aman di backend.

### Database
- **PostgreSQL**: Sistem database objek-relasional sumber terbuka yang digunakan untuk menyimpan dan mengelola data.
---
## Database Scheme
![image](https://github.com/user-attachments/assets/b2a361df-1de7-4ac9-b4e2-a74876a8684e)

---

## API Documentation

API untuk mengelola pengguna di backend CartApp.

### Informasi API
- **Version**: 1.0.0
- **Base URL**: `/api/v1/users`

---

### User API

#### 1. Register User
**Endpoint**: `POST /api/v1/users/register`

- **Description**: Mendaftarkan pengguna baru dengan `username`, `password`, dan `name`.
- **Request Body**:
  - **Content-Type**: `application/json`
  - **Schema**:
    ```json
    {
      "username": "string (max: 100)",
      "password": "string (max: 100)",
      "name": "string"
    }
    ```
- **Responses**:
  - **200 OK**
    - **Content-Type**: `application/json`
    - **Body**:
      ```json
      {
        "data": "OK",
        "errors": null
      }
      ```
  - **400 Bad Request**
    - **Content-Type**: `application/json`
    - **Body**:
      ```json
      {
        "data": null,
        "errors": "Username already registered"
      }
      ```

#### 2. Get Current User Information
**Endpoint**: `GET /api/v1/users/current`

- **Description**: Mengambil informasi pengguna yang sedang login.
- **Headers**:
  - `X-API-TOKEN`: Token autentikasi pengguna (required).
- **Responses**:
  - **200 OK**
    - **Content-Type**: `application/json`
    - **Body**:
      ```json
      {
        "data": {
          "username": "string",
          "name": "string"
        },
        "errors": null
      }
      ```
  - **401 Unauthorized**
    - **Content-Type**: `application/json`
    - **Body**:
      ```json
      {
        "data": null,
        "errors": "Unauthorized"
      }
      ```
  - **403 Forbidden**
    - **Content-Type**: `application/json`
    - **Body**:
      ```json
      {
        "data": null,
        "errors": "Only admin can create products."
      }
      ```

#### 3. Login User
**Endpoint**: `POST /api/v1/auth/login`

- **Description**: Melakukan login pengguna dan menghasilkan token autentikasi.
- **Request Body**:
  - **Content-Type**: `application/json`
  - **Schema**:
    ```json
    {
      "username": "string (max: 100)",
      "password": "string (max: 100)"
    }
    ```
- **Responses**:
  - **200 OK**
    - **Content-Type**: `application/json`
    - **Body**:
      ```json
      {
        "data": {
          "token": "string",
          "expired_at": "long (timestamp)",
          "username": "string",
          "role": "integer"
        },
        "errors": null
      }
      ```
  - **401 Unauthorized**
    - **Content-Type**: `application/json`
    - **Body**:
      ```json
      {
        "data": null,
        "errors": "Username or password wrong"
      }
      ```

#### 4. Logout User
**Endpoint**: `DELETE /api/v1/auth/logout`

- **Description**: Melakukan logout pengguna saat ini dan menghapus token autentikasi.
- **Headers**:
  - `X-API-TOKEN`: Token autentikasi pengguna (required).
- **Responses**:
  - **200 OK**
    - **Content-Type**: `application/json`
    - **Body**:
      ```json
      {
        "data": "OK",
        "errors": null
      }
      ```
  - **401 Unauthorized**
    - **Content-Type**: `application/json`
    - **Body**:
      ```json
      {
        "data": null,
        "errors": "Unauthorized"
      }
      ```
---
### Product API
#### 1. Create Product
**Endpoint**: `POST /api/v1/product`

- **Description**: Menambahkan produk baru atau memperbarui produk yang sudah ada jika nama produk sudah ada.
- **Request Body**:
  - **Content-Type**: `application/json`
  - **Schema**:
    ```json
    {
      "name": "string (max: 255)",
      "sku": "string (max: 100)",
      "stock": "integer (min: 0)",
      "type": "string (max: 100)",
      "price": "integer (min: 0)"
    }
    ```
- **Responses**:
  - **200 OK**
    - **Content-Type**: `application/json`
    - **Body**:
      ```json
      {
        "data": {
          "productId": "long",
          "name": "string",
          "sku": "string",
          "stock": "integer",
          "type": "string",
          "price": "integer"
        },
        "errors": null
      }
      ```
  - **400 Bad Request**
    - **Content-Type**: `application/json`
    - **Body**:
      ```json
      {
        "data": null,
        "errors": "Validation errors or other request issues"
      }
      ```

#### 2. Get All Products
**Endpoint**: `GET /api/v1/product/all`

- **Description**: Mengambil daftar semua produk yang tersedia.
- **Request Headers**:
  - `X-API-TOKEN`: Token autentikasi pengguna (optional).
- **Responses**:
  - **200 OK**
    - **Content-Type**: `application/json`
    - **Body**:
      ```json
      {
        "data": [
          {
            "productId": "long",
            "name": "string",
            "sku": "string",
            "stock": "integer",
            "type": "string",
            "price": "integer"
          },
          {
            "productId": "long",
            "name": "string",
            "sku": "string",
            "stock": "integer",
            "type": "string",
            "price": "integer"
          }
        ],
        "errors": null
      }
      ```
  - **401 Unauthorized**
    - **Content-Type**: `application/json`
    - **Body**:
      ```json
      {
        "data": null,
        "errors": "Unauthorized"
      }
      ```

---
### Cart API

#### 1. Create Cart
**Endpoint**: `POST /api/v1/cart`

- **Description**: Menambahkan produk ke dalam keranjang belanja atau memperbarui jumlah produk yang sudah ada dalam keranjang berdasarkan `productId` dan `username`.
- **Request Body**:
  - **Content-Type**: `application/json`
  - **Schema**:
    ```json
    {
      "productId": "string (max: 255)",
      "username": "string (max: 100)",
      "qty": "integer (min: 1)",
      "status": "integer (0: active, 1: checkout)"
    }
    ```
- **Responses**:
  - **200 OK**
    - **Content-Type**: `application/json`
    - **Body**:
      ```json
      {
        "data": {
          "cart_id": "long",
          "qty": "integer",
          "price": "integer",
          "total_price": "integer"
        },
        "errors": null
      }
      ```
  - **400 Bad Request**
    - **Content-Type**: `application/json`
    - **Body**:
      ```json
      {
        "data": null,
        "errors": "Validation or data error"
      }
      ```


#### 2. Get All Carts
**Endpoint**: `GET /api/v1/cart/all`

- **Description**: Mengambil daftar semua produk dalam keranjang belanja berdasarkan `username` dengan pagination.
- **Request Parameters**:
  - `username` (required): Username pengguna.
  - `page` (optional, default: 0): Nomor halaman untuk pagination.
  - `size` (optional, default: 10): Jumlah data per halaman.
- **Responses**:
  - **200 OK**
    - **Content-Type**: `application/json`
    - **Body**:
      ```json
      {
        "data": [
          {
            "cart_id": "long",
            "price": "integer",
            "type": "string",
            "productPrice": "integer",
            "qty": "integer",
            "name": "string"
          },
          {
            "cart_id": "long",
            "price": "integer",
            "type": "string",
            "productPrice": "integer",
            "qty": "integer",
            "name": "string"
          }
        ],
        "errors": null
      }
      ```
  - **400 Bad Request**
    - **Content-Type**: `application/json`
    - **Body**:
      ```json
      {
        "data": null,
        "errors": "Invalid request parameters"
      }
      ```

#### 3. Checkout Cart
**Endpoint**: `POST /api/v1/cart/checkout`

- **Description**: Memproses checkout untuk produk yang ada di dalam keranjang belanja dan mengurangi stok produk yang dipesan dan mengubah status pembelian dari cart menjadi order.
- **Request Body**:
  - **Content-Type**: `application/json`
  - **Schema**:
    ```json
    {
      "username": "string (max: 100)",
      "cart_ids": ["long"]
    }
    ```
- **Responses**:
  - **200 OK**
    - **Content-Type**: `application/json`
    - **Body**:
      ```json
      {
        "data": "OK",
        "errors": null
      }
      ```
  - **400 Bad Request**
    - **Content-Type**: `application/json`
    - **Body**:
      ```json
      {
        "data": null,
        "errors": "Invalid data"
      }
      ```
