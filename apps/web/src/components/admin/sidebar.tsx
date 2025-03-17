"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { LayoutDashboard, Users, Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { logout } from "@/store/authSlice";
import { useRouter } from "next/navigation";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isClient, setIsClient] = useState(false);
    const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [isProductManagementOpen, setIsProductManagementOpen] = useState(false);
    const user = useSelector((state: any) => state.auth.user);
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const Handlelogout = () => {
        dispatch(logout());
        router.push("/admin/login");
    }

    if (!isClient) return null;

    return (
        <div className="flex">
            <div
                className={`${isOpen ? "w-64" : "w-16"
                    } bg-gray-900 h-screen p-5 m-2 pt-8 rounded-md relative transition-all duration-300`}
            >
                <button className="absolute top-4 right-4 text-white" onClick={toggleSidebar}>
                    {isOpen ? <Menu size={24} /> : <Menu size={24} />}
                </button>

                <ul className="mt-10 space-y-2 text-sm">
                    <li className=" text-center text-lg text-white mb-[30px]">Hi, {user?.name}</li>
                    <SidebarItem href="/admin/dashboard" icon={<LayoutDashboard size={20} />} text="Dashboard" isOpen={isOpen} />

                    {user?.role === 1 && (
                        <li>
                            <button
                                onClick={() => setIsUserManagementOpen(!isUserManagementOpen)}
                                className="flex items-center justify-between w-full text-white p-2 hover:bg-gray-700 rounded text-sm"
                            >
                                <div className="flex items-center space-x-4">
                                    <Users size={20} />
                                    {isOpen && <span>User Management</span>}
                                </div>
                                {isOpen && (isUserManagementOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                            </button>

                            {isUserManagementOpen && (
                                <ul className="ml-6 space-y-2 text-xs">
                                    <SidebarItem href="/admin/dashboard/user-management/admin" icon={<Users size={18} />} text="Admins" isOpen={isOpen} />
                                    <SidebarItem href="/admin/dashboard/user-management/user" icon={<Users size={18} />} text="Users" isOpen={isOpen} />
                                </ul>
                            )}
                        </li>
                    )}

                    <li>
                        <button
                            onClick={() => setIsProductManagementOpen(!isProductManagementOpen)}
                            className="flex items-center justify-between w-full text-white p-2 hover:bg-gray-700 rounded text-sm"
                        >
                            <div className="flex items-center space-x-4">
                                <Users size={20} />
                                {isOpen && <span>Product Management</span>}
                            </div>
                            {isOpen && (isProductManagementOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                        </button>

                        {isProductManagementOpen && (
                            <ul className="ml-6 space-y-2 text-xs">
                                <SidebarItem href="/admin/dashboard/product-management/products" icon={<Users size={18} />} text="Products" isOpen={isOpen} />
                                <SidebarItem href="/admin/dashboard/product-management/categories" icon={<Users size={18} />} text="Product Category" isOpen={isOpen} />
                            </ul>
                        )}
                    </li>

                    <SidebarItem href="/admin/dashboard/inventory-management" icon={<LayoutDashboard size={20} />} text="Inventory Management" isOpen={isOpen} />
                    {user?.role === 1 && (
                        <SidebarItem href="/admin/dashboard/store-management" icon={<LayoutDashboard size={20} />} text="Store Management" isOpen={isOpen} />
                    )}
                    
                    <SidebarItem href="/admin/dashboard/discount-management" icon={<LayoutDashboard size={20} />} text="Discount" isOpen={isOpen} />
                    <li>
                        <button
                            onClick={() => setIsReportOpen(!isReportOpen)}
                            className="flex items-center justify-between w-full text-white p-2 hover:bg-gray-700 rounded text-sm"
                        >
                            <div className="flex items-center space-x-4">
                                <Users size={20} />
                                {isOpen && <span>Reports</span>}
                            </div>
                            {isOpen && (isReportOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                        </button>

                        {isReportOpen && (
                            <ul className="ml-6 space-y-2 text-xs">
                                <SidebarItem href="/admin/dashboard/report" icon={<LayoutDashboard size={20} />} text="Transactions" isOpen={isOpen} />
                                <SidebarItem href="/admin/dashboard/report-stock" icon={<LayoutDashboard size={20} />} text="Stocks" isOpen={isOpen} />
                                {/* <SidebarItem href="/admin/dashboard/product-management/products" icon={<Users size={18} />} text="Products" isOpen={isOpen} />
                                <SidebarItem href="/admin/dashboard/product-management/categories" icon={<Users size={18} />} text="Product Category" isOpen={isOpen} /> */}
                            </ul>
                        )}
                    </li>
                    {/* <SidebarItem href="/admin/dashboard/report" icon={<LayoutDashboard size={20} />} text="Report" isOpen={isOpen} /> */}
                    <Link className="flex items-center space-x-4 text-white p-2 hover:bg-gray-700 rounded text-sm" href="#" onClick={Handlelogout}>Logout</Link>
                </ul>
            </div>
        </div>
    );
};

const SidebarItem = ({ href, icon, text, isOpen }: { href: string; icon: JSX.Element; text: string; isOpen: boolean }) => (
    <li>
        <Link href={href} className="flex items-center space-x-4 text-white p-2 hover:bg-gray-700 rounded text-sm">
            {icon}
            {isOpen && <span>{text}</span>}
        </Link>
    </li>
);

export default Sidebar;
