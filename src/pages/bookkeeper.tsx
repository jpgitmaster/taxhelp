import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function BookkeeperLanding() {
  return (
    <>
      <Head>
        <title>Bookkeeper Portal | TaxHelp</title>
        <meta name="description" content="Bookkeeper portal for TaxHelp. Manage clients, books, and more." />
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-100 to-blue-300 px-4 py-12 relative overflow-hidden">
        {/* Background image */}
        <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80" alt="Accounting Background" className="absolute inset-0 w-full h-full object-cover z-0 opacity-30" />
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-xl p-10 max-w-lg w-full flex flex-col items-center relative overflow-hidden z-10">
          <div className="absolute -top-10 -right-10 opacity-20 pointer-events-none select-none">
            <img src="https://img.icons8.com/ios-filled/200/4f8ef7/accounting.png" alt="Bookkeeper Icon" className="w-32 h-32" />
          </div>
          <h1 className="text-3xl font-extrabold text-blue-800 mb-2 z-10">Bookkeeper Portal</h1>
          <p className="text-blue-700 mb-6 text-center z-10">Access your dashboard, manage clients, and keep books up to date.</p>
          <ul className="mb-8 text-blue-700 text-sm z-10 list-disc pl-6 w-full max-w-xs text-left">
            <li>Client Management</li>
            <li>Bookkeeping Tools</li>
            <li>Secure Document Upload</li>
            <li>Real-time Notifications</li>
          </ul>
          <div className="flex flex-col gap-4 w-full z-10">
            <Link href="/bookkeeper/login" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow text-center transition">Login</Link>
            <Link href="/bookkeeper/register" className="bg-white border border-blue-600 text-blue-700 font-semibold py-3 rounded-lg shadow text-center hover:bg-blue-50 transition">Register</Link>
          </div>
        </div>
      </div>
    </>
  );
}
