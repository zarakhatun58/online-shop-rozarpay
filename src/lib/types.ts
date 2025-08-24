export type Product = {
  _id: string
  name: string
  description: string
  price: number
  image?: string
  category?: string
  stock?: number
  [key: string]: any
}
