"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import Link from "next/link";
import DeleteConfirmation from "@/components/admin/deleteConfirmation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "@/components/admin/pagination";
import SearchInput from "@/components/admin/search";

interface Product {
  id: number;
  name: string;
  price: string;
  productcategory: {
    name: string;
  }
  createdAt: Date;
}

const ProductListPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "name");
  const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "asc");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, [searchParams.toString()]);

  const fetchAdmins = async () => {
    setLoading(true);
    const query = new URLSearchParams({ search, sortBy, sortOrder, page: page.toString() }).toString();
    const res = await api(`/product?${query}`);
    const { data } = res.data;
    setProducts(data);
    setLoading(false);
  };

  const updateQueryParams = (params: Record<string, string | number>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.keys(params).forEach((key) => {
      if (params[key]) newParams.set(key, String(params[key]));
      else newParams.delete(key);
    });
    router.push(`?${newParams.toString()}`);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    updateQueryParams({ search: e.target.value, page: 1 });
  };

  const handleSort = (field: string) => {
    const newSortOrder = sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(field);
    setSortOrder(newSortOrder);
    updateQueryParams({ sortBy: field, sortOrder: newSortOrder });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    setPage(newPage);
    updateQueryParams({ page: newPage });
  };

  return (
    <div className="w-full mx-[30px] mt-[30px]">
      <h1 className="text-2xl mb-6 text-gray-800">Products</h1>
      <div className="my-4">
        <Link href={'products/create'} className="bg-green-500 py-2 px-4 mr-4 rounded-md text-white">+ Create</Link>
      </div>
      <SearchInput value={search} onChange={handleSearch} placeholder="Search by name..." />

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse border-gray-900">
          <thead>
            <tr className="bg-gray-900 text-left text-white border-gray-900">
              <th className="border p-3 cursor-pointer" onClick={() => handleSort("name")}>
                Product Name {sortBy === "name" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th className="border p-3 cursor-pointer" onClick={() => handleSort("price")}>
                Price {sortBy === "price" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th className="border p-3 cursor-pointer" onClick={() => handleSort("category")}>
                Category {sortBy === "category" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th className="border p-3 cursor-pointer" onClick={() => handleSort("createdAt")}>
                Created At {sortBy === "createdAt" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th className="border p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">Loading...</td>
              </tr>
            ) : products.length > 0 ? (
              products.map((product: Product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50 text-center">
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.price}</td>
                  <td className="p-3">{product.productcategory.name}</td>
                  <td className="p-3">{new Date(product.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <ToastContainer position="top-center" />
                    {/* <Link href={`admin/${admin.id}`} className="bg-blue-500 py-1 px-4 mr-4 rounded-md text-white">Edit</Link> */}
                    <button className="bg-blue-500 py-1 px-4 mr-2 rounded-md text-white" onClick={() => router.push(`products/${product.id}`)}>Edit</button>
                    <DeleteConfirmation
                      apiUrl="/product/delete"
                      itemId={product.id}
                      onDeleteSuccess={fetchAdmins}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">No data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} onPageChange={handlePageChange} />
    </div>
  );
};

export default ProductListPage;
