import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { clearCart } from "@/features/cart/cartSlice";
import { fetchMyOrders, selectOrders, selectOrdersStatus } from "@/features/orders/orderSlice";
import { RootState, AppDispatch } from "@/store";
import { useSocket } from "@/lib/SocketProvider";

export default function PaymentSuccess() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orders = useSelector(selectOrders);       // ✅ orders list
  const status = useSelector(selectOrdersStatus);
  const [orderId, setOrderId] = useState<string | null>(null);

useEffect(() => {
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    navigate("/");
    return;
  }
  setOrderId(sessionId);
  dispatch(clearCart());
  const token = window.localStorage.getItem("token");
  if (token) {
    dispatch(fetchMyOrders(token));
  }
}, [dispatch, searchParams, navigate]);


  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <h1 className="text-xl font-semibold">Fetching your order...</h1>
      </div>
    );
  }

  const currentOrder = orders.find(
    (o: any) => o.payment?.orderId === orderId
  );
console.log("session_id:", orderId);
console.log("orders:", orders);
console.log("matched order:", currentOrder);
  if (!currentOrder) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <h1 className="text-2xl font-bold text-green-600">
          ✅ Payment Successful!
        </h1>
        <p className="text-gray-600 mt-2">
          We could not match your order automatically.  
          <button
            onClick={() => navigate("/orders")}
            className="ml-2 underline text-blue-600"
          >
            View all orders
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-green-600 mb-4">
        ✅ Payment Successful!
      </h1>
      <p className="text-gray-700 mb-6">
        Thank you for your order. Here’s the status of your purchase:
      </p>

      {/* Tracking UI */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          Order #{currentOrder._id}
        </h2>

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
                    isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {idx + 1}
                </div>
                <span className="mt-2 text-sm">{step}</span>
                {idx < 3 && (
                  <div
                    className={`h-1 w-full ${
                      isCompleted ? "bg-green-500" : "bg-gray-300"
                    }`}
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
