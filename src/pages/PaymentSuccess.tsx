import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { clearCart } from "../features/cart/cartSlice";
import { upsertOrder, selectOrders, selectOrdersStatus, Order } from "../features/orders/orderSlice";
import { AppDispatch } from "../store";
import { API_URL } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { useSocket } from '@/lib/SocketProvider';


export default function PaymentSuccess() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orders = useSelector(selectOrders);
  const status = useSelector(selectOrdersStatus);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
 const { connectSocket, socket } = useSocket();
  const steps = ["pending", "paid", "shipped", "delivered"];

useEffect(() => {
  const orderId = searchParams.get("order_id");
  const sessionId = searchParams.get("session_id");
  const token = localStorage.getItem("token");

  if (!orderId || !sessionId || !token || !socket) return;

  // 1️⃣ Fetch initial order from backend
  const fetchOrder = async () => {
    try {
      const res = await fetch(`${API_URL}/api/payments/order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const orderData = await res.json();

      // Update Redux store and local state
      dispatch(upsertOrder(orderData));
      setCurrentOrder(orderData);

      // ❌ No need to manually send notification here!
      // Backend already creates a notification and emits via Socket.io
    } catch (err) {
      console.error("🔥 Fetch initial order failed:", err);
    }
  };
  fetchOrder();

  // 2️⃣ Listen for real-time updates from backend
  const handleOrderUpdate = (updatedOrder: any) => {
    if (updatedOrder.orderId === orderId) {
      setCurrentOrder(updatedOrder);
      dispatch(upsertOrder(updatedOrder));

      // Payment completed → clear cart automatically
      if (updatedOrder.status.toLowerCase() === "paid") {
        dispatch(clearCart());
        localStorage.removeItem("cart");
      }

      // ✅ Notifications are handled automatically via SocketProvider
      // Frontend receives `notification` events from backend
      // and dispatches them to Redux store
    }
  };

  socket.on("orderUpdate", handleOrderUpdate);

  return () => {
    socket.off("orderUpdate", handleOrderUpdate);
  };
}, [searchParams, dispatch, socket]);




 if ( status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <p className="text-lg font-medium">Verifying your payment...</p>
        <div className="mt-4 w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center">
        <h1 className="text-2xl font-bold text-green-600">✅ Payment Successful!</h1>
        <p className="text-gray-600 mt-2">We could not match your order automatically.</p>
        <button
          onClick={() => navigate("/orders")}
          className="mt-3 underline text-blue-600"
        >
          📦 View all orders
        </button>
      </div>
    );
  }

  if (currentOrder.status.toLowerCase() === "pending") {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center">
        <h1 className="text-2xl font-bold text-yellow-600">⏳ Payment Processing...</h1>
        <p className="text-gray-600 mt-2">
          We are confirming your payment. This may take a few seconds.
        </p>
        <p className="text-gray-500 mt-1 text-sm">Please don’t close this page.</p>
      </div>
    );
  }

  const currentStepIdx = steps.indexOf(currentOrder.status.toLowerCase());

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="p-6 text-center shadow-lg rounded-2xl">
        <h1 className="text-2xl font-bold text-green-600 mb-4">🎉 Payment Successful!</h1>
        <p className="text-gray-700 mb-6">
          Order <span className="font-semibold">#{currentOrder._id}</span> has been paid.
        </p>

        {/* Timeline Progress */}
        <div className="relative flex justify-between items-center mb-6">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIdx;
            return (
              <div key={step} className="flex-1 flex flex-col items-center relative">
                {idx < steps.length - 1 && (
                  <div
                    className={`absolute top-5 left-1/2 w-full h-1 -translate-x-1/2 ${
                      idx < currentStepIdx ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                )}
                <div
                  className={`z-10 w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {idx + 1}
                </div>
                <span className="mt-2 text-sm capitalize">{step}</span>
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => navigate("/orders")}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            📦 View All Orders
          </button>
          <Link
            to={`/track/${currentOrder._id}`}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            🚚 Track This Order
          </Link>
        </div>
      </Card>
    </div>
  );
}