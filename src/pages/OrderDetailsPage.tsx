// pages/OrderDetailsPage.tsx
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { fetchMyOrders, selectOrders, selectOrdersStatus } from "../features/orders/orderSlice";

const statusSteps = ["pending", "paid", "shipped", "delivered"];

const OrderDetailsPage= ()=> {
  const { id } = useParams(); 
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector(selectOrders);
  const status = useSelector(selectOrdersStatus);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) dispatch(fetchMyOrders(token));
  }, [dispatch]);

  if (status === "loading") return <p>Loading order...</p>;
  const order = orders.find((o) => o._id === id);
  if (!order) return <p>Order not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Order #{order._id}</h1>
      <p className="text-gray-700">Amount: ₹{order.amount}</p>
      <p className="text-gray-700">Address: {order.address}</p>

      {/* Progress Tracker */}
      <div className="flex justify-between mt-6">
        {statusSteps.map((step, idx) => {
          const completed = statusSteps.indexOf(order.status) >= idx;
          return (
            <div key={step} className="flex-1 text-center relative">
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                  completed ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600"
                }`}
              >
                {idx + 1}
              </div>
              <p className="mt-2 text-sm capitalize">{step}</p>
              {idx < statusSteps.length - 1 && (
                <div
                  className={`absolute top-4 left-1/2 w-full h-1 bg-gray-300 ${
                    completed ? "bg-green-600" : ""
                  }`}
                  style={{ transform: "translateX(50%)" }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Items */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Items:</h3>
        <ul className="space-y-1">
          {order.items.map((item:any) => (
            <li key={item.product._id} className="flex justify-between text-sm">
              <span>{item.product.name}</span>
              <span>Qty: {item.qty}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default OrderDetailsPage;