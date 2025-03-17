"use client"
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import Store from "@/features/types/store";

interface StoreSelectionModalProps {
  onSelect: (storeId: number) => void;
}

const StoreSelectionModal = ({ onSelect }: StoreSelectionModalProps) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async() => {
    try {
      const res = await api.get("/master-data/stores");
      setStores(res.data);
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Select a Store</h2>
        {loading ? (
          <p>Loading stores...</p>
        ) : (
          <ul className="space-y-2">
            {stores.map((store) => (
              <li key={store.id}>
                <button
                  className="w-full text-left p-2 bg-gray-100 rounded hover:bg-gray-200"
                  onClick={() => onSelect(store.id)}
                >
                  {store.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StoreSelectionModal;
