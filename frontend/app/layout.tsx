import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Closet Whisperer - AI-Powered Virtual Closet",
  description: "Manage your wardrobe and get smart outfit recommendations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center space-x-8">
                  <Link href="/" className="text-xl font-bold text-gray-900">
                    👗 Closet Whisperer
                  </Link>
                  <Link
                    href="/closet"
                    className="text-gray-700 hover:text-gray-900"
                  >
                    My Closet
                  </Link>
                  <Link
                    href="/outfits"
                    className="text-gray-700 hover:text-gray-900"
                  >
                    Outfits
                  </Link>
                  <Link
                    href="/builder"
                    className="text-gray-700 hover:text-gray-900"
                  >
                    AI Builder
                  </Link>
                  <Link
                    href="/laundry"
                    className="text-gray-700 hover:text-gray-900"
                  >
                    Laundry
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
