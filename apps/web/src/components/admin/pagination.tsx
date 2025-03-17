"use client";
import React from "react";

interface PaginationProps {
  page: number;
  onPageChange: (newPage: number) => void;
  disablePrev?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ page, onPageChange, disablePrev }) => {
  return (
    <div className="flex justify-between mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={disablePrev || page <= 1}
        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
      >
        Previous
      </button>
      <span className="text-gray-700">Page {page}</span>
      <button
        onClick={() => onPageChange(page + 1)}
        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-blue-600"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
