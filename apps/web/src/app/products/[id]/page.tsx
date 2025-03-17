"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import ProductDetail from "@/components/products/productDetail";
import { Product } from "@/features/types/product";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/user/product/${id}`);
        setProduct(data.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
      setLoading(false);
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="container mx-auto p-6">
      <ProductDetail product={product} />
    </div>
  );
};

export default ProductPage;
