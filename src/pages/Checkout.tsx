import { useDispatch, useSelector } from 'react-redux'
import { clearCart, selectCart, selectCartTotal } from '../features/cart/cartSlice'
import { Button } from '../components/ui/Button';
import { selectAuth } from '@/features/auth/authSlice';
import {  CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from 'react';
import { createStripeOrder, updateOrderPaymentStatus } from '@/lib/api';

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

  setLoading(true);

  try {
    const { order, clientSecret } = await createStripeOrder(token, {
      items,
      amount: total,
      address: user?.address ?? "Not provided",
    });

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      alert("Card element not found");
      setLoading(false);
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (result.error) {
      alert(result.error.message);
    } else if (result.paymentIntent?.status === "succeeded") {

      await updateOrderPaymentStatus(token, {
        orderId: order.payment.orderId,
        paymentId: result.paymentIntent.id,
        status: "paid",
      });
      alert("Payment successful! 🎉");
     dispatch(clearCart());
    }
  } catch (err: unknown) {
    if (err instanceof Error) alert(err.message);
    else alert("Payment failed");
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
