import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './features/products/productSlice'
import cartReducer from './features/cart/cartSlice'
import authReducer from './features/auth/authSlice'
import ordersReducer from "./features/orders/orderSlice" 

export const store = configureStore({
  reducer: { products: productsReducer, cart: cartReducer, auth: authReducer,  orders: ordersReducer, }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
