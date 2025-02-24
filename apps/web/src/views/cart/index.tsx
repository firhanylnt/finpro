import Link from "next/link";
import { VscArrowLeft } from "react-icons/vsc";
import { FaRegHeart } from "react-icons/fa";
import { IoBagCheckOutline } from "react-icons/io5";
import { Plus, Minus, Heart, Trash } from "lucide-react";

export default function CartPage() {
  return (
    <>
      <div className="mt-4 px-6 font-bold">Keranjang</div>
      <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
        <div className="mx-auto w-full flex-none px-4 lg:max-w-2xl xl:max-w-4xl">
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 p-4 shadow-sm md:p-6 dark:border-gray-700">
              <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                <div className="shrink-0 md:order-1">
                  <div className="h-20 w-20 rounded-md border-4 dark:hidden"></div>
                  <div className="hidden h-20 w-20 rounded-md border-4 dark:block"></div>
                </div>
                <div className="flex items-center justify-between md:order-3 md:justify-end">
                  <div className="flex items-center">
                    <button
                      type="button"
                      id="decrement-button"
                      data-input-counter-decrement="counter-input"
                      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-200 dark:hover:bg-gray-100 dark:focus:ring-gray-400"
                    >
                      <Minus color="green" size={48} />
                    </button>
                    <input
                      type="text"
                      id="counter-input"
                      data-input-counter
                      className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
                      placeholder=""
                      value="1"
                      required
                    />
                    <button
                      type="button"
                      id="increment-button"
                      data-input-counter-increment="counter-input"
                      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-200 dark:hover:bg-gray-100 dark:focus:ring-gray-400"
                    >
                      <Plus color="green" size={48} />
                    </button>
                  </div>
                  <div className="text-end md:order-4 md:w-32">
                    <p className="text-base font-bold text-gray-900 dark:text-white">
                      Rp24.300
                    </p>
                  </div>
                </div>
                <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                  <Link
                    href="/product/telur"
                    className="text-base font-medium text-gray-900 hover:underline dark:text-white"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Telur Ayam Negeri 10 pcs Sayurbox
                  </Link>

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
                    >
                      <Heart color="grey" size={20} />
                    </button>

                    <button
                      type="button"
                      className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                    >
                      <Trash color="red" size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
      <div className="fixed bottom-4 left-40 p-3 text-sm md:pb-3">
        <button aria-label="checkoutmenu" className="text-4xl shadow-md">
          <Link
            aria-label="button-checkout"
            href="/cart/checkout"
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
