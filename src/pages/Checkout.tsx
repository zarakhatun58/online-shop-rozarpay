import { useDispatch, useSelector } from 'react-redux'
import { clearCart, selectCart, selectCartTotal } from '../features/cart/cartSlice'
import { Button } from '../components/ui/Button';
import { selectAuth } from '@/features/auth/authSlice';
import {  CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from 'react';
import { createStripeCheckoutSession, createStripeOrder, updateOrderPaymentStatus } from '@/lib/api';
import { stripePromise } from '@/App';

export default function CheckoutPage() {
 const items = useSelector(selectCart);
  const total = useSelector(selectCartTotal);
  const { token, user } = useSelector(selectAuth);
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

const handleCheckout = async () => {
    if (!token) {
      alert("Please login to checkout");
      return;
    }

    if (!items.length) {
      alert("Your cart is empty!");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Create Stripe Checkout session
      const { sessionId } = await createStripeCheckoutSession(token, {
        items,
        amount: Math.round(total * 100), 
        address: user?.address ?? "Not provided",
         email: user?.email ?? "no-email@example.com",
      });

      // 2️⃣ Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        alert("Stripe failed to load");
        setLoading(false);
        return;
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        alert(error.message);
      }
    } catch (err: any) {
      alert(err.response?.data?.error || err.message || "Checkout failed");
    }

    setLoading(false);
  };


  return (
    <section className="space-y-6 max-w-3xl m-auto">
      <h1 className="text-2xl font-bold text-[#ed3b5f]">Checkout</h1>
      <div className="card p-4 bg-[#ffffff]">
        <h2 className="font-semibold mb-3">Order Summary</h2>
        {items.length === 0 ? <p className="text-gray-600">No items in cart.</p> : (
          <ul className="space-y-2">
            {items.map((it:any) => (
              <li key={it._id} className="flex justify-between text-sm">
                <span>{it.name} × {it.qty}</span>
                <span>₹{it.price * it.qty}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-between border-t mt-3 mb-4 pt-3 font-semibold">
          <span>Total</span><span>₹{total.toFixed(2)}</span>
        </div>
         <Button onClick={handleCheckout} disabled={loading}>
          {loading ? "Processing..." : "Pay Now"}
        </Button>
      </div>
    </section>
  )
}
