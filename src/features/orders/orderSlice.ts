import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { RootState } from "../../store"
import { createOrder, getMyOrders, getOrderById } from "../../lib/api"
import type { CartItem } from "../cart/cartSlice"
import { clearCart } from "../cart/cartSlice" 

export type Order = {
  _id: string
  items: { product: string; qty: number }[]
  amount: number
  address: string
  status: "pending" | "paid" | "shipped" | "delivered"
  createdAt: string
}

export type OrdersState = {
  list: Order[]
  status: "idle" | "loading" | "succeeded" | "failed"
}

const initialState: OrdersState = { list: [], status: "idle" }

// ✅ Thunk: place order
export const placeOrder = createAsyncThunk<
  Order,
  { token: string; cart: CartItem[]; total: number; address: string }
>("orders/placeOrder", async ({ token, cart, total, address }, { dispatch }) => {
  const payload = {
    items: cart.map((c) => ({ product: c._id, qty: c.qty })),
    amount: total,
    address,
  }
  const order = await createOrder(token, payload)

  dispatch(clearCart())
  localStorage.removeItem("cart")

  return order
})

// ✅ Thunk: fetch my orders
export const fetchMyOrders = createAsyncThunk<Order[], string>(
  "orders/fetchMyOrders",
  async (token) => {
    return await getMyOrders(token)
  }
)

// ✅ Thunk: fetch single order (checkOrderStatus)
export const fetchOrderById = createAsyncThunk<
  Order,
  { token: string; orderId: string }
>("orders/fetchOrderById", async ({ token, orderId }) => {
  return await getOrderById(token, orderId)
})

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    upsertOrder: (state, action: { payload: Order }) => {
      const idx = state.list.findIndex((o) => o._id === action.payload._id)
      if (idx >= 0) {
        state.list[idx] = action.payload
      } else {
        state.list.push(action.payload)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // placeOrder
      .addCase(placeOrder.pending, (s) => {
        s.status = "loading"
      })
      .addCase(placeOrder.fulfilled, (s, a) => {
        s.list.push(a.payload)
        s.status = "succeeded"
      })
      .addCase(placeOrder.rejected, (s) => {
        s.status = "failed"
      })

      // fetchMyOrders
      .addCase(fetchMyOrders.pending, (s) => {
        s.status = "loading"
      })
      .addCase(fetchMyOrders.fulfilled, (s, a) => {
        s.list = a.payload
        s.status = "succeeded"
      })
      .addCase(fetchMyOrders.rejected, (s) => {
        s.status = "failed"
      })

      // ✅ fetchOrderById
      .addCase(fetchOrderById.pending, (s) => {
        s.status = "loading"
      })
      .addCase(fetchOrderById.fulfilled, (s, a) => {
        const idx = s.list.findIndex((o) => o._id === a.payload._id)
        if (idx >= 0) {
          s.list[idx] = a.payload
        } else {
          s.list.push(a.payload)
        }
        s.status = "succeeded"
      })
      .addCase(fetchOrderById.rejected, (s) => {
        s.status = "failed"
      })
  },
})

export const selectOrders = (state: RootState): Order[] => state.orders.list
export const selectOrdersStatus = (state: RootState): OrdersState["status"] =>
  state.orders.status

export default orderSlice.reducer
export const { upsertOrder } = orderSlice.actions
