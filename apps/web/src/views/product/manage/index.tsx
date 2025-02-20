import { VscArrowLeft } from "react-icons/vsc";
import Link from "next/link";

export default function ManagePage() {
  return (
    <>
      <div className="mt-4 px-6 font-bold">Manajemen Produk</div>
      <div className="fixed bottom-4 right-4 p-3 text-sm md:pb-3">
        <button aria-label="backproduct" className="text-4xl shadow-md">
          <Link
            aria-label="button-back"
            href="/product"
            rel="noopener noreferrer"
            className="text-4xl"
          >
            <VscArrowLeft />
          </Link>
        </button>
      </div>
    </>
  );
}
