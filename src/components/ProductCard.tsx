import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { addToCart } from '../features/cart/cartSlice'
import { Product } from '../lib/types'
import { Button } from './ui/Button'
import { useNavigate } from 'react-router-dom'

export default function ProductCard({ product }: { product: Product }) {
  const d = useDispatch()
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate()


  return (
    <div className="card flex flex-col border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden bg-[#ffffff]">
      <img src={
        product.image ||
        product.thumbnail ||
        product.images?.[0]
      }
        alt={product.name} className="h-full w-full object-cover" />
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-500">₹{product.price}</p>

        {showMore && (
          <div className="text-xs text-gray-600 space-y-1 mt-2">
            <p>{product.description}</p>
            {product.category && <p>Category: {product.category}</p>}
            {product.stock && <p>Stock: {product.stock}</p>}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-4">
          <button
            className="text-xs text-blue-600 underline"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            More
          </button>
          <Button onClick={() => d(addToCart(product))}>Add to Cart</Button>
        </div>
      </div>
    </div>
  )
}
