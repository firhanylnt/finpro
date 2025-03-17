"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import Link from "next/link";
import DeleteConfirmation from "@/components/admin/deleteConfirmation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "@/components/admin/pagination";
import SearchInput from "@/components/admin/search";
import {Admin} from "@/features/types/admins";
import { debounce } from "lodash";
import Role from "@/features/types/roles";
import Select from "react-select";
import Store from "@/features/types/store";

const AdminListPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "fullname");
  const [roleId, setRoleId] = useState(searchParams.get("role_id") || "");
  const [storeId, setStoreId] = useState(searchParams.get("store_id") || "");
  const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "asc");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [roles, setRoles] = useState<Role[]>([]);
  const [stores, setStores] = useState<Store[]>([]);

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAdmins = useCallback(
    debounce(async (searchValue, roleValue, storeValue, sortByValue, sortOrderValue, pageValue) => {
      setLoading(true);
      try {
        const query = new URLSearchParams({ search: searchValue, role_id: roleValue || "", store_id: storeValue || "", sortBy: sortByValue, sortOrder: sortOrderValue, page: pageValue.toString() }).toString();
        const res = await api(`/users?${query}`);
        const { data } = res.data;
        setAdmins(data);
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
      setLoading(false);

    }, 500), []
  );

  const updateQueryParams = (params: Record<string, string | number>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.keys(params).forEach((key) => {
      if (params[key] !== "" && params[key] !== null) {
        newParams.set(key, String(params[key]));
      } else {
        newParams.delete(key);
      }
    });

    router.push(`?${newParams.toString()}`);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    updateQueryParams({ search: value, page: 1 });
    fetchAdmins(value, roleId, storeId, sortBy, sortOrder, 1);
  };

  const handleSort = (field: string) => {
    const newSortOrder = sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(field);
    setSortOrder(newSortOrder);
    updateQueryParams({ sortBy: field, sortOrder: newSortOrder });
    fetchAdmins(search, roleId, storeId, field, newSortOrder, page);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    setPage(newPage);
    updateQueryParams({ page: newPage });
    fetchAdmins(search, roleId, storeId, sortBy, sortOrder, newPage);
  };

  const handleFilterChange = (field: "role_id" | "store_id", value: string) => {
    if (field === "role_id") setRoleId(value);
    if (field === "store_id") setStoreId(value);
    updateQueryParams({ [field]: value, page: 1 });
    fetchAdmins(search, field === "role_id" ? value : roleId, field === "store_id" ? value : storeId, sortBy, sortOrder, 1);
  };

  const fetchRoles = async () => {
    try {
      const res = await api.get("/master-data/roles");
      setRoles(res.data.data);
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
    fetchRoles();
    fetchStores();
  }, []);

  useEffect(() => {
    fetchAdmins(search, roleId, storeId, sortBy, sortOrder, page);
  }, [search, roleId, storeId, sortBy, sortOrder, page]);

  return (
    <div className="w-full mx-[30px] mt-[30px]">
      <h1 className="text-2xl mb-6 text-gray-800">Admins</h1>
      <div className="my-4">
        <Link href={'admin/create'} className="bg-green-500 py-2 px-4 mr-4 rounded-md text-white">+ Create</Link>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <SearchInput value={search} onChange={handleSearch} placeholder="Search by name..." />
        </div>
        <div className="col-span-2">
          <Select
            options={roles}
            getOptionLabel={(e) => e.name}
            getOptionValue={(e) => String(e.id)}
            value={roles.find(r => r.id === Number(roleId)) || null}
            onChange={(e) => handleFilterChange("role_id", e ? String(e.id) : "")}
            placeholder="Filter by Role"
            isClearable={true}
          />
        </div>
        <div className="col-span-2">
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
      </div>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse border-gray-900">
          <thead>
            <tr className="bg-gray-900 text-left text-white border-gray-900">
              <th className="border p-3 cursor-pointer" onClick={() => handleSort("fullname")}>
                Fullname {sortBy === "fullname" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th className="border p-3 cursor-pointer" onClick={() => handleSort("email")}>
                Email {sortBy === "email" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th className="border p-3">Role</th>
              <th className="border p-3">Store</th>
              <th className="border p-3 cursor-pointer" onClick={() => handleSort("createdAt")}>
                Created At {sortBy === "createdAt" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th className="border p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">Loading...</td>
              </tr>
            ) : admins.length > 0 ? (
              admins.map((admin: Admin) => (
                <tr key={admin.id} className="border-b hover:bg-gray-50 text-center">
                  <td className="p-3">{admin.fullname}</td>
                  <td className="p-3">{admin.email}</td>
                  <td className="p-3">{admin.roles.name}</td>
                  <td className="p-3">{admin.store?.name}</td>
                  <td className="p-3">{new Date(admin.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <ToastContainer position="top-center" />
                    <button className="bg-blue-500 py-1 px-4 mr-2 rounded-md text-white" onClick={() => router.push(`admin/${admin.id}`)}>Edit</button>
                    <DeleteConfirmation
                      apiUrl="/users/delete"
                      itemId={admin.id}
                      onDeleteSuccess={() => fetchAdmins(search, roleId, storeId, sortBy, sortOrder, page)}
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

export default AdminListPage;
