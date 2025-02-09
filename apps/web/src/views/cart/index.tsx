// import Link from "next/link";
// import { VscArrowLeft } from "react-icons/vsc";
// import { FaRegHeart } from "react-icons/fa";
// import { IoBagCheckOutline } from "react-icons/io5";

export default function CartPage() {
  return (
    <>
      {/* <div className="mt-4 px-6">Keranjang</div>
      <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
        <div className="mx-auto w-full flex-none px-4 lg:max-w-2xl xl:max-w-4xl">
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 p-4 shadow-sm md:p-6 dark:border-gray-700">
              <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                <a href="#" className="shrink-0 md:order-1">
                  <img
                    className="h-20 w-20 rounded-md border-4 dark:hidden"
                    src="https://images.tokopedia.net/img/cache/500-square/product-1/2020/3/21/24352824/24352824_a75f7a13-18de-41e2-b2e7-73ff69e4df80_500_500.webp?ect=3g"
                    alt="imac image"
                  />
                  <img
                    className="hidden h-20 w-20 rounded-md border-4 dark:block"
                    src="https://images.tokopedia.net/img/cache/500-square/product-1/2020/3/21/24352824/24352824_a75f7a13-18de-41e2-b2e7-73ff69e4df80_500_500.webp?ect=3g"
                    alt="imac image"
                  />
                </a>
                <div className="flex items-center justify-between md:order-3 md:justify-end">
                  <div className="flex items-center">
                    <button
                      type="button"
                      id="decrement-button"
                      data-input-counter-decrement="counter-input"
                      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                    >
                      <svg
                        className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 18 2"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M1 1h16"
                        />
                      </svg>
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
                      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                    >
                      <svg
                        className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 18 18"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 1v16M1 9h16"
                        />
                      </svg>
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
                      <svg
                        className="me-1.5 h-5 w-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                        />
                      </svg>
                    </button>

                    <button
                      type="button"
                      className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                    >
                      <svg
                        className="me-1.5 h-5 w-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18 17.94 6M18 18 6.06 6"
                        />
                      </svg>
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
      </div> */}
    </>
  );
}
