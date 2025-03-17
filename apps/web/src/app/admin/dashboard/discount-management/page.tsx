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
import Discount from "@/features/types/discountList";
import Store from "@/features/types/store";
import DiscountType from "@/features/types/discountType";
import { debounce } from "lodash";
import Select from "react-select";

const discountList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useSelector((state: any) => state.auth.user);

  const [storeId, setStoreId] = useState<number | null>(searchParams.get("storeId") || user?.store || localStorage.getItem("storeId") || null);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "name");
  const [discountTypeId, setdiscountTypeId] = useState(searchParams.get("discount_type_id") || "");
  const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "asc");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [discountType, setDiscountType] = useState<DiscountType[]>([]);

  const fetchData = useCallback(
    debounce(async (searchValue, discountType, storeValue, sortByValue, sortOrderValue, pageValue) => {
      setLoading(true);
      try {
        const query = new URLSearchParams({ search: searchValue, discount_type_id: discountType || "", store_id: storeValue || "", sortBy: sortByValue, sortOrder: sortOrderValue, page: pageValue.toString() }).toString();
        const res = await api(`/discount?${query}`);
        const { data } = res.data;
        setDiscounts(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
      setLoading(false);

    }, 500), []
  );

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

  const handleFilterChange = (field: "discount_type_id" | "store_id", value: string) => {
    if (field === "discount_type_id") setdiscountTypeId(value);
    if (field === "store_id") setStoreId(Number(value));
    updateQueryParams({ [field]: value, page: 1 });
    fetchData(search, field === "discount_type_id" ? value : discountTypeId, field === "store_id" ? value : storeId, sortBy, sortOrder, 1);
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

  const fetchDiscountType = async () => {
    try {
      const res = await api.get("/master-data/discount-type");
      setDiscountType(res.data.data);
    } catch (error) {
      console.error("Error fetching roles", error);
    }
  };

  const fetchStores = async () => {
    try {
      const res = await api.get("/master-data/stores");
      setStores(res.data.data);
    } catch (error) {
      console.error("Error fetching stores", error);
    }
  };

  useEffect(() => {
    fetchDiscountType();
    fetchStores()
  }, []);

  useEffect(() => {
    fetchData(search, discountTypeId, storeId, sortBy, sortOrder, page);
  }, [search, discountTypeId, storeId, sortBy, sortOrder, page]);

  return (
    <div className="w-full mx-[30px] mt-[30px]">
      <h1 className="text-2xl mb-6 text-gray-800">discounts</h1>
      {user?.role === 1 && (
        <div className="my-4">
          <Link href={'/admin/dashboard/discount-management/create'} className="bg-green-500 py-2 px-4 mr-4 rounded-md text-white">+ Create</Link>
        </div>
      )}

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <SearchInput value={search} onChange={handleSearch} placeholder="Search ..." />
        </div>
        <div className="col-span-3">
          <Select
            options={discountType}
            getOptionLabel={(e) => e.name}
            getOptionValue={(e) => String(e.id)}
            value={discountType.find(r => r.id === Number(discountTypeId)) || null}
            onChange={(e) => handleFilterChange("discount_type_id", e ? String(e.id) : "")}
            placeholder="Filter by Discount Type"
            isClearable={true}
          />
        </div>
        {user?.store == null && (
            <div className="col-span-3">
              <Select
                options={stores}
                getOptionLabel={(e) => e.name}
                getOptionValue={(e) => String(e.id)}
                value={stores.find(s => s.id === Number(storeId)) || null}
                onChange={(e) => handleFilterChange("store_id", e ? String(e.id) : "")}
                placeholder="Filter by Store"
                isClearable={true}
              />
            </div>
        )}
        
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse border-gray-900">
          <thead>
            <tr className="bg-gray-900 text-left text-white border-gray-900">
              <th className="border p-3 cursor-pointer" onClick={() => handleSort("name")}>
                Discount Name {sortBy === "name" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th className="border p-3 cursor-pointer" onClick={() => handleSort("coupon")}>
                Coupon {sortBy === "coupon" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th className="border p-3 cursor-pointer">
                Category
              </th>
              <th className="border p-3 cursor-pointer" onClick={() => handleSort("amount")}>
                Amount {sortBy === "amount" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th className="border p-3 cursor-pointer">
                Product
              </th>
              <th className="border p-3 cursor-pointer" onClick={() => handleSort("price")}>
                Store {sortBy === "price" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th className="border p-3 cursor-pointer" onClick={() => handleSort("category")}>
                Start Date {sortBy === "category" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th className="border p-3 cursor-pointer" onClick={() => handleSort("category")}>
                End Date {sortBy === "category" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              {user?.role === 1 && (
                <th className="border p-3">Action</th>
              )}

            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="p-4 text-center text-gray-500">Loading...</td>
              </tr>
            ) : discounts.length > 0 ? (
              discounts.map((discount: Discount) => (
                <tr key={discount.id} className="border-b hover:bg-gray-50 text-center">
                  <td className="p-3">{discount.name}</td>
                  <td className="p-3">{discount.coupon}</td>
                  <td className="p-3">{discount.discounttype.name}</td>
                  <td className="p-3">{discount.amount}</td>
                  <td className="p-3">{discount?.productdiscount?.length > 0
                    ? discount.productdiscount[0]?.products?.name
                    : 'All Product'}</td>
                  <td className="p-3">{discount?.stores?.name ?? 'All Store'}</td>
                  <td className="p-3">{new Date(discount.start_date).toLocaleDateString()}</td>
                  <td className="p-3">{new Date(discount.end_date).toLocaleDateString()}</td>
                  {user?.role === 1 && (
                    <td className="p-3">
                      <ToastContainer position="top-center" />
                      <button className="bg-blue-500 py-1 px-4 mr-2 rounded-md text-white" onClick={() => router.push(`discount-management/${discount.id}`)}>Edit</button>
                      <DeleteConfirmation
                        apiUrl="/discount/delete"
                        itemId={discount.id}
                        onDeleteSuccess={() => { fetchData(search, discountTypeId, storeId, sortBy, sortOrder, page) }}
                      />
                    </td>
                  )}

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="p-4 text-center text-gray-500">No data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} onPageChange={handlePageChange} />
    </div>
  );
};

export default discountList;
