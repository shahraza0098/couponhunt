import Link from 'next/link';

const footerLinks = {
  explore: [
    { href: '/stores', label: 'All Stores' },
    { href: '/coupons', label: 'All Coupons' },
    { href: '/deals', label: 'All Deals' },
    { href: '/categories', label: 'Categories' },
  ],
  categories: [
    { href: '/categories/electronics', label: 'Electronics' },
    { href: '/categories/fashion', label: 'Fashion' },
    { href: '/categories/food-dining', label: 'Food & Dining' },
    { href: '/categories/travel', label: 'Travel' },
  ],
  popular: [
    { href: '/stores/amazon-india', label: 'Amazon India' },
    { href: '/stores/flipkart', label: 'Flipkart' },
    { href: '/stores/myntra', label: 'Myntra' },
    { href: '/stores/swiggy', label: 'Swiggy' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-[--ch-border] mt-auto" id="footer">
      {/* Gradient accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🎯</span>
              <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                CouponHunt
              </span>
            </Link>
            <p className="text-sm text-[--ch-text-muted] leading-relaxed max-w-xs">
              Find the best coupons, promo codes, and deals from top Indian stores. Save money on every purchase.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold text-[--ch-text] mb-4 uppercase tracking-wider">
              Explore
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[--ch-text-muted] hover:text-emerald-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-[--ch-text] mb-4 uppercase tracking-wider">
              Categories
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[--ch-text-muted] hover:text-emerald-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Stores */}
          <div>
            <h3 className="text-sm font-semibold text-[--ch-text] mb-4 uppercase tracking-wider">
              Popular Stores
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.popular.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[--ch-text-muted] hover:text-emerald-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-[--ch-border] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[--ch-text-faint]">
            © {new Date().getFullYear()} CouponHunt. All rights reserved.
          </p>
          <p className="text-xs text-[--ch-text-faint]">
            Prices and offers are subject to change. Always verify on the store website.
          </p>
        </div>
      </div>
    </footer>
  );
}
