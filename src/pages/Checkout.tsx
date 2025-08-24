import { useSelector } from 'react-redux'
import { selectCart, selectCartTotal } from '../features/cart/cartSlice'
import { Button } from '../components/ui/Button';
import { selectAuth } from '@/features/auth/authSlice';
import { loadRazorpay } from '@/lib/razorpay';
import { createRazorpayOrder, verifyRazorpaySignature } from '@/lib/api';
import { RazorpayOptions } from './../lib/razorpay.d';

export default function CheckoutPage() {
  const items = useSelector(selectCart)
  const total = useSelector(selectCartTotal)
  const { token, user } = useSelector(selectAuth);

const handleCheckout = async () => {
  if (!token) {
    alert("You must be logged in to checkout.");
    return; // stop execution if token is null
  }

  const ok = await loadRazorpay();
  if (!ok) {
    alert("Failed to load Razorpay SDK");
    return;
  }

  const { order, key } = await createRazorpayOrder(token, { amount: total * 100 });

  const options: RazorpayOptions = {
    key,
    amount: order.amount,
    currency: order.currency,
    name: "Cosmetic Shop",
    description: `Order ${order.receipt}`,
    order_id: order.id,
    handler: async (response) => {
      await verifyRazorpaySignature(token, response);
      alert("Payment successful! 🎉");
    },
    theme: { color: "#f43f5e" },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};



  return (
    <section className="space-y-6 max-w-3xl m-auto">
      <h1 className="text-2xl font-bold text-[#ed3b5f]">Checkout</h1>
      <div className="card p-4 bg-[#ffffff]">
        <h2 className="font-semibold mb-3">Order Summary</h2>
        {items.length === 0 ? <p className="text-gray-600">No items in cart.</p> : (
          <ul className="space-y-2">
            {items.map(it => (
              <li key={it._id} className="flex justify-between text-sm">
                <span>{it.name} × {it.qty}</span>
                <span>₹{it.price * it.qty}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-between border-t mt-3 mb-4 pt-3 font-semibold">
          <span>Total</span><span>₹{total}</span>
        </div>
        <Button onClick={handleCheckout}>Pay Now</Button>
      </div>
    </section>
  )
}
