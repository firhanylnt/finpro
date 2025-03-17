"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/axios";
import FilterSidebar from "@/components/products/filterSidebar";
import Select from "react-select";
import Store from "@/features/types/store";
import { Categories, Product } from "@/features/types/product";
import { useSearchParams, useRouter } from "next/navigation";
import { debounce } from "lodash";
import Pagination from "@/components/admin/pagination";
import { FiFilter } from "react-icons/fi";

const ProductsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "a_to_z");
  const [categoryId, setCategoryId] = useState<string | null>(searchParams.get("categoryId") || null);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [storeId, setStoreId] = useState<number | null>(
    searchParams.get("storeId") ? Number(searchParams.get("storeId")) :
    localStorage.getItem("fe_store_id") ? Number(localStorage.getItem("fe_store_id") || null) :
    null
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchData = useCallback(
    debounce(async (searchValue, storeValue, categoryValue, minPrice, maxPrice, sortByValue, pageValue) => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          search: searchValue,
          storeId: storeValue ? String(storeValue) : "",
          categoryId: categoryValue || "",
          sortBy: sortByValue,
          page: String(pageValue),
        }).toString();
        const res = await api(`/user/product?${query}`);
        setProducts(res.data.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
      setLoading(false);
    }, 500),
    []
  );

  const fetchStores = async () => {
    try {
      const res = await api.get("/master-data/stores");
      setStores(res.data.data);
    } catch (error) {
      console.error("Error fetching stores", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/master-data/categories");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const updateQueryParams = (params: Record<string, string | number | null>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== "") {
        newParams.set(key, String(params[key]));
      } else {
        newParams.delete(key);
      }
    });
    router.push(`?${newParams.toString()}`);
  };

  const handleStoreSelect = (selectedStoreId: number | null) => {
    localStorage.setItem("fe_store_id", selectedStoreId ? String(selectedStoreId) : "");
    setStoreId(selectedStoreId);
    updateQueryParams({ storeId: selectedStoreId });
  };

  const handleFilter = (filters: any) => {
    const newParams = new URLSearchParams();
    
    if (filters.search) newParams.set("search", filters.search);
    if (filters.category) newParams.set("categoryId", filters.category);
    if (filters.minPrice) newParams.set("minPrice", filters.minPrice);
    if (filters.maxPrice) newParams.set("maxPrice", filters.maxPrice);
    if (filters.sortBy) newParams.set("sortBy", filters.sortBy);
  
    router.push(`?${newParams.toString()}`);
    fetchData(filters.search, storeId, filters.category, filters.minPrice, filters.maxPrice, filters.sortBy, page)
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    setPage(newPage);
    updateQueryParams({ page: newPage });
  };

  useEffect(() => {
    fetchCategories();
    fetchStores();
  }, []);

  useEffect(() => {
    fetchData(search, storeId, categoryId, minPrice, maxPrice, sortBy, page);
  }, [search, storeId, categoryId, minPrice, maxPrice, sortBy, page]);

  return (
    <div className="flex flex-col md:flex-row">

      <div className={`fixed inset-0 bg-white p-4 transition-transform ${isFilterOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 md:w-1/4 border-r z-50`}>
        <FilterSidebar categories={categories} onFilterChange={(e) => { setIsFilterOpen(false); handleFilter(e); }} />
      </div>

      <div className="w-full p-6">
        <h1 className="text-2xl font-bold mb-4">Products</h1>

        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-12">
            <Select
              options={stores}
              placeholder="Pilih Toko"
              isClearable={true}
              getOptionLabel={(e) => e.name}
              getOptionValue={(e) => String(e.id)}
              onChange={(selectedOption) => handleStoreSelect(selectedOption ? Number(selectedOption.id) : null)}
              value={stores.find((option) => option.id === storeId) || null}
            />
          </div>
        </div>

        <button
        className="md:hidden bg-blue-500 text-white px-4 py-2 rounded mb-4 flex items-center gap-2"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        <FiFilter /> Filter
      </button>

        {storeId === null ? (
          <div className="text-center">Pilih toko terlebih dahulu</div>
        ) : (
          <>
          {products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <div
                key={product.id}
                onClick={() => router.push(`/products/${product.stock[0].id}`)}
                className="border p-4 rounded-lg shadow-md cursor-pointer hover:shadow-xl transition duration-300 bg-white"
              >
                <div className="relative w-full">
                  <img
                    src={product.productimages[0]?.image_url || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                  {product.stock[0].qty <= 0 && (
                    <div className="absolute inset-0 bg-gray-700 bg-opacity-75 flex items-center justify-center text-white font-bold text-lg rounded-lg">
                      Stock Habis
                    </div>
                  )}
                </div>
              
                <div className="mt-3 flex flex-col gap-1">
                  <h2 className="text-lg font-semibold truncate">{product.name}</h2>
                  <p className="text-sm text-gray-500">{product.productcategory.name}</p>
                </div>
              
                <div className="mt-2">
                  {product.productdiscount?.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {product.productdiscount[0].discount.discount_type_id === 1 && (
                        <div>
                          <span className="text-red-500 font-bold text-lg">
                            Rp {(Number(product.price) - product.productdiscount[0].discount.amount).toLocaleString()}
                          </span>
                          <del className="text-gray-500 text-sm ml-2">Rp {product.price.toLocaleString()}</del>
                        </div>
                      )}
                      {product.productdiscount[0].discount.discount_type_id === 2 && (
                        <div>
                          <span className="text-red-500 font-bold text-lg">
                            Rp {(Number(product.price) - (Number(product.price) * product.productdiscount[0].discount.amount) / 100).toLocaleString()}
                          </span>
                          <del className="text-gray-500 text-sm ml-2">Rp {product.price.toLocaleString()}</del>
                          <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-md ml-2">
                            -{product.productdiscount[0].discount.amount}%
                          </span>
                        </div>
                      )}
                      {product.productdiscount[0].discount.discount_type_id === 3 && (
                        <div className="flex flex-col">
                          <span className="text-gray-500 font-bold text-lg">Rp {product.price.toLocaleString()}</span>
                          <span className="bg-yellow-300 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-md mt-1 w-max">
                            Buy 1 Get 1
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-red-500 font-bold text-lg">Rp {product.price.toLocaleString()}</span>
                  )}
                </div>
              </div>
              
              ))}
            </div>
          )}
          <Pagination page={page} onPageChange={handlePageChange} />
          </>
        )}

        
      </div>
    </div>
  );
};

export default ProductsPage;
