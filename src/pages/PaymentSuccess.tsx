import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { clearCart } from "@/features/cart/cartSlice";
import { fetchMyOrders, selectOrders, selectOrdersStatus } from "@/features/orders/orderSlice";
import {  AppDispatch } from "@/store";
import { useSocket } from "@/lib/SocketProvider";
import { API_URL } from "@/lib/api";

export default function PaymentSuccess() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orders = useSelector(selectOrders);
  const status = useSelector(selectOrdersStatus);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
const { connectSocket , socket} = useSocket();

useEffect(() => {
    const orderId = searchParams.get("order_id");
    const sessionId = searchParams.get("session_id");
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = storedUser?._id || storedUser?.id;

    if (!orderId || !sessionId || !token) {
      navigate("/");
      return;
    }
    setCurrentOrderId(orderId);
    dispatch(clearCart());
    localStorage.removeItem("cart");
    if (userId) {
      connectSocket(userId);

      socket?.emit("notification", {
        userId,
        title: "Payment Successful 💳",
        message: `Your payment for order ${orderId} has been completed!`,
        type: "success",
      });

      fetch(`${API_URL}/api/notification/notify-now`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          title: "Payment Successful 💳",
          message: `Your payment for order ${orderId} has been completed!`,
          type: "success",
        }),
      }).catch((err) => console.error("Notification failed:", err));
    }
    fetch(`${API_URL}/api/payments/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orderId, sessionId }),
    })
      .then((res) => res.json())
      .then(() => dispatch(fetchMyOrders(token)))
      .catch((err) => console.error("Update payment failed:", err));
  }, [dispatch, navigate, searchParams, connectSocket, socket]);

const currentOrder = orders.find((o) => o._id === currentOrderId);

  if (!currentOrder) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center">
        <h1 className="text-2xl font-bold text-green-600">✅ Payment Successful!</h1>
        <p className="text-gray-600 mt-2">We could not match your order automatically.</p>
        <button onClick={() => navigate("/orders")} className="mt-3 underline text-blue-600">
          📦 View all orders
        </button>
      </div>
    );
  }
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-green-600 mb-4">✅ Payment Successful!</h1>
      <p className="text-gray-700 mb-6">Thank you for your order. Here’s the status of your purchase:</p>

      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Order #{currentOrder._id}</h2>

        {/* Order Progress */}
        <div className="flex items-center justify-between">
          {["Pending", "Paid", "Shipped", "Delivered"].map((step, idx) => {
            const currentIdx = ["pending", "paid", "shipped", "delivered"].indexOf(
              currentOrder.status.toLowerCase()
            );
            const isCompleted = idx <= currentIdx;

            return (
              <div key={step} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {idx + 1}
                </div>
                <span className="mt-2 text-sm">{step}</span>
                {idx < 3 && (
                  <div
                    className={`h-1 w-full ${isCompleted ? "bg-green-500" : "bg-gray-300"}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => navigate("/orders")}
        className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        📦 View All Orders
      </button>
    </div>
  );
}