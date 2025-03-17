"use client";

import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import Link from "next/link";
import DeleteConfirmation from "@/components/admin/deleteConfirmation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "@/components/admin/pagination";
import SearchInput from "@/components/admin/search";
import Select from "react-select";
import { Categories, ProductList } from "@/features/types/product";
import { debounce } from "lodash";

const ProductListPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useSelector((state: any) => state.auth.user);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "name");
  const [categoryId, setCategoryId] = useState(searchParams.get("category_id") || "");
  const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "asc");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [category, setCategory] = useState<Categories[]>([]);

  const [products, setProducts] = useState<ProductList[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(
    debounce(async (searchValue, categoryValue, sortByValue, sortOrderValue, pageValue) => {
      setLoading(true);
      try {
        const query = new URLSearchParams({ search: searchValue, category_id: categoryValue || "", sortBy: sortByValue, sortOrder: sortOrderValue, page: pageValue.toString() }).toString();
        const res = await api(`/product?${query}`);
        const { data } = res.data;
        setProducts(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
      setLoading(false);
    }, 500), []
  );

  const updateQueryParams = (params: Record<string, string | number>) => {
    const currentUrl = new URL(window.location.href);
    Object.keys(params).forEach((key) => {
      if (params[key]) {
        currentUrl.searchParams.set(key, String(params[key]));
      } else {
        currentUrl.searchParams.delete(key);
      }
    });
    window.history.pushState({}, "", currentUrl);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearch(newValue);
    updateQueryParams({ search: newValue, page: 1 });
    fetchData(newValue, categoryId, sortBy, sortOrder, 1);
  };

  const handleFilterChange = (field: "category_id", value: string) => {
    if (field === "category_id") setCategoryId(value);
    updateQueryParams({ [field]: value, page: 1 });
    fetchData(search, value, sortBy, sortOrder, 1);
  };

  const handleSort = (field: string) => {
    const newSortOrder = sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(field);
    setSortOrder(newSortOrder);
    updateQueryParams({ sortBy: field, sortOrder: newSortOrder });
    fetchData(search, categoryId, field, newSortOrder, 1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    setPage(newPage);
    updateQueryParams({ page: newPage });
    fetchData(search, categoryId, sortBy, sortOrder, newPage);
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/master-data/categories");
      setCategory(res.data.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchData(search, categoryId, sortBy, sortOrder, page);
  }, [search, categoryId, sortBy, sortOrder, page]);

  return (
    <div className="w-full mx-[30px] mt-[30px]">
      <h1 className="text-2xl mb-6 text-gray-800">Products</h1>
      {user?.role === 1 && (
        <div className="my-4">
          <Link href={'products/create'} className="bg-green-500 py-2 px-4 mr-4 rounded-md text-white">+ Create</Link>
        </div>
      )}

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <SearchInput value={search} onChange={handleSearch} placeholder="Search by name..." />
        </div>
        <div className="col-span-4">
          <Select
            options={category}
            getOptionLabel={(e) => e.name}
            getOptionValue={(e) => String(e.id)}
            value={category.find(r => r.id === Number(categoryId)) || null}
            onChange={(e) => handleFilterChange("category_id", e ? String(e.id) : "")}
            placeholder="Filter by category"
            isClearable={true}
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse border-gray-900">
          <thead>
            <tr className="bg-gray-900 text-left text-white border-gray-900">
              <th className="border p-3">Image</th>
              <th className="border p-3 cursor-pointer" onClick={() => handleSort("name")}>
                Product Name {sortBy === "name" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th className="border p-3 cursor-pointer" onClick={() => handleSort("price")}>
                Price {sortBy === "price" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th className="border p-3">Category</th>
              <th className="border p-3 cursor-pointer" onClick={() => handleSort("createdAt")}>
                Created At {sortBy === "createdAt" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              {user?.role === 1 && <th className="border p-3">Action</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">Loading...</td>
              </tr>
            ) : products.length > 0 ? (
              products.map((product: ProductList) => (
                <tr key={product.id} className="border-b hover:bg-gray-50 text-center">
                  <td className="p-3">
                    <img src={product.productimages[0].image_url} width={100} height={100} alt={product.name} />
                  </td>
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.price}</td>
                  <td className="p-3">{product.productcategory.name}</td>
                  <td className="p-3">{new Date(product.createdAt).toLocaleDateString()}</td>
                  {user?.role === 1 && (
                    <td className="p-3">
                      <ToastContainer position="top-center" />
                      <button className="bg-blue-500 py-1 px-4 mr-2 rounded-md text-white" onClick={() => router.push(`products/${product.id}`)}>Edit</button>
                      <DeleteConfirmation
                        apiUrl="/product/delete"
                        itemId={product.id}
                        onDeleteSuccess={() => {fetchData(search, categoryId, sortBy, sortOrder, page)}}
                      />
                    </td>
                  )}
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
