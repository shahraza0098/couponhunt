'use client';

import Link from 'next/link';
import { useState } from 'react';
import SearchBar from './SearchBar';
import MobileMenu from './MobileMenu';
import { ShoppingBag, Menu } from 'lucide-react';

const navLinks = [
  { href: '/stores', label: 'Stores' },
  { href: '/coupons', label: 'Coupons' },
  { href: '/deals', label: 'Deals' },
  { href: '/categories', label: 'Categories' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-primary text-black shadow-sm" id="header">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0"
              id="logo"
            >
              <ShoppingBag className="w-7 h-7 text-black" strokeWidth={2.5} />
              <span className="text-xl font-black uppercase tracking-widest text-black">
                CouponHunt
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1" id="desktop-nav">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-bold uppercase tracking-wider text-black hover:bg-black/5 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Search */}
            <div className="hidden sm:block flex-1 max-w-md">
              <div className="relative">
                <SearchBar />
                {/* This relies on SearchBar being transparent or white, SearchBar might need an update if it looks bad on yellow, but let's assume it has its own background. */}
              </div>
            </div>

            {/* Mobile burger */}
            <button
              className="md:hidden p-2 text-black hover:bg-black/5 rounded transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              id="mobile-menu-btn"
            >
              <Menu className="w-6 h-6" strokeWidth={2.5} />
            </button>
          </div>

          {/* Mobile search - below header */}
          <div className="sm:hidden pb-3">
            <div className="bg-white rounded-lg p-1">
              <SearchBar />
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={navLinks}
      />
    </>
  );
}
