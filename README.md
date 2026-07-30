# LocalShop

LocalShop is an e-commerce marketplace MVP that allows local sellers to sell their products directly to customers.

The application was developed as a full-stack project using React, Node.js, Express and MongoDB.

## Features

### Customer

- Register and login
- Browse products
- Search products
- Filter products by category
- View product details
- Add products to cart
- Update cart quantities
- Remove products from cart
- Create orders
- Make simulated payments
- View order history

### Seller

- Register and login
- Add products
- Update products
- Delete products
- List own products
- View incoming orders
- Mark orders as shipped
- Mark orders as delivered

## Technologies

### Frontend

- React
- React Router
- CSS
- Vite

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication & Security

- JWT authentication
- bcrypt password hashing
- Role-based authorization
- Helmet
- CORS
- Rate limiting
- Environment variables
- Input validation

## Project Structure

```text
LocalShop/
├── frontend/
├── backend/
├── docs/
└── README.md
```

### Backend Architecture

```text
Routes
  ↓
Middleware
  ↓
Controllers
  ↓
Models
  ↓
MongoDB
```

## User Roles

The application supports two roles:

- customer
- seller

Customers can browse products, manage carts, create orders and make payments.

Sellers can manage their products and incoming orders.

## Order Flow

```text
Cart
 ↓
Order
 ↓
PENDING_PAYMENT
 ↓
Payment
 ↓
PAID / PAYMENT_FAILED
 ↓
SHIPPED
 ↓
DELIVERED
```

## FakePay

The project uses a simulated payment system.

Successful payment card:

```text
4242424242424242
```

Failed payment card:

```text
4000000000000000
```

Card data is not stored in the database.

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd LocalShop
```

### Backend

```bash
cd backend
npm install
```

Create:

```text
backend/.env
```

Example:

```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/localshop_mvp
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
```

Run:

```bash
npm run dev
```

Backend:

```text
http://localhost:5001
```

Health check:

```text
GET http://localhost:5001/api/health
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create:

```text
frontend/.env
```

```env
VITE_API_URL=http://localhost:5001/api
```

Run:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## MongoDB

The application uses MongoDB.

Local development connection:

```text
mongodb://127.0.0.1:27017/localshop_mvp
```

MongoDB Compass can be used to inspect the database.

## API Documentation

A Postman Collection is available under:

```text
docs/LocalShop.postman_collection.json
```

## Main API Endpoints

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id

GET    /api/cart
POST   /api/cart/items
PUT    /api/cart/items/:productId
DELETE /api/cart/items/:productId

POST   /api/orders
GET    /api/orders
GET    /api/orders/:id

POST   /api/payments/pay

GET    /api/seller/orders
PATCH  /api/seller/orders/:id/status
```

## Security

Passwords are hashed using bcrypt.

Authentication is handled using JWT.

Role-based authorization separates customer and seller operations.

Payment card information is never stored in MongoDB.

The backend also uses:

- Helmet
- CORS
- Rate limiting
- Environment variables

## API Documentation

Postman Collection dosyasına buradan ulaşabilirsiniz:

[LocalShop Postman Collection](./docs/LocalShop.postman_collection.json)

## Demo

A demo video demonstrates:

- Customer registration and login
- Seller registration and login
- Product management
- Product search and filtering
- Cart operations
- Order creation
- FakePay payment
- Seller order management
- Order delivery flow

