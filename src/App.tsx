import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CartPage from './pages/Cart'
import CheckoutPage from './pages/Checkout'
import Layout from './components/Layout'
import ProductDetails from './pages/ProductDetails'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

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
      </Routes>
    </Layout>
  )
}
