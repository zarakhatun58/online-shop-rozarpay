import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CartPage from './pages/Cart'
import CheckoutPage from './pages/Checkout'
import Layout from './components/Layout'
import ProductDetails from './pages/ProductDetails'

export default function App(){
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </Layout>
  )
}
