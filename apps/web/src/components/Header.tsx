import Link from "next/link";
import { Bell, Mail, Search, ShoppingCart } from "lucide-react";

export const Header = () => {
  return (
    <>
      <nav className="sm:fixed sm:top-0 sm:w-full sm:border sm:bg-white">
        <div className="mx-auto hidden max-w-7xl px-2 sm:ml-6 sm:block sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex space-x-4 md:ml-6 lg:ml-36 xl:ml-96">
              <Link
                href="/"
                className="font-sans text-3xl font-extrabold text-green-600"
              >
                Baralanja
              </Link>
              <div className="sm:ml-4 sm:w-full sm:justify-center sm:rounded-lg sm:border-2 sm:border-black sm:px-2 sm:py-2 sm:font-bold">
                <input
                  className="w-44 font-normal md:w-80 lg:w-96"
                  placeholder="telur ayam"
                />
                <Search className="float-left mr-2 mt-1 size-4" />
                Cari
              </div>
              <Link
                aria-label="button-checkout"
                href="/cart"
                rel="noopener noreferrer"
                className="text-4xl"
              >
                <ShoppingCart className="sm:float-right sm:mr-0 sm:mt-2" />
              </Link>
              <Link
                aria-label="button-checkout"
                href="/notif-center"
                rel="noopener noreferrer"
                className="text-4xl"
              >
                <Bell className="sm:float-right sm:mr-0 sm:mt-2" />
              </Link>
              <Link
                aria-label="button-checkout"
                href="/inbox-user"
                rel="noopener noreferrer"
                className="text-4xl"
              >
                <Mail className="sm:float-right sm:mr-0 sm:mt-2" />
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <br className="hidden sm:block" />
      <br className="hidden sm:block" />
      <br className="hidden sm:block" />
    </>
  );
};
