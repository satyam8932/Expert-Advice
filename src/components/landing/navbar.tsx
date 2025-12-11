'use client';

import Link from 'next/link';
import { Ghost, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 py-4 px-4 transition-all duration-300">
            {/* Main Navbar Container - Floating, Blurred, Dynamic Background */}
            <div className="mx-auto max-w-7xl backdrop-blur-xl bg-background/80 border border-border rounded-2xl px-4 sm:px-6 h-16 flex items-center justify-between shadow-2xl shadow-indigo-900/10">
                {/* Logo Area */}
                <Link href="/" className="flex items-center gap-2 group shrink-0">
                    <div className="p-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 group-hover:bg-indigo-500/30 transition-colors">
                        <Ghost className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <span className="font-bold text-foreground tracking-tight text-xl">
                        Advice<span className="text-indigo-600 dark:text-indigo-400">Expert</span>.io
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Features
                    </Link>
                    <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        How it Works
                    </Link>
                    <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Pricing
                    </Link>
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/auth/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Sign In
                    </Link>
                    <Link href="/auth/signup" className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95">
                        Get Started
                    </Link>

                    <ThemeToggle />
                </div>

                {/* Mobile Menu Toggle */}
                <div className="flex items-center gap-4 md:hidden">
                    <ThemeToggle />
                    <button className="text-muted-foreground p-2 rounded-lg hover:bg-muted transition-colors" onClick={() => setIsMenuOpen(true)} aria-label="Toggle menu">
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
                    <div className={cn('fixed top-0 right-0 h-full w-64 bg-background border-l border-border shadow-2xl transition-transform duration-300 ease-out p-6 flex flex-col space-y-6', isMenuOpen ? 'translate-x-0' : 'translate-x-full')}>
                        {/* Header & Close Button */}
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-foreground tracking-tight text-xl">AdviceExpert.io</span>
                            <button onClick={() => setIsMenuOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Mobile Links */}
                        <nav className="flex flex-col space-y-4">
                            <Link href="#features" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsMenuOpen(false)}>
                                Features
                            </Link>
                            <Link href="#how-it-works" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsMenuOpen(false)}>
                                How it Works
                            </Link>
                            <Link href="#pricing" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsMenuOpen(false)}>
                                Pricing
                            </Link>
                        </nav>

                        {/* Mobile Actions */}
                        <div className="mt-auto flex flex-col gap-3">
                            <Link href="/auth/login" className="w-full py-3 text-center rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-colors" onClick={() => setIsMenuOpen(false)}>
                                Sign In
                            </Link>
                            <Link href="/auth/signup" className="w-full py-3 text-center rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20" onClick={() => setIsMenuOpen(false)}>
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
