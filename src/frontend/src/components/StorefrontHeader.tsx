import { Link } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";

const NAV_LINKS = [
  { label: "New Arrivals", href: "/?category=new" },
  { label: "Bags", href: "/?category=All" },
  { label: "Collections", href: "/?category=All" },
  { label: "Our Story", href: "/#story" },
];

export default function StorefrontHeader() {
  const { count, setIsOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-xs">
      {/* Utility Strip */}
      <div className="bg-utility text-utility-foreground py-1.5 text-center text-xs tracking-widest uppercase">
        <span>Free shipping on orders over $200</span>
        <span className="mx-3 opacity-40">|</span>
        <span>New collection available now</span>
      </div>

      {/* Primary Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Brand */}
          <Link
            to="/"
            className="font-serif text-2xl md:text-3xl tracking-widest uppercase text-foreground hover:text-muted-foreground transition-colors"
            data-ocid="nav.link"
          >
            Eliana Bags
          </Link>

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-foreground tracking-wide transition-colors uppercase"
                data-ocid="nav.link"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Icon Row */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              type="button"
              className="hidden md:flex p-2 rounded-sm hover:bg-secondary transition-colors"
              aria-label="Search"
              data-ocid="nav.search_input"
            >
              <Search className="h-4 w-4 text-foreground" />
            </button>
            <button
              type="button"
              className="hidden md:flex p-2 rounded-sm hover:bg-secondary transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="h-4 w-4 text-foreground" />
            </button>
            <Link
              to="/admin"
              className="hidden md:flex p-2 rounded-sm hover:bg-secondary transition-colors"
              aria-label="Account"
              data-ocid="nav.link"
            >
              <User className="h-4 w-4 text-foreground" />
            </Link>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="relative p-2 rounded-sm hover:bg-secondary transition-colors"
              aria-label="Cart"
              data-ocid="nav.button"
            >
              <ShoppingBag className="h-4 w-4 text-foreground" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
            <button
              type="button"
              className="md:hidden p-2"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-border px-4 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block text-sm font-medium uppercase tracking-wide py-2"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/admin"
            className="block text-sm font-medium uppercase tracking-wide py-2"
          >
            Admin
          </Link>
        </div>
      )}
    </header>
  );
}
