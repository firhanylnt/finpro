"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "@/components/admin/pagination";
import SearchInput from "@/components/admin/search";
import { debounce } from "lodash";
import Select from "react-select";
import { Users } from "@/features/types/admins";

const statusList = [
  {id: 'true', name: 'Active'},
  {id: 'false', name: 'Inactive'}
]

const AdminListPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "fullname");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "asc");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(
    debounce(async (searchValue, status, sortByValue, sortOrderValue, pageValue) => {
      setLoading(true);
      try {
        const query = new URLSearchParams({ search: searchValue, status: status || "", sortBy: sortByValue, sortOrder: sortOrderValue, page: pageValue.toString() }).toString();
        const res = await api(`/users/end-users?${query}`);
        const { data } = res.data;
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
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
    fetchUsers(value, status, sortBy, sortOrder, 1);
  };

  const handleSort = (field: string) => {
    const newSortOrder = sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(field);
    setSortOrder(newSortOrder);
    updateQueryParams({ sortBy: field, sortOrder: newSortOrder });
    fetchUsers(search, status, field, newSortOrder, page);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    setPage(newPage);
    updateQueryParams({ page: newPage });
    fetchUsers(search, status, sortBy, sortOrder, newPage);
  };

  const handleFilterChange = (field: "status" , value: string) => {
    if (field === "status") setStatus(value);
    updateQueryParams({ [field]: value, page: 1 });
    fetchUsers(search, field === "status" ? value : status, sortBy, sortOrder, 1);
  };

  useEffect(() => {
    fetchUsers(search, status, sortBy, sortOrder, page);
  }, [search, status, sortBy, sortOrder, page]);

  return (
    <div className="w-full mx-[30px] mt-[30px]">
      <h1 className="text-2xl mb-6 text-gray-800">users</h1>
      <div className="my-4">
        <Link href={'admin/create'} className="bg-green-500 py-2 px-4 mr-4 rounded-md text-white">+ Create</Link>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <SearchInput value={search} onChange={handleSearch} placeholder="Search by name..." />
        </div>
        <div className="col-span-2">
          <Select
            options={statusList}
            getOptionLabel={(e) => e.name}
            getOptionValue={(e) => e.id}
            value={statusList.find(r => r.id === status) || null}
            onChange={(e) => handleFilterChange("status", e ? e.id : "")}
            placeholder="Filter by status"
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
              <th className="border p-3 cursor-pointer">
                Phone Number
              </th>
              <th className="border p-3 cursor-pointer">
                Status
              </th>
              <th className="border p-3 cursor-pointer" onClick={() => handleSort("createdAt")}>
                Created At {sortBy === "createdAt" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">Loading...</td>
              </tr>
            ) : users.length > 0 ? (
              users.map((users: Users) => (
                <tr key={users.id} className="border-b hover:bg-gray-50 text-center">
                  <td className="p-3">{users.fullname}</td>
                  <td className="p-3">{users.email}</td>
                  <td className="p-3">{users.phone_number}</td>
                  <td className="p-3">{users.status === true ? 'Active' : 'Inactive'}</td>
                  <td className="p-3">{new Date(users.createdAt).toLocaleDateString()}</td>
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
