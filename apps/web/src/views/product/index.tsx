import Link from "next/link";
import { VscSettingsGear } from "react-icons/vsc";
import { IoCartOutline } from "react-icons/io5";

export default function ProductPage() {
  return (
    <>
      <div className="mt-4 px-6">Daftar Produk</div>
      <div className="fixed bottom-4 left-4 p-3 text-sm md:pb-3">
        <button aria-label="cartmenu" className="text-4xl shadow-md">
          <Link
            aria-label="button-cart"
            href="/cart"
            rel="noopener noreferrer"
            className="text-4xl"
          >
            <IoCartOutline />
          </Link>
        </button>
      </div>
      <div className="fixed bottom-4 right-4 p-3 text-sm md:pb-3">
        <button aria-label="managemenu" className="text-4xl shadow-md">
          <Link
            aria-label="button-manage"
            href="/product/manage"
            rel="noopener noreferrer"
            className="text-4xl"
          >
            <VscSettingsGear />
          </Link>
        </button>
      </div>
    </>
  );
}
