"use client";

import Link from "next/link";
import { Menu, X, Hexagon } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#060913]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Hexagon className="w-5 h-5 text-white fill-white/20" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Scribe
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="/#features" className="hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/pricing#faq" className="hover:text-white transition-colors">
              FAQ
            </Link>
            <Link href="/#enterprise" className="hover:text-white transition-colors">
              Enterprise
            </Link>
          </nav>

          {/* Desktop Auth Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-medium text-white hover:text-blue-400 transition-colors"
            >
              Sign in
            </Link>
            <Link 
              href="/signup" 
              className="text-sm font-medium bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-muted-foreground hover:text-white p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#060913] border-b border-white/5 pb-6 px-6">
          <div className="flex flex-col gap-4 pt-4 pb-6 border-b border-white/5">
            <Link 
              href="/#features" 
              className="text-base font-medium text-muted-foreground hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="/pricing" 
              className="text-base font-medium text-muted-foreground hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="/pricing#faq" 
              className="text-base font-medium text-muted-foreground hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <Link 
              href="/#enterprise" 
              className="text-base font-medium text-muted-foreground hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Enterprise
            </Link>
          </div>
          <div className="flex flex-col gap-3 pt-6">
            <Link 
              href="/login" 
              className="w-full text-center py-3 text-base font-medium text-white border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign in
            </Link>
            <Link 
              href="/signup" 
              className="w-full text-center py-3 text-base font-medium bg-white text-blue-600 rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}