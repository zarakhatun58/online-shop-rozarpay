import { useDispatch, useSelector } from "react-redux"
import { selectCart, selectCartTotal, removeFromCart, setQty, clearCart } from "../features/cart/cartSlice"
import { Button } from "./ui/Button"

export default function CartDrawer() {
  const dispatch = useDispatch()
  const items = useSelector(selectCart)
  const total = useSelector(selectCartTotal)

  if (!items.length) return <p>Your cart is empty</p>

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item._id} className="flex items-center border-b pb-4">
          <img
            src={item.image || item.thumbnail || item.images?.[0]}
            alt={item.name}
            className="w-20 h-20 object-cover rounded"
          />
          <div className="ml-4 flex-1">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-500">₹{item.price}</p>

            {/* Quantity controls */}
            <div className="flex items-center mt-2">
              <button
                onClick={() =>
                  dispatch(setQty({ id: item._id, qty: item.qty - 1 }))
                }
                className="px-2 border rounded"
              >
                -
              </button>
              <span className="px-3">{item.qty}</span>
              <button
                onClick={() =>
                  dispatch(setQty({ id: item._id, qty: item.qty + 1 }))
                }
                className="px-2 border rounded"
              >
                +
              </button>
              <button
                onClick={() => dispatch(removeFromCart(item._id))}
                className="ml-4 text-red-500 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Cart total */}
      <div className="flex justify-between items-center font-bold text-lg">
        <span>Total:</span>
        <span>₹{total.toFixed(2)}</span>
      </div>

      <div className="flex justify-between">
        <Button onClick={() => dispatch(clearCart())} variant="outline">
          Clear Cart
        </Button>
        <Button>Proceed to Checkout</Button>
      </div>
    </div>
  )
}
