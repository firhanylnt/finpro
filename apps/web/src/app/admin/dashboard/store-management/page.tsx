"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import Link from "next/link";

interface Admin {
  id: number;
  fullname: string;
  email: string;
  roles: {
    name: string;
  };
  store: string;
  createdAt: Date;  
}

const AdminListPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "name");
  const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "asc");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, [searchParams.toString()]);

  const fetchAdmins = async () => {
    setLoading(true);
    const query = new URLSearchParams({ search, sortBy, sortOrder, page: page.toString() }).toString();
    const res = await api(`/users?${query}`);
    const { data } = res.data;
    setAdmins(data);
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
      <h1 className="text-2xl mb-6 text-gray-800">Admin List</h1>
      <div className="my-4">
        <Link href={'admin/create'} className="bg-green-500 py-2 px-4 mr-4 rounded-md text-white">+ Create</Link>
      </div>
      <div className="flex mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={handleSearch}
          className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse border-gray-900">
          <thead>
            <tr className="bg-gray-900 text-left text-white border-gray-900">
              <th className="border p-3 cursor-pointer" onClick={() => handleSort("name")}>
                Name {sortBy === "name" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th className="border p-3 cursor-pointer" onClick={() => handleSort("email")}>
                Email {sortBy === "email" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th className="border p-3">Role</th>
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
            ) : admins.length > 0 ? (
              admins.map((admin: Admin) => (
                <tr key={admin.id} className="border-b hover:bg-gray-50 text-center">
                  <td className="p-3">{admin.fullname}</td>
                  <td className="p-3">{admin.email}</td>
                  <td className="p-3">{admin.roles.name}</td>
                  <td className="p-3">{new Date(admin.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <Link href={`admin/${admin.id}`} className="bg-blue-500 py-1 px-4 mr-4 rounded-md text-white">Edit</Link>
                    <button className="bg-red-500 py-1 px-4 rounded-md text-white">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">No data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="text-gray-700">Page {page}</span>
        <button
          onClick={() => handlePageChange(page + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminListPage;
