import Link from "next/link";
import { Bell, Mail, Menu, Search, ShoppingCart } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <div className="float-left ml-4 mt-4 w-auto rounded-lg border-2 border-black px-2 py-1 font-bold sm:hidden">
        <input className="font-normal" placeholder="telur ayam" />
        <Search className="float-left mr-2 mt-1 size-4" />
        Cari
      </div>
      <Menu className="float-right mr-6 mt-4 sm:hidden" />
      <Link
        aria-label="button-checkout"
        href="/cart"
        rel="noopener noreferrer"
        className="text-4xl"
      >
        <ShoppingCart className="float-right mr-4 mt-4 sm:hidden" />
      </Link>
      <Bell className="float-right mr-4 mt-4 sm:hidden" />
      <Mail className="float-right mr-4 mt-4 sm:hidden" />
    </>
  );
}
