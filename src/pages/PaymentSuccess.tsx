import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { clearCart } from "@/features/cart/cartSlice";
import { fetchMyOrders, selectOrders, selectOrdersStatus } from "@/features/orders/orderSlice";
import { AppDispatch } from "@/store";
import { useSocket } from "@/lib/SocketProvider";
import { API_URL } from "@/lib/api";

export default function PaymentSuccess() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orders = useSelector(selectOrders);
  const status = useSelector(selectOrdersStatus);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const { connectSocket, socket } = useSocket();

useEffect(() => {
  const orderId = searchParams.get("order_id");
  const sessionId = searchParams.get("session_id");

  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = storedUser?._id;

  console.log("🔑 token:", token);
  console.log("👤 userId:", userId);
  console.log("📦 orderId:", orderId);
  console.log("💳 sessionId:", sessionId);

  if (!orderId || !sessionId || !token || !userId) {
    console.warn("⚠️ Missing userId/token/orderId/sessionId, exiting useEffect");
    return;
  }

  const updatePayment = async () => {
    try {
      const res = await fetch(`${API_URL}/api/payments/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId,
          paymentStatus: "paid",
        }),
      });

      const data = await res.json();
      console.log("✅ Payment status updated:", data);
    } catch (err) {
      console.error("❌ Failed to update payment:", err);
    }
  };

  updatePayment();
}, [searchParams]);




    const currentOrder = orders.find((o) => o._id === currentOrderId);

  // 1️⃣ Loading state
  if (status === "loading") {
    return <p className="text-center mt-8">Loading order...</p>;
  }

  // 2️⃣ Fallback when no order is found
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
        <button
          onClick={() => navigate(`/orders/${currentOrderId}`)}
          className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          📦 Track Orders
        </button>
      </div>
    );
  }

  // 3️⃣ Payment still pending (webhook didn’t update yet)
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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-green-600 mb-4">✅ Payment Successful!</h1>
      <p className="text-gray-700 mb-6">
        Thank you for your order. Here’s the status of your purchase:
      </p>

      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Order #{currentOrder._id}</h2>

        {/* Order Progress */}
        <div className="flex items-center justify-between">
          {["Pending", "Paid", "Shipped", "Delivered"].map((step, idx, arr) => {
            const steps = ["pending", "paid", "shipped", "delivered"];
            const currentIdx = steps.indexOf(currentOrder.status.toLowerCase());
            const isCompleted = idx <= currentIdx;

            return (
              <div key={step} className="flex-1 flex flex-col items-center relative">
                {/* Step Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold
                    ${isCompleted ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"}`}
                >
                  {idx + 1}
                </div>

                {/* Step Label */}
                <span className="mt-2 text-sm">{step}</span>

                {/* Connector Line */}
                {idx < arr.length - 1 && (
                  <div
                    className={`absolute top-5 left-1/2 w-full h-1 -translate-y-1/2
                      ${isCompleted ? "bg-green-500" : "bg-gray-300"}`}
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
  )
};
