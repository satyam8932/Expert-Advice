'use client';

import Link from 'next/link';
import { Ghost, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
    ];

    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 py-4 px-4 transition-all duration-300">
            {/* Main Navbar Container - Floating, Blurred, Dark */}
            <div className="mx-auto max-w-7xl backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl px-4 sm:px-6 h-16 flex items-center justify-between shadow-2xl shadow-indigo-900/10">
                {/* Logo Area */}
                <Link href="/" className="flex items-center gap-2 group shrink-0">
                    <div className="p-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 group-hover:bg-indigo-500/30 transition-colors">
                        <Ghost className="w-5 h-5 text-indigo-400" />
                    </div>
                    <span className="font-bold text-white tracking-tight text-xl">
                        Advice<span className="text-indigo-400">Expert</span>.io
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => (
                        <Link key={item.label} href={item.href} className="text-sm font-medium text-gray-400 transition-colors hover:text-indigo-400">
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Action Buttons & Mobile Toggle */}
                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                    <Link href="/auth/login" className="hidden md:block text-sm font-medium text-gray-300 hover:text-indigo-400 transition-colors">
                        Sign In
                    </Link>

                    <Link href="/auth/signup" className="hidden sm:flex h-9 px-4 rounded-lg bg-indigo-600 text-white text-sm font-semibold items-center hover:bg-indigo-500 transition-all active:scale-95 shadow-md shadow-indigo-900/30">
                        Get Started
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button className="md:hidden text-gray-400 p-2 rounded-lg hover:bg-white/10 hover:text-white transition-colors" onClick={() => setIsMenuOpen(true)} aria-label="Toggle menu">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay and Panel (Responsive) */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-100 md:hidden">
                    {/* Overlay */}
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={() => setIsMenuOpen(false)} />

                    {/* Sliding Panel - Takes full height, slides from right */}
                    <div className={cn('fixed top-0 right-0 h-full w-64 bg-[#0A0A0A] border-l border-white/10 shadow-2xl transition-transform duration-300 ease-out p-6 flex flex-col space-y-6', isMenuOpen ? 'translate-x-0' : 'translate-x-full')}>
                        {/* Header & Close Button */}
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-white tracking-tight text-xl">AdviceExpert.io</span>
                            <button className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10" onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex flex-col space-y-1 pt-4">
                            {navItems.map((item) => (
                                <Link key={item.label} href={item.href} onClick={handleLinkClick} className="px-3 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors">
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Bottom Actions */}
                        <div className="flex flex-col space-y-3 pt-6 border-t border-white/10">
                            <Link href="/auth/login" onClick={handleLinkClick} className="w-full h-10 px-4 rounded-lg bg-white/5 border border-white/20 text-white text-base font-semibold flex items-center justify-center hover:bg-white/10 transition-colors">
                                Sign In
                            </Link>
                            <Link href="/auth/signup" onClick={handleLinkClick} className="w-full h-10 px-4 rounded-lg bg-indigo-600 text-white text-base font-semibold flex items-center justify-center hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-900/30">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
