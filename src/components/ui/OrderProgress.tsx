import { CheckCircle, Clock, Truck, Package } from "lucide-react";

type Step = {
  key: "pending" | "paid" | "shipped" | "delivered";
  label: string;
  icon: React.ReactNode;
};

const steps: Step[] = [
  { key: "pending", label: "Order Placed", icon: <Clock className="w-6 h-6" /> },
  { key: "paid", label: "Payment Done", icon: <CheckCircle className="w-6 h-6" /> },
  { key: "shipped", label: "Shipped", icon: <Truck className="w-6 h-6" /> },
  { key: "delivered", label: "Delivered", icon: <Package className="w-6 h-6" /> },
];

export default function OrderProgress({ status }: { status: Step["key"] }) {
  const activeIndex = steps.findIndex((s) => s.key === status);

  return (
    <div className="flex items-center justify-between w-full max-w-3xl mx-auto">
      {steps.map((step, idx) => {
        const isActive = idx <= activeIndex;

        return (
          <div key={step.key} className="flex flex-col items-center flex-1 relative">
            {/* Connector line */}
            {idx !== 0 && (
              <div
                className={`absolute top-3 -left-1/2 w-full h-1 ${
                  idx <= activeIndex ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            )}

            {/* Icon */}
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full z-10 ${
                isActive ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
              }`}
            >
              {step.icon}
            </div>

            {/* Label */}
            <span
              className={`mt-2 text-sm font-medium ${
                isActive ? "text-green-600" : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
