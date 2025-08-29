import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders, selectOrders, selectOrdersStatus } from "@/features/orders/orderSlice";
import { AppDispatch } from "@/store";
import axios from "axios";
import { API_URL } from "@/lib/api";

const statusSteps = ["pending", "paid", "shipped", "delivered"];

const OrdersPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector(selectOrders);
  const status = useSelector(selectOrdersStatus);

  // Fetch orders using your existing useEffect
  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) dispatch(fetchMyOrders(token));
  }, [dispatch]);

  if (status === "loading") return <p>Loading orders...</p>;
  if (!orders.length) return <p>No orders found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {orders.map((order) => {
        const currentStepIdx = statusSteps.indexOf(order.status);

        return (
          <div key={order._id} className="border rounded-lg p-4 shadow-sm">
            <h2 className="font-semibold">Order ID: {order._id}</h2>
            <p className="text-gray-600">Amount: ₹{order.amount}</p>
            <p className="text-gray-600">Shipping Address: {order.address}</p>

            {/* Progress Steps */}
            <div className="flex justify-between items-center mt-6 relative">
              {statusSteps.map((step, idx) => {
                const completed = idx <= currentStepIdx;

                return (
                  <div key={step} className="flex-1 flex flex-col items-center relative">
                    {/* Line to next step */}
                    {idx < statusSteps.length - 1 && (
                      <div
                        className="absolute top-4 left-1/2 h-1 z-0"
                        style={{
                          width: "100%",
                          backgroundColor: completed ? "#16a34a" : "#d1d5db",
                          transform: "translateX(50%)",
                        }}
                      />
                    )}

                    {/* Circle */}
                    <div
                      className={`z-10 w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        completed ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {idx + 1}
                    </div>

                    {/* Step Label */}
                    <span className="mt-2 text-sm capitalize">{step}</span>
                  </div>
                );
              })}
            </div>

            {/* Items */}
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Items:</h3>
              <ul className="space-y-1">
                {order.items.map((item) => (
                  <li key={item.product} className="flex justify-between text-sm">
                    <span>{item.product}</span>
                    <span>Qty: {item.qty}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrdersPage;


export async function getOrders(token: string) {
  const { data } = await axios.get(`${API_URL}/api/payments/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
