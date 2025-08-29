import React from "react";
import { useNavigate } from "react-router-dom";

interface OrderItem {
    _id: string;
    name: string;
    qty: number;
    price: number;
    image?: string;
}

interface OrderEvent {
    date: string;
    status: string;
    description?: string;
}

interface Order {
    _id: string;
    items: OrderItem[];
    total: number;
    originalPrice: number;
    savings: number;
    storePickup: number;
    tax: number;
    history: OrderEvent[];
}

interface TrackOrderProps {
    order: Order;
}

const TrackOrder: React.FC<TrackOrderProps> = ({ order }) => {
    const navigate = useNavigate();
    const steps = ["Pending", "Paid", "Shipped", "Delivered"];
    const lastStatus = order.history[order.history.length - 1]?.status;
    const currentStepIndex = steps.findIndex((step) => step === lastStatus);

    return (
        <div className="max-w-6xl mx-auto p-6 flex flex-col lg:flex-row gap-6">
            {/* Left: Order Details */}
            <div className="flex-1 bg-white shadow rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Track the delivery of order #{order._id}</h2>

                <div className="space-y-4">
                    {order.items.map((item) => (
                        <div key={item._id} className="flex justify-between items-center border-b pb-2">
                            <div className="flex items-center gap-4">
                                {item.image && (
                                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                                )}
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-500">Product ID: {item._id}</p>
                                    <p className="text-sm text-gray-500">x{item.qty}</p>
                                </div>
                            </div>
                            <p className="font-semibold">${(item.price * item.qty).toLocaleString()}</p>
                        </div>
                    ))}
                </div>

                {/* Pricing summary */}
                <div className="mt-6 space-y-1">
                    <div className="flex justify-between text-gray-600">
                        <span>Original price</span>
                        <span>${order.originalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                        <span>Savings</span>
                        <span>-${order.savings.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Store Pickup</span>
                        <span>${order.storePickup.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Tax</span>
                        <span>${order.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-2">
                        <span>Total</span>
                        <span>${order.total.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    {steps.map((step, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center">
                            <div
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${idx <= currentStepIndex ? "bg-blue-600 border-blue-600" : "bg-white border-gray-300"
                                    }`}
                            >
                                {idx <= currentStepIndex && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                            <span className="mt-2 text-xs text-center">{step}</span>
                            {idx < steps.length - 1 && (
                                <div
                                    className={`flex-1 h-1 ${idx < currentStepIndex ? "bg-blue-600" : "bg-gray-300"
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Order History */}
            <div className="w-full lg:w-96 bg-white shadow rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Order history</h3>
                <ul className="space-y-4">
                    {order.history.map((event, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-3 h-3 rounded-full mt-1 ${idx === order.history.length - 1 ? "bg-blue-600" : "bg-gray-300"
                                        }`}
                                />
                                {idx < order.history.length - 1 && <div className="w-px h-full bg-gray-300 mt-1" />}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-500">{event.date}</p>
                                <p className="text-gray-700">{event.status}</p>
                                {event.description && (
                                    <p className="text-sm text-blue-600 underline">{event.description}</p>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="mt-6 flex flex-col gap-3">
                    <button
                        onClick={() => navigate("/orders")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Order details
                    </button>
                    <button
                        onClick={() => navigate("/orders")}
                        className="px-4 py-2 text-gray-700 underline"
                    >
                        Cancel the order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;
