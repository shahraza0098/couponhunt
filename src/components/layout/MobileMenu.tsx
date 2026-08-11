'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import SearchBar from './SearchBar';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: Array<{ href: string; label: string }>;
}

export default function MobileMenu({ isOpen, onClose, links }: MobileMenuProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]" id="mobile-menu">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-72 bg-[--ch-bg-alt] border-l border-[--ch-border] animate-slide-down shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[--ch-border]">
          <span className="text-lg font-semibold text-[--ch-text]">Menu</span>
          <button
            onClick={onClose}
            className="p-2 text-[--ch-text-muted] hover:text-[--ch-text] transition-colors"
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <SearchBar />
        </div>

        {/* Links */}
        <nav className="flex-1 px-4 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="flex items-center px-4 py-3 text-[--ch-text-muted] hover:text-[--ch-text] hover:bg-white/5 rounded-lg transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Brand */}
        <div className="p-4 border-t border-[--ch-border]">
          <p className="text-xs text-[--ch-text-faint] text-center">
            © {new Date().getFullYear()} CouponHunt
          </p>
        </div>
      </div>
    </div>
  );
}
