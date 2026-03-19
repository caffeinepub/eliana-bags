import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SiteFooter() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("You're subscribed! Welcome to the Eliana family.");
    setEmail("");
  };

  return (
    <footer className="bg-utility text-utility-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <p className="font-serif text-2xl tracking-widest uppercase mb-3">
              Eliana Bags
            </p>
            <p className="text-sm text-utility-foreground/70 leading-relaxed mb-5">
              Handcrafted luxury bags for the modern woman. Italian leather,
              timeless design, uncompromising quality.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 hover:bg-white/10 rounded-sm transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2 hover:bg-white/10 rounded-sm transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="p-2 hover:bg-white/10 rounded-sm transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs uppercase tracking-widest font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-utility-foreground/70">
              {[
                "New Arrivals",
                "Bags",
                "Collections",
                "Our Story",
                "Journal",
              ].map((l) => (
                <li key={l}>
                  <Link
                    to="/"
                    className="hover:text-utility-foreground transition-colors"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-xs uppercase tracking-widest font-semibold mb-4">
              About
            </h3>
            <ul className="space-y-2 text-sm text-utility-foreground/70">
              {[
                "Our Story",
                "Sustainability",
                "Craftsmanship",
                "Shipping & Returns",
                "FAQ",
              ].map((l) => (
                <li key={l}>
                  <Link
                    to="/"
                    className="hover:text-utility-foreground transition-colors"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xs uppercase tracking-widest font-semibold mb-4">
              Newsletter
            </h3>
            <p className="text-sm text-utility-foreground/70 mb-4">
              Be the first to know about new collections and exclusive offers.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-utility-foreground placeholder:text-utility-foreground/40 text-sm h-9 flex-1 min-w-0"
                data-ocid="footer.input"
              />
              <Button
                type="submit"
                className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs uppercase tracking-wider rounded-sm h-9 px-4 shrink-0"
                data-ocid="footer.submit_button"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-utility-foreground/50">
          <p>© {new Date().getFullYear()} Eliana Bags. All rights reserved.</p>
          <p>
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              className="underline hover:text-utility-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
          </p>
          <Link
            to="/admin"
            className="hover:text-utility-foreground transition-colors"
            data-ocid="nav.link"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
