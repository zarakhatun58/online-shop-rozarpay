import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
    const navigate = useNavigate();

  useEffect(() => {
    alert('Payment was cancelled.');
    navigate('/checkout'); // go back to checkout
  }, [navigate]);
    return (
        <div>
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-red-600">🎉 Payment Cancel!</h1>
                <p className="mt-4">TYou canceled the payment. If this was a mistake, feel free to try again.</p>
             <Link  to="/checkout" className="mt-6 inline-block bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition">
                    ⬅️ Back to Home
                  </Link>
            </div>
        </div>
    );
};

export default PaymentCancel;