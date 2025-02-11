"use client";

import { useState, useEffect } from "react";
import { Home, LayoutDashboard, Users, Settings, Menu, X } from "lucide-react";
import Link from "next/link";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isClient, setIsClient] = useState(false); // Track if the component has mounted

  useEffect(() => {
    setIsClient(true); // Set isClient to true once the component is mounted on the client side
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  if (!isClient) return null; // Avoid rendering sidebar on SSR

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-64" : "w-16"
        } bg-gray-900 h-screen p-5 pt-8 relative transition-all duration-300`}
      >
        {/* Toggle Button */}
        <button
          className="absolute top-4 right-4 text-white"
          onClick={toggleSidebar}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Sidebar Items */}
        <ul className="mt-10 space-y-4">
          <SidebarItem href="/" icon={<Home />} text="Home" isOpen={isOpen} />
          <SidebarItem href="/dashboard" icon={<LayoutDashboard />} text="Dashboard" isOpen={isOpen} />
          <SidebarItem href="/users" icon={<Users />} text="Users" isOpen={isOpen} />
          <SidebarItem href="/settings" icon={<Settings />} text="Settings" isOpen={isOpen} />
        </ul>
      </div>
    </div>
  );
};

const SidebarItem = ({ href, icon, text, isOpen }: { href: string; icon: JSX.Element; text: string; isOpen: boolean }) => (
  <li>
    <Link href={href} className="flex items-center space-x-4 text-white p-2 hover:bg-gray-700 rounded">
      {icon}
      {isOpen && <span>{text}</span>}
    </Link>
  </li>
);

export default Sidebar;
