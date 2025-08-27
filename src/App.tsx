import { Routes, Route } from 'react-router-dom'
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

export const stripePromise = loadStripe("pk_test_51RaaB2QpJYqNVrlfiZmHRPSkE1fLvrwQv9ZmRS2dxGB2Udsp6rxjPyWyYwVICMBWEZcqC2AaqmfvLtxx8GI8yd1T00WvxWAttL");

export default function App() {

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
      </Routes>
    </Layout>
  )
}
