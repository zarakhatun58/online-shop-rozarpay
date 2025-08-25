import { selectAuth } from '@/features/auth/authSlice';
import { clearCart } from '@/features/cart/cartSlice';
import { updateOrderPaymentStatus } from '@/lib/api';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
 const navigate = useNavigate();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const { token } = useSelector(selectAuth);

     useEffect(() => {
    const params = new URLSearchParams(search);
    const session_id = params.get('session_id');

    if (session_id && token) {
      updateOrderPaymentStatus(token, {
        orderId: session_id,
        paymentId: session_id, 
        status: 'paid',
      }).then(() => {
        dispatch(clearCart()); // clear cart
        toast.success('Payment successful! 🎉');
        navigate('/orders'); // redirect to orders page
      });
    }
  }, [search, token, dispatch, navigate]);

    return (
        <div className="p-8 text-center">
            <h1 className="text-2xl font-bold text-green-600">🎉 Payment Successful!</h1>
            <p className="mt-4">Thank you for your payment. We’ll follow up with you shortly.</p>
            <Link  to="/orders" className="mt-6 inline-block bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition">
                ⬅️ Track order
            </Link>
        </div>
    );
};

export default PaymentSuccess;