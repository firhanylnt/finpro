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
import { useSelector } from "react-redux";
import { Stock } from "@/features/types/stock";
import Select from "react-select";
import Store from "@/features/types/store";

const CategoriesListPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useSelector((state: any) => state.auth.user);

  const [storeId, setStoreId] = useState<number | null>(searchParams.get("storeId") || user?.store || localStorage.getItem("storeId") || null);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "name");
  const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "asc");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [stores, setStores] = useState<Store[]>([]);
  const [stock, setStock] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    fetchData();
    fetchStores();
    if (user?.store === null) {
      setDisabled(false);
    }
  }, [searchParams.toString()]);

  const fetchData = async () => {
    if (!storeId) return;
    setLoading(true);
    const query = new URLSearchParams({ storeId: storeId.toString(), search, sortBy, sortOrder, page: page.toString() }).toString();
    const res = await api(`/stock?${query}`);
    const { data } = res.data;
    setStock(data);
    setLoading(false);
  };

  const fetchStores = async () => {
    try {
      const res = await api.get("/master-data/stores");
      setStores(res.data.data);
    } catch (error) {
      console.error("Error fetching stores", error);
    }
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

  const handleStoreSelect = (selectedStoreId: number) => {
    localStorage.setItem("storeId", String(selectedStoreId));
    setStoreId(selectedStoreId);
    updateQueryParams({ storeId: selectedStoreId });
  };

  return (
    <div className="w-full mx-[30px] mt-[30px]">
      <h1 className="text-2xl mb-6 text-gray-800">Product Stock</h1>
      {user?.store === null && (
        <Select
          options={stores}
          name="store_id"
          isDisabled={disabled}
          isClearable={true}
          getOptionLabel={(e) => e.name}
          getOptionValue={(e) => String(e.id)}
          onChange={(selectedOption) => handleStoreSelect(Number(selectedOption?.id))}
          value={stores.find((option) => option.id === Number(storeId)) || null}
        />
      )}

      <div className="my-4">
        <Link href={'inventory-management/create'} className="bg-green-500 py-2 px-4 mr-4 rounded-md text-white">+ Create</Link>
      </div>

      <SearchInput value={search} onChange={handleSearch} placeholder="Search by name..." />

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse border-gray-900">
          <thead>
            <tr className="bg-gray-900 text-left text-white border-gray-900">
              <th className="border p-3 cursor-pointer" onClick={() => handleSort("name")}>
                Name {sortBy === "name" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th className="border p-3">Qty</th>
              {user?.role === 1 && (
                <th className="border p-3">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">Loading...</td>
              </tr>
            ) : stock.length > 0 ? (
              stock.map((stock: Stock) => (
                <tr key={stock.id} className="border-b hover:bg-gray-50 text-center">
                  <td className="p-3 border-1 border-black">{stock.products.name}</td>
                  <td className="p-3">{stock.qty}</td>
                  {user?.role === 1 && (
                    <td className="p-3">
                      <ToastContainer position="top-center" />
                      <DeleteConfirmation
                        apiUrl="/stock/delete"
                        itemId={stock.id}
                        onDeleteSuccess={fetchData}
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

export default CategoriesListPage;
