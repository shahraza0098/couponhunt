'use client';

import Link from 'next/link';
import { useState } from 'react';
import SearchBar from './SearchBar';
import MobileMenu from './MobileMenu';

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
      <header className="sticky top-0 z-50 glass-strong" id="header">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0"
              id="logo"
            >
              <span className="text-2xl">🎯</span>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                CouponHunt
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1" id="desktop-nav">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-[--ch-text-muted] hover:text-[--ch-text] rounded-lg hover:bg-white/5 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Search */}
            <div className="hidden sm:block flex-1 max-w-md">
              <SearchBar />
            </div>

            {/* Mobile burger */}
            <button
              className="md:hidden p-2 text-[--ch-text-muted] hover:text-[--ch-text] transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              id="mobile-menu-btn"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
          </div>

          {/* Mobile search - below header */}
          <div className="sm:hidden pb-3">
            <SearchBar />
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
