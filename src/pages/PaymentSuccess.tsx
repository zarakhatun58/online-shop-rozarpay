import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { clearCart } from "../features/cart/cartSlice";
import { upsertOrder, selectOrders, selectOrdersStatus, Order } from "../features/orders/orderSlice";
import { AppDispatch } from "../store";
import { API_URL } from "@/lib/api";


export default function PaymentSuccess() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orders = useSelector(selectOrders);
  const status = useSelector(selectOrdersStatus);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const steps = ["pending", "paid", "shipped", "delivered"];

  useEffect(() => {
    const orderId = searchParams.get("order_id");
    const sessionId = searchParams.get("session_id");
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = storedUser?._id;

    if (!orderId || !sessionId || !token || !userId) return;

    let pollingInterval: number;

    const pollOrderStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/api/payments/order/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;

        const orderData: Order = await res.json();

        // Save order in Redux & local state
        dispatch(upsertOrder(orderData));
        setCurrentOrder(orderData);

        // Clear cart if paid
        if (orderData.status.toLowerCase() === "paid") {
          dispatch(clearCart());
          localStorage.removeItem("cart");

          // Optional: send frontend notification
          await fetch(`${API_URL}/api/notification/notify-now`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              userId,
              title: "Payment Successful 💳",
              message: `Your payment for order ${orderId} has been received!`,
              type: "success",
            }),
          });

          clearInterval(pollingInterval);
        }
      } catch (err) {
        console.error("Polling failed:", err);
      }
    };

    pollOrderStatus(); // initial call
    pollingInterval = window.setInterval(pollOrderStatus, 2000);

    return () => window.clearInterval(pollingInterval);
  }, [searchParams, dispatch]);

  if (status === "loading") return <p className="text-center mt-8">Loading order...</p>;

  if (!currentOrder)
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center">
        <h1 className="text-2xl font-bold text-green-600">✅ Payment Successful!</h1>
        <p className="text-gray-600 mt-2">We could not match your order automatically.</p>
        <button onClick={() => navigate("/orders")} className="mt-3 underline text-blue-600">
          📦 View all orders
        </button>
      </div>
    );

  if (currentOrder.status.toLowerCase() === "pending")
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center">
        <h1 className="text-2xl font-bold text-yellow-600">⏳ Payment Processing...</h1>
        <p className="text-gray-600 mt-2">
          We are confirming your payment. This may take a few seconds.
        </p>
        <p className="text-gray-500 mt-1 text-sm">Please don’t close this page.</p>
      </div>
    );

  const currentStepIdx = steps.indexOf(currentOrder.status.toLowerCase());

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-green-600 mb-4">✅ Payment Successful!</h1>
      <p className="text-gray-700 mb-6">Thank you for your order. Here’s the status of your purchase:</p>

      {/* Order ID */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Order #{currentOrder._id}</h2>

        {/* Timeline Progress Bar */}
        <div className="relative flex justify-between items-center">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIdx;
            return (
              <div key={step} className="flex-1 flex flex-col items-center relative">
                {/* Connector Line */}
                {idx < steps.length - 1 && (
                  <div
                    className={`absolute top-5 left-1/2 w-full h-1 -translate-x-1/2
                      ${idx < currentStepIdx ? "bg-green-500" : "bg-gray-300"}`}
                  />
                )}

                {/* Step Circle */}
                <div
                  className={`z-10 w-10 h-10 rounded-full flex items-center justify-center font-semibold
                    ${isCompleted ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"}`}
                >
                  {idx + 1}
                </div>

                {/* Step Label */}
                <span className="mt-2 text-sm capitalize text-center">{step}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => navigate("/orders")}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          📦 View All Orders
        </button>
        <button
          onClick={() => navigate(`/orders/${currentOrder._id}`)}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          📦 Track Order
        </button>
      </div>
    </div>
  );
}
