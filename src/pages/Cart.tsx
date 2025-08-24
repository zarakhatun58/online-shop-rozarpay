
import { useSelector } from "react-redux"
import CartDrawer from "../components/CartDrawer"
import { selectCart, selectCartTotal } from "@/features/cart/cartSlice"

export default function CartPage() {
      const items = useSelector(selectCart)
  const total = useSelector(selectCartTotal)
  return (
    <section className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-3xl font-bold border-b pb-4">Your Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-4">
          <CartDrawer />
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 h-fit">
          <h2 className="text-xl font-semibold mb-4">Price Details</h2>
            <div className="space-y-2 text-gray-700">
            <p className="flex justify-between">
              <span>Total Items</span>
              <span>{items.length}</span>
            </p>
            <p className="flex justify-between font-semibold text-lg">
              <span>Total Price</span>
              <span>₹{total.toFixed(2)}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
