import Link from "next/link";
import { VscArrowLeft } from "react-icons/vsc";
import { FaRegHeart } from "react-icons/fa";
import { IoBagCheckOutline } from "react-icons/io5";

export default function CartPage() {
  return (
    <>
      <div className="mt-4 px-6">Keranjang</div>
      <div className="fixed bottom-4 left-4 p-3 text-sm md:pb-3">
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
      <div className="fixed bottom-4 left-56 p-3 text-sm md:pb-3">
        <button aria-label="checkoutmenu" className="text-4xl shadow-md">
          <Link
            aria-label="button-checkout"
            href="/checkout"
            rel="noopener noreferrer"
            className="text-4xl"
          >
            <IoBagCheckOutline />
          </Link>
        </button>
      </div>
      <div className="fixed bottom-4 right-4 p-3 text-sm md:pb-3">
        <button aria-label="wishlistmenu" className="text-4xl shadow-md">
          <Link
            aria-label="button-wishlist"
            href="/wishlist"
            rel="noopener noreferrer"
            className="text-4xl"
          >
            <FaRegHeart />
          </Link>
        </button>
      </div>
    </>
  );
}
