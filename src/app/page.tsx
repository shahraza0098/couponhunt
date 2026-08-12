import Link from 'next/link';
import { getPopularStores } from '@/lib/queries/stores';
import { getFeaturedCoupons } from '@/lib/queries/coupons';
import { getFeaturedDeals } from '@/lib/queries/deals';
import { getFeaturedCategories } from '@/lib/queries/categories';
import StoreCard from '@/components/ui/StoreCard';
import CouponCard from '@/components/ui/CouponCard';
import DealCard from '@/components/ui/DealCard';
import CategoryCard from '@/components/ui/CategoryCard';
import { Store, ShoppingBag } from 'lucide-react';

export default async function HomePage() {
  const [stores, coupons, deals, categories] = await Promise.all([
    getPopularStores(12),
    getFeaturedCoupons(8),
    getFeaturedDeals(8),
    getFeaturedCategories(8),
  ]);

  return (
    <div className="animate-fade-in bg-background min-h-screen pb-20">
      
      {/* ======================== HERO (Splash Style) ======================== */}
      <section className="bg-white pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-b border-border text-center relative overflow-hidden" id="hero">
        
        {/* Faint Background pattern / logos (mimicking first screen) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex flex-wrap justify-center gap-8 pt-10">
          {stores.map((s, i) => (
             <div key={i} className="text-4xl text-black flex items-center justify-center">
                {s.logo && s.logo.startsWith('http') ? <img src={s.logo} alt="logo" className="w-10 h-10 object-contain grayscale" /> : <Store className="w-10 h-10" />}
             </div>
          ))}
        </div>

        <div className="relative z-10 max-w-3xl mx-auto mt-8">
          <p className="text-red-600 font-bold tracking-widest text-sm uppercase mb-3">Welcome to CouponHunt</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground uppercase leading-[1.1] mb-6">
            Smart Savings<br/>With a Smart<br/>Choice
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-10 leading-relaxed font-medium">
            Discover verified promo codes, exclusive discounts, and hot deals from top stores. Save money on every purchase.
          </p>

          <Link href="#hot-deals">
            <button className="bg-primary text-black font-black uppercase tracking-wider py-4 px-10 rounded-xl w-full max-w-sm hover:scale-[1.02] transition-transform shadow-sm text-lg">
              Start Hunting
            </button>
          </Link>
        </div>
      </section>

      {/* ======================== FEATURED BANNER (Red Promo) ======================== */}
      <section className="px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 max-w-7xl mx-auto">
        <div className="bg-secondary rounded-2xl p-6 sm:p-8 flex items-center justify-between shadow-md overflow-hidden relative">
          
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-black/10 transform skew-x-12 translate-x-10 pointer-events-none" />
          
          <div className="relative z-10 text-white w-full">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Featured</span>
              <span className="font-bold text-sm tracking-wide">AMAZON</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase mb-1">Get 40% Off</h2>
            <p className="text-white/90 font-medium text-sm sm:text-base mb-4">On orders over $50</p>
            
            <div className="inline-flex bg-primary text-black font-black uppercase rounded-lg overflow-hidden items-center group cursor-pointer shadow-sm">
               <span className="px-4 py-2 text-sm border-r border-black/10">Promo Code</span>
               <span className="px-4 py-2 text-sm bg-white group-hover:bg-gray-100 transition-colors">SAVE40</span>
            </div>
          </div>
          
          <div className="relative z-10 hidden sm:block">
             <ShoppingBag className="w-28 h-28 text-white opacity-80" strokeWidth={1.5} />
          </div>
        </div>
      </section>

      {/* ======================== CATEGORIES (Pills) ======================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-foreground uppercase tracking-wide">Categories</h2>
          <Link href="/categories" className="text-red-500 font-bold text-xs uppercase tracking-wider hover:underline">See All</Link>
        </div>
        <div className="flex overflow-x-auto gap-3 pb-4 snap-x hide-scrollbar">
          <Link href="/categories" className="group flex items-center gap-2 bg-primary text-black font-bold border-none rounded-full py-2 px-5 shadow-sm min-w-max snap-start hover:scale-105 transition-transform">
             <span className="uppercase text-xs tracking-wider">All Categories</span>
          </Link>
          {categories.map((cat) => (
            <div key={cat.id} className="snap-start">
               <CategoryCard {...cat} couponCount={cat._count.coupons} dealCount={cat._count.deals} />
            </div>
          ))}
        </div>
      </section>

      {/* ======================== TOP STORES ======================== */}
      <section className="bg-white py-10 mt-6 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-black text-foreground uppercase tracking-wide">Top Stores</h2>
            <Link href="/stores" className="text-red-500 font-bold text-xs uppercase tracking-wider hover:underline">See All</Link>
          </div>
          
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
            {stores.map((store) => (
              <div key={store.id} className="snap-start w-24 sm:w-32 flex-shrink-0">
                <StoreCard
                  name={store.name}
                  slug={store.slug}
                  logo={store.logo}
                  shortDescription={store.shortDescription}
                  couponCount={store._count.coupons}
                  dealCount={store._count.deals}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== HOT OFFERS (Deals) ======================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10" id="hot-deals">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-black text-foreground uppercase tracking-wide">Hot Offers</h2>
          <Link href="/deals" className="text-red-500 font-bold text-xs uppercase tracking-wider hover:underline">See All</Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-grid">
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              {...deal}
              originalPrice={deal.originalPrice ? Number(deal.originalPrice) : null}
              salePrice={deal.salePrice ? Number(deal.salePrice) : null}
              discountValue={deal.discountValue ? Number(deal.discountValue) : null}
              storeName={deal.store.name}
              storeSlug={deal.store.slug}
              storeLogo={deal.store.logo}
            />
          ))}
        </div>
      </section>

      {/* ======================== STORE COUPONS ======================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-10" id="featured-coupons">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-black text-foreground uppercase tracking-wide">Store Coupons</h2>
          <Link href="/coupons" className="text-red-500 font-bold text-xs uppercase tracking-wider hover:underline">See All</Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-grid">
          {coupons.map((coupon) => (
            <CouponCard
              key={coupon.id}
              {...coupon}
              discountValue={coupon.discountValue ? Number(coupon.discountValue) : null}
              storeName={coupon.store.name}
              storeSlug={coupon.store.slug}
              storeLogo={coupon.store.logo}
            />
          ))}
        </div>
      </section>
      
      {/* Utility style for hide scrollbar locally */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
