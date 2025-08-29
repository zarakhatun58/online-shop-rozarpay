import { Routes, Route, useSearchParams } from 'react-router-dom'
import Home from './pages/Home'
import CartPage from './pages/Cart'
import CheckoutPage from './pages/Checkout'
import Layout from './components/Layout'
import ProductDetails from './pages/ProductDetails'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import PaymentCancel from './pages/PaymentCancel'
import PaymentSuccess from './pages/PaymentSuccess'
import OrdersPage from './pages/OrdersPage'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { clearCart } from './features/cart/cartSlice'
import AdminDashboard from './pages/AdminDashboard'
import OrderDetailsPage from './pages/OrderDetailsPage'
import TrackOrder from './pages/TrackOrder'

export const stripePromise = loadStripe("pk_test_51RaaB2QpJYqNVrlfiZmHRPSkE1fLvrwQv9ZmRS2dxGB2Udsp6rxjPyWyYwVICMBWEZcqC2AaqmfvLtxx8GI8yd1T00WvxWAttL");

export default function App() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      alert("Payment successful!");
      dispatch(clearCart());
      setSearchParams({}); // clean up URL params
    }
    if (searchParams.get("cancelled") === "true") {
      alert("Payment cancelled.");
      setSearchParams({});
    }
  }, [searchParams, dispatch, setSearchParams]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/cart"
          element={
            <Elements stripe={stripePromise}>
              <CartPage />
            </Elements>
          }
        />
        <Route
          path="/checkout"
          element={
            <Elements stripe={stripePromise}>
              <CheckoutPage />
            </Elements>
          }
        />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancelled" element={<PaymentCancel />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailsPage />} />
        
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Layout>
  )
}
