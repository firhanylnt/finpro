"use client";

import { useState } from "react";

interface FilterSidebarProps {
  categories: { id: number; name: string }[];
  onFilterChange: (filters: any) => void;
}

const FilterSidebar = ({ categories, onFilterChange }: FilterSidebarProps) => {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    onFilterChange(filters);
  };

  return (
    <div className="w-1/4 p-4 border-r">
      <h2 className="text-xl font-bold mb-4">Filter</h2>

      <input
        type="text"
        name="search"
        placeholder="Search product..."
        className="w-full p-2 border rounded mb-4"
        value={filters.search}
        onChange={handleChange}
      />

      <select name="category" className="w-full p-2 border rounded mb-4" value={filters.category} onChange={handleChange}>
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <input type="number" name="minPrice" placeholder="Min Price" className="w-full p-2 border rounded mb-2" value={filters.minPrice} onChange={handleChange} />
      <input type="number" name="maxPrice" placeholder="Max Price" className="w-full p-2 border rounded mb-4" value={filters.maxPrice} onChange={handleChange} />

      <select name="sortBy" className="w-full p-2 border rounded mb-4" value={filters.sortBy} onChange={handleChange}>
        <option value="">Sort By</option>
        <option value="best_seller">Best Seller</option>
        <option value="lowest_price">Lowest Price</option>
        <option value="highest_price">Highest Price</option>
        <option value="a_to_z">A - Z</option>
        <option value="z_to_a">Z - A</option>
      </select>

      <button onClick={applyFilters} className="w-full bg-blue-500 text-white p-2 rounded">
        Apply Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
