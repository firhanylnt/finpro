import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Link
        aria-label="button-checkout"
        href="/cart"
        rel="noopener noreferrer"
        className="text-4xl"
      >
        <ShoppingCart className="float-right mr-6 mt-4" />
      </Link>
      <div className="mt-4 px-6 font-bold">Cari</div>
    </>
  );
}
