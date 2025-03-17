import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from "@/components/admin/sidebar";
import Providers from "@/components/providers";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
        <body>
          <div className="flex">
          <Providers>
            <Sidebar />
            {children}
            </Providers>
          </div>
        </body>
      </html>
  );
}
