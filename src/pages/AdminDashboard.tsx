import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, selectProducts, selectProductsStatus } from "@/features/products/productSlice";
import { AppDispatch } from "@/store";
import { Product } from "@/lib/types";
import { API_URL } from "@/lib/api";
import axios from "axios";
import ProductModal from "./ProductModal";



export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectProducts);
  const status = useSelector(selectProductsStatus);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const totalPages = Math.ceil(products.length / limit);
  const paginated = products.slice((page - 1) * limit, page * limit);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      dispatch(fetchProducts());
      alert("Product deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  if (status === "loading") return <p>Loading products...</p>;
  if (status === "failed") return <p>Failed to load products.</p>;

  return (
     <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard - Products</h1>

      {/* Add Product Button */}
      <button
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={() => {
          setEditingProduct(null);
          setIsModalOpen(true);
        }}
      >
        ➕ Add Product
      </button>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Category</th>
              <th className="py-2 px-4">Price</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((product: Product, idx) => (
              <tr key={product._id} className="border-b">
                <td className="py-2 px-4">{(page - 1) * limit + idx + 1}</td>
                <td className="py-2 px-4">{product.name}</td>
                <td className="py-2 px-4">{product.category || "-"}</td>
                <td className="py-2 px-4">${product.price}</td>
                <td className="py-2 px-4 flex gap-2">
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => {
                      setEditingProduct(product);
                      setIsModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded ${i + 1 === page ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => dispatch(fetchProducts())}
        product={editingProduct}
      />
    </div>
  );
}