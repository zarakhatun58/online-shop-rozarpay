import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { Product } from "../lib/types"
import { Button } from "../components/ui/Button"
import { useDispatch } from "react-redux"
import { addToCart } from "../features/cart/cartSlice"
import { getProductById } from "@/lib/api"

export default function ProductDetails() {
    const { id } = useParams<{ id: string }>()
    const [product, setProduct] = useState<Product | null>(null)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!id) return
        getProductById(id).then(setProduct).catch(console.error)
    }, [id])

    if (!product) return <p className="text-center mt-10">Loading...</p>


    return (
        <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 ">
            <div className="flex justify-center items-center border rounded-lg p-4 bg-[#ffffff]">
                <img
                    src={product.image || product.thumbnail || product.images?.[0]}
                    alt={product.name}
                    className="max-h-[400px] object-contain"
                />
            </div>
            <div className="flex flex-col space-y-4 px-6">
                <div className="bg-[#ffffff] p-4">
                    <h1 className="text-2xl font-bold text-[#ed3b5f]">{product.name}</h1>
                    <p className="text-gray-600">{product.description}</p>
                    <p className="text-xl font-semibold text-green-700">₹{product.price}</p>
                    <p className="text-sm text-gray-500">Category: {product.category}</p>
                    <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                    <p className="text-sm text-yellow-600">⭐ {product.rating} / 5</p>
                </div>
                <div className="mt-4">
                    <h2 className="font-semibold mb-2">Customer Reviews</h2>
                    {product.reviews?.length ? (
                        <ul className="space-y-2">
                            {product.reviews.map((r: any, i: any) => (
                                <li key={i} className="border p-2 rounded-lg bg-[#ffffff] p-4">
                                    <p className="text-yellow-600">⭐ {r.rating}</p>
                                    <p>{r.comment}</p>
                                    <p className="text-xs text-gray-500">- {r.reviewerName}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-400">No reviews yet</p>
                    )}
                </div>

                <Button onClick={() => dispatch(addToCart(product))}>Add to Cart</Button>
            </div>
        </div>
    )
}
