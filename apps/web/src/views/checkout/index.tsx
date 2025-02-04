import Link from "next/link";
import { VscArrowLeft } from "react-icons/vsc";

export default function CheckoutPage() {
  return (
    <>
      <div className="mt-4 px-6">Checkout</div>
      <div className="fixed bottom-4 left-4 p-3 text-sm md:pb-3">
        <button aria-label="backcart" className="text-4xl shadow-md">
          <Link
            aria-label="button-back"
            href="/cart"
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
