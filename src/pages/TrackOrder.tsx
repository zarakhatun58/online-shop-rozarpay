import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import type { AppDispatch } from "@/store"
import {
  fetchOrderById,
  selectOrders,
  selectOrdersStatus,
} from "@/features/orders/orderSlice"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "../components/ui/Button"
import OrderTracker from "../pages/OrderTracker" 

export default function TrackOrder() {
  const { orderId } = useParams<{ orderId: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const orders = useSelector(selectOrders)
  const status = useSelector(selectOrdersStatus)

  const token = localStorage.getItem("token")
  const order = orders.find((o) => o._id === orderId)

  useEffect(() => {
    if (token && orderId) {
      dispatch(fetchOrderById({ token, orderId }))
      let interval: ReturnType<typeof setTimeout>
      if (!order || order.status !== "delivered") {
        interval = setInterval(() => {
          dispatch(fetchOrderById({ token, orderId }))
        }, 5000) 
      }

      return () => {
        if (interval) clearInterval(interval)
      }
    }
  }, [dispatch, token, orderId, order?.status])

  if (status === "loading" && !order) {
    return <p className="text-center py-10">Loading order details...</p>
  }

  if (!order) {
    return <p className="text-center py-10 text-red-500">Order not found</p>
  }

  const createdDate = new Date(order.createdAt)
  let expectedDelivery: string

  if (order.status === "delivered") {
    expectedDelivery = `Delivered on ${new Date(
      order.createdAt
    ).toLocaleDateString()}`
  } else if (order.status === "shipped") {
    const deliveryDate = new Date(createdDate)
    deliveryDate.setDate(createdDate.getDate() + 2)
    expectedDelivery = `Arriving by ${deliveryDate.toLocaleDateString()}`
  } else {
    const deliveryDate = new Date(createdDate)
    deliveryDate.setDate(createdDate.getDate() + 5)
    expectedDelivery = `Expected by ${deliveryDate.toLocaleDateString()}`
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-4 rounded-2xl shadow-md">
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <ul className="space-y-3">
            {order.items.map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center border-b pb-2"
              >
                <span>{item.product}</span>
                <span>Qty: {item.qty}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>₹{order.amount}</span>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Shipping Address: {order.address}
          </div>
        </CardContent>
      </Card>
      <Card className="p-4 rounded-2xl shadow-md">
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Track Order</h2>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (token && orderId) {
                  dispatch(fetchOrderById({ token, orderId }))
                }
              }}
            >
              Refresh Now
            </Button>
          </div>
          <OrderTracker status={order.status} />

          <div className="mt-4">
            <Badge className="capitalize">{order.status}</Badge>
          </div>

          <div className="mt-2">
            {order.status === "delivered" ? (
              <Badge className="bg-green-500 text-white">
                Delivered on {new Date(order.createdAt).toLocaleDateString()}
              </Badge>
            ) : (
              <span className="text-sm font-medium text-blue-600">
                {expectedDelivery}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
