"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import FilterSidebar from "@/components/products/filterSidebar";

interface Product {
  id: number;
  name: string;
  price: number;
  productcategory: { name: string };
  productimages: { image_url: string }[];
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    fetchProducts({});
    fetchCategories();
  }, []);

  const fetchProducts = async (filters: any) => {
    try {
      const response = await axios.get("/api/products", { params: filters });
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <div className="flex">
      <FilterSidebar categories={categories} onFilterChange={fetchProducts} />

      <div className="w-3/4 p-6">
        <h1 className="text-2xl font-bold mb-4">Products</h1>

        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div key={product.id} className="border p-4 rounded-lg shadow-md">
                <img
                  src={product.productimages[0]?.image_url || "/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-sm text-gray-500">{product.productcategory.name}</p>
                <p className="text-blue-500 font-bold">Rp {product.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
