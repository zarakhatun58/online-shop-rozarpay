import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/api";
import { Product } from "@/lib/types";

type Props = {
  open: boolean;
  onClose: () => void;
  product?: Product;
};

export default function ProductModal({ open, onClose, product }: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setCategory(product.category || "");
      setPrice(product.price || "");
      setDescription(product.description || "");
      setPreviewImage(product.image ? `${API_URL}${product.image}` : null);
      setPreviewThumbnail(product.thumbnail ? `${API_URL}${product.thumbnail}` : null);
      setPreviewImages(product.images ? product.images.map((img:any) => `${API_URL}${img}`) : []);
    } else {
      setName("");
      setCategory("");
      setPrice("");
      setDescription("");
      setImage(null);
      setThumbnail(null);
      setImages([]);
      setPreviewImage(null);
      setPreviewThumbnail(null);
      setPreviewImages([]);
    }
  }, [product]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "thumbnail" | "images") => {
    if (!e.target.files) return;
    if (type === "image") {
      setImage(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
    } else if (type === "thumbnail") {
      setThumbnail(e.target.files[0]);
      setPreviewThumbnail(URL.createObjectURL(e.target.files[0]));
    } else if (type === "images") {
      const files = Array.from(e.target.files);
      setImages(files);
      setPreviewImages(files.map((f) => URL.createObjectURL(f)));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      alert("Name and Price are required");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("price", price.toString());
      formData.append("description", description);
      if (image) formData.append("image", image);
      if (thumbnail) formData.append("thumbnail", thumbnail);
      images.forEach((img) => formData.append("images", img));

      const token = localStorage.getItem("token");
      const config = {
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      };

      if (product?._id) {
        await axios.put(`${API_URL}/api/products/${product._id}`, formData, config);
        alert("Product updated successfully");
      } else {
        await axios.post(`${API_URL}/api/products`, formData, config);
        alert("Product created successfully");
      }

      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative">
        <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={onClose}>
          ✖
        </button>
        <h2 className="text-xl font-bold mb-4">{product ? "Edit Product" : "Add Product"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Product Name"
            className="border px-3 py-2 w-full rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Category"
            className="border px-3 py-2 w-full rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            type="number"
            placeholder="Price"
            className="border px-3 py-2 w-full rounded"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
          <textarea
            placeholder="Description"
            className="border px-3 py-2 w-full rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex gap-4">
            <div>
              <label className="block mb-1">Main Image</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "image")} />
              {previewImage && <img src={previewImage} alt="Preview" className="w-24 h-24 mt-2 object-cover rounded" />}
            </div>
            <div>
              <label className="block mb-1">Thumbnail</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "thumbnail")} />
              {previewThumbnail && <img src={previewThumbnail} alt="Preview" className="w-24 h-24 mt-2 object-cover rounded" />}
            </div>
            <div>
              <label className="block mb-1">Other Images</label>
              <input type="file" accept="image/*" multiple onChange={(e) => handleImageChange(e, "images")} />
              <div className="flex flex-wrap mt-2 gap-2">
                {previewImages.map((img, idx) => (
                  <img key={idx} src={img} alt="Preview" className="w-16 h-16 object-cover rounded" />
                ))}
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Saving..." : product ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
