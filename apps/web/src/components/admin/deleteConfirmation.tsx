"use client";

import { toast } from "react-toastify";
import api from "@/lib/axios";

interface DeleteConfirmationProps {
  apiUrl: string;
  itemId: number;
  onDeleteSuccess?: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  apiUrl,
  itemId,
  onDeleteSuccess,
}) => {
  const handleDelete = () => {
    toast(
      ({ closeToast }) => (
        <div className="w-full p-4">
            <p className="text-lg text-gray-800 font-medium text-center">
                Are you sure you want to delete this item?
            </p>
            <div className="flex justify-center gap-4 mt-4">
                <button
                onClick={() => {
                    confirmDelete();
                    closeToast();
                }}
                className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
                >
                Yes
                </button>
                <button
                onClick={closeToast}
                className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                No
                </button>
            </div>
        </div>

      ),
      { autoClose: false, closeOnClick: false }
    );
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`${apiUrl}/${itemId}`);
      toast.success("Item deleted successfully!");
      if (onDeleteSuccess) onDeleteSuccess();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item.");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 py-1 px-4 rounded-md text-white"
    >
      Delete
    </button>
  );
};

export default DeleteConfirmation;
