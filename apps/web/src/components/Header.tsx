"use client";

import { useState } from "react";
import Link from "next/link";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold">E-Commerce</div>

      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      <ul className={`md:flex gap-6 ${isOpen ? "block" : "hidden"} md:block`}>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/products">Products</Link></li>
      </ul>
    </nav>
  );
};

export default Header;
