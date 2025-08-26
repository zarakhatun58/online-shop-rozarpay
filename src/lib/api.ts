import axios from "axios"
import type { Product } from "./types"

export const API_URL ="https://online-shop-server-hy92.onrender.com"

// ---------- PRODUCTS ----------

export async function getProducts(query?: string): Promise<Product[]> {
  const { data } = await axios.get(`${API_URL}/api/products`, {
    params: query ? { q: query } : {}
  })
  return data
}

export async function getProductById(id: string): Promise<Product> {
  const { data } = await axios.get(`${API_URL}/api/products/${id}`)
  return data
}

// ---------- AUTH ----------
export async function registerUser(payload: {
  username?: string
  email: string
  password: string
}) {
  const { data } = await axios.post(`${API_URL}/api/auth/register`, payload)
  return data
}

export async function loginUser(payload: {
  email: string
  password: string
}) {
  const { data } = await axios.post(`${API_URL}/api/auth/login`, payload)
  return data
}

export async function logoutUser() {
  const { data } = await axios.post(`${API_URL}/api/auth/logout`)
  return data
}

export async function getProfile(token: string) {
  const { data } = await axios.get(`${API_URL}/api/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return data
}

export async function forgotPassword(payload: { phone: string }) {
  const { data } = await axios.post(`${API_URL}/api/auth/forgot-password`, payload)
  return data
}

export async function verifyOtp(payload: { phone: string; otp: string }) {
  const { data } = await axios.post(`${API_URL}/api/auth/verify-otp`, payload)
  return data
}

export async function resetPassword(payload: { phone: string; newPassword: string }) {
  const { data } = await axios.post(`${API_URL}/api/auth/reset-password`, payload)
  return data
}


// ---------- ORDERS ----------
export async function createOrder(
  token: string,
  payload: { items: { product: string; qty: number }[]; amount: number; address: string }
) {
  const { data } = await axios.post(`${API_URL}/api/orders`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return data
}

export async function getMyOrders(token: string) {
  const { data } = await axios.get(`${API_URL}/api/orders/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return data
}

// ---------- PAYMENTS (stripe example) ----------
export async function createStripeCheckoutSession(
  token: string,
  payload: { items: any[]; amount: number; address: string; email: string }
) {
  const { data } = await axios.post(`${API_URL}/api/payments/checkout`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data; 
}

export async function createStripeOrder(token: string, payload: { items: any[]; amount: number; address: string }) {
  const { data } = await axios.post(`${API_URL}/api/payments`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data; // { order, clientSecret }
}

export async function updateOrderPaymentStatus(token: string, payload: { orderId: string; paymentId: string; status: string }) {
  const { data } = await axios.put(`${API_URL}/api/payments/payment`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function getOrders(token: string) {
  const { data } = await axios.get(`${API_URL}/api/payments/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

// --- Notification ---
export const fetchNotifications = async (userId: string, token: string) => {
  const res = await axios.get(`${API_URL}/api/notification/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const markNotificationAsRead = async (id: string, token: string) => {
  const res = await axios.put(
    `${API_URL}/api/notification/read/${id}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const markAllNotificationsAsRead = async (userId: string, token: string) => {
  const res = await axios.put(
    `${API_URL}/api/notification/read-all/${userId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};