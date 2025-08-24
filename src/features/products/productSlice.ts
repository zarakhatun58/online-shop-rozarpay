import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { RootState } from "../../store"
import { getProducts } from "../../lib/api"
import type { Product } from "../../lib/types"

export const fetchProducts = createAsyncThunk<Product[], string | undefined>(
  "products/fetch",
  async (query) => await getProducts(query)
)

type ProductsState = {
  items: Product[]
  status: "idle" | "loading" | "succeeded" | "failed"
}

const initialState: ProductsState = { items: [], status: "idle" }

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload
        state.status = "succeeded"
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.status = "failed"
      })
  },
})

export const selectProducts = (state: RootState) => state.products.items
export const selectProductsStatus = (state: RootState) => state.products.status

export default productSlice.reducer
