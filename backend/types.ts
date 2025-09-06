// TypeScript interfaces for EcoFinds API
// Copy this file to your frontend project for type safety

export interface User {
  _id: string;
  username: string;
  email: string;
  fullName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  ok: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

export interface OtpRequest {
  email: string;
  otp: string;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: ProductCategory;
  condition: ProductCondition;
  images: string[];
  co2Saved: number;
  location?: {
    city: string;
    state: string;
  };
  tags: string[];
  seller: {
    username: string;
    email: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProductCategory =
  | 'Electronics'
  | 'Clothing'
  | 'Home & Garden'
  | 'Sports & Outdoors'
  | 'Books & Media'
  | 'Automotive'
  | 'Health & Beauty'
  | 'Toys & Games'
  | 'Other';

export type ProductCondition =
  | 'New'
  | 'Like New'
  | 'Good'
  | 'Fair'
  | 'Poor';

export interface ProductRequest {
  title: string;
  description: string;
  price: number;
  category: ProductCategory;
  condition: ProductCondition;
  images?: string[];
  co2Saved?: number;
  location?: {
    city: string;
    state: string;
  };
  tags?: string[];
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    current: number;
    pages: number;
    total: number;
  };
}

export interface CartItem {
  _id: string;
  product: {
    _id: string;
    title: string;
    price: number;
    images: string[];
    co2Saved: number;
    isActive: boolean;
  };
  quantity: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  totalCO2Saved: number;
}

export interface CartAddRequest {
  productId: string;
  quantity?: number;
}

export interface CartUpdateRequest {
  quantity: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

export interface CheckoutRequest {
  shippingAddress: ShippingAddress;
  paymentMethod?: PaymentMethod;
  notes?: string;
}

export interface CheckoutResponse {
  message: string;
  orderData: OrderData;
  totalAmount: number;
  totalCO2Saved: number;
}

export interface OrderItem {
  product: {
    _id: string;
    title: string;
    images: string[];
    category: string;
    condition: string;
  };
  quantity: number;
  price: number;
  co2Saved: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  buyer: string | User;
  items: OrderItem[];
  totalAmount: number;
  totalCO2Saved: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod =
  | 'credit_card'
  | 'debit_card'
  | 'paypal'
  | 'cash_on_delivery';

export interface OrdersResponse {
  orders: Order[];
  pagination: {
    current: number;
    pages: number;
    total: number;
  };
}

export interface OrderRequest {
  items: Array<{
    product: string;
    quantity: number;
    price: number;
    co2Saved?: number;
  }>;
  totalAmount: number;
  totalCO2Saved?: number;
  shippingAddress: ShippingAddress;
  paymentMethod?: PaymentMethod;
  notes?: string;
}

export interface OrderData {
  buyer: string;
  items: Array<{
    product: string;
    quantity: number;
    price: number;
    co2Saved: number;
  }>;
  totalAmount: number;
  totalCO2Saved: number;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface OrderStatusUpdate {
  status: OrderStatus;
}

export interface OrderStats {
  buyer: {
    totalOrders: number;
    totalSpent: number;
    totalCO2Saved: number;
    totalItems: number;
  };
  seller: {
    totalSales: number;
    totalRevenue: number;
    totalCO2Saved: number;
  };
}

export interface UploadResponse {
  success: boolean;
  filePath: string;
  filename: string;
  originalName: string;
  size: number;
}

export interface MultipleUploadResponse {
  success: boolean;
  files: UploadResponse[];
  count: number;
}

export interface ApiError {
  error: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ProductFilters extends PaginationParams {
  category?: ProductCategory | 'all';
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest';
}

export interface OrderFilters extends PaginationParams {
  status?: OrderStatus;
}

// API Function Types for Frontend Implementation
export interface ApiClient {
  // Auth
  signup: (data: SignupRequest) => Promise<AuthResponse>;
  login: (data: LoginRequest) => Promise<AuthResponse>;
  verifyOtp: (data: OtpRequest) => Promise<AuthResponse>;

  // Products
  getProducts: (filters?: ProductFilters) => Promise<ProductsResponse>;
  getProduct: (id: string) => Promise<Product>;
  createProduct: (data: ProductRequest) => Promise<Product>;
  updateProduct: (id: string, data: Partial<ProductRequest>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<{ message: string }>;
  getMyListings: () => Promise<Product[]>;

  // Cart
  getCart: () => Promise<Cart>;
  addToCart: (data: CartAddRequest) => Promise<Cart>;
  updateCartItem: (itemId: string, data: CartUpdateRequest) => Promise<Cart>;
  removeFromCart: (itemId: string) => Promise<Cart>;
  clearCart: () => Promise<{ message: string }>;
  checkout: (data: CheckoutRequest) => Promise<CheckoutResponse>;

  // Orders
  getOrders: (filters?: OrderFilters) => Promise<OrdersResponse>;
  getOrder: (id: string) => Promise<Order>;
  createOrder: (data: OrderRequest) => Promise<Order>;
  updateOrderStatus: (id: string, data: OrderStatusUpdate) => Promise<Order>;
  getSellerOrders: (filters?: OrderFilters) => Promise<OrdersResponse>;
  getOrderStats: () => Promise<OrderStats>;

  // Upload
  uploadImage: (file: File) => Promise<UploadResponse>;
  uploadMultipleImages: (files: FileList) => Promise<MultipleUploadResponse>;
}

// Utility types
export type ApiResponse<T> = T | ApiError;

export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
