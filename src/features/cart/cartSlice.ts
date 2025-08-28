import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../../store"
import type { Product } from "../../lib/types"

export type CartItem = Product & { qty: number }

type CartState = { items: CartItem[] }

// 🔹 Load cart from localStorage on init
const loadCart = (): CartItem[] => {
  try {
    const data = localStorage.getItem("cart")
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

const initialState: CartState = { items: loadCart() }

const findIndex = (items: CartItem[], id: string) =>
  items.findIndex((i) => i._id === id)

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const i = findIndex(state.items, action.payload._id)
      if (i > -1) {
        state.items[i].qty += 1
      } else {
        state.items.push({ ...action.payload, qty: 1 })
      }
      localStorage.setItem("cart", JSON.stringify(state.items)) 
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const i = findIndex(state.items, action.payload)
      if (i > -1) {
        if (state.items[i].qty > 1) {
          state.items[i].qty -= 1
        } else {
          state.items.splice(i, 1)
        }
      }
      localStorage.setItem("cart", JSON.stringify(state.items))
    },
    setQty: (state, action: PayloadAction<{ id: string; qty: number }>) => {
      const i = findIndex(state.items, action.payload.id)
      if (i > -1) {
        state.items[i].qty = Math.max(1, action.payload.qty)
      }
      localStorage.setItem("cart", JSON.stringify(state.items))
    },
    clearCart: (state) => {
      state.items = []
      localStorage.removeItem("cart")
    },
     setCart: (state, action: PayloadAction<CartItem[]>) => {
    state.items = action.payload
    localStorage.setItem("cart", JSON.stringify(state.items))
  },
  },
})

// Actions
export const { addToCart, removeFromCart, setQty, clearCart } =
  cartSlice.actions

// Selectors
export const selectCart = (state: RootState) => state.cart.items
export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.qty, 0)

export default cartSlice.reducer
