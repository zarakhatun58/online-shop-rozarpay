import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CreditCard, CheckCircle, Truck, PackageCheck } from "lucide-react"

type OrderTrackerProps = {
  status: string
  steps?: { key: string; label: string; icon: React.ReactNode }[]
}

export default function OrderTracker({
  status,
  steps = [
    { key: "pending", label: "Pending", icon: <CreditCard className="w-5 h-5" /> },
    { key: "paid", label: "Paid", icon: <CheckCircle className="w-5 h-5" /> },
    { key: "shipped", label: "Shipped", icon: <Truck className="w-5 h-5" /> },
    { key: "delivered", label: "Delivered", icon: <PackageCheck className="w-5 h-5" /> },
  ],
}: OrderTrackerProps) {
  const targetStepIdx = steps.findIndex((s) => s.key === status.toLowerCase())
  const [animatedStepIdx, setAnimatedStepIdx] = useState(0)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (targetStepIdx === -1) return
    if (animatedStepIdx >= targetStepIdx) return

    setCountdown(5)

    // countdown tick
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 5))
    }, 1000)

    // step progression after 5s
    const stepTimer = setTimeout(() => {
      setAnimatedStepIdx((prev) => prev + 1)
      clearInterval(countdownTimer)
    }, 5000)

    return () => {
      clearTimeout(stepTimer)
      clearInterval(countdownTimer)
    }
  }, [animatedStepIdx, targetStepIdx])

  return (
    <div className="w-full">
      {/* Tracker */}
      <div className="relative flex justify-between items-center">
        {steps.map((step, idx) => {
          const isCompleted = idx <= animatedStepIdx

          return (
            <div key={step.key} className="flex-1 flex flex-col items-center relative">
              {/* Connector Line */}
              {idx < steps.length - 1 && (
                <motion.div
                  key={animatedStepIdx === idx ? `progress-${idx}` : `done-${idx}`}
                  initial={{ width: "0%" }}
                  animate={{
                    width:
                      idx < animatedStepIdx
                        ? "100%" 
                        : idx === animatedStepIdx
                        ? "100%" 
                        : "0%", 
                  }}
                  transition={{
                    duration: idx === animatedStepIdx ? 5 : 0.8,
                    ease: "linear",
                  }}
                  className="absolute top-5 left-1/2 h-1 -translate-x-1/2 bg-green-500"
                  style={{ zIndex: -1 }}
                />
              )}

              {/* Step Circle */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: isCompleted ? 1.2 : 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={`z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-md ${
                  isCompleted ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
                }`}
              >
                {step.icon}
              </motion.div>

              {/* Step Label */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.2 }}
                className="mt-2 text-sm capitalize text-center"
              >
                {step.label}
              </motion.span>
            </div>
          )
        })}
      </div>

      {/* Countdown + Progress Bar */}
      {animatedStepIdx < targetStepIdx && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">
            ⏳ Next step in{" "}
            <span className="font-bold text-blue-600">{countdown}</span> seconds...
          </p>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              key={animatedStepIdx} // restart animation every step
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="h-2 bg-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  )
}
