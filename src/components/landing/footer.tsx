import Link from 'next/link';
import { Ghost, Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t border-border bg-background pt-16 md:pt-20 pb-8 md:pb-10">
            <div className="container mx-auto px-4">
                {/* Main Grid - Responsive Layout */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 mb-12 md:mb-16">
                    {/* Brand Column */}
                    <div className="col-span-2 sm:col-span-3 lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6 group w-fit">
                            <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                                <Ghost className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                            </div>
                            <span className="font-bold text-foreground tracking-tight text-xl">
                                Advice<span className="text-indigo-600 dark:text-indigo-400">Expert</span>.io
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mb-8">Empowering experts to monetize their knowledge through seamless video consultations.</p>
                    </div>

                    {/* Links Columns (Stacked nicely on mobile, inline on tablet+) */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-semibold text-foreground text-base mb-1">Product</h4>
                        <Link href="#features" className="text-sm text-muted-foreground hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                            Features
                        </Link>
                        <Link href="#pricing" className="text-sm text-muted-foreground hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                            Pricing
                        </Link>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                            Integrations
                        </Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="font-semibold text-foreground text-base mb-1">Resources</h4>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                            Documentation
                        </Link>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                            API Reference
                        </Link>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                            Blog
                        </Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="font-semibold text-foreground text-base mb-1">Legal</h4>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="/contact" className="text-sm text-muted-foreground hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                            Contact Us
                        </Link>
                    </div>
                </div>

                {/* Bottom Bar: Copyright and Social Icons */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-600 text-sm order-2 md:order-1">© {new Date().getFullYear()} AdviceExpert.io Inc. All rights reserved.</p>

                    <div className="flex items-center gap-6 order-1 md:order-2">
                        <a href="#" className="text-gray-500 hover:text-indigo-400 transition-colors" aria-label="Twitter">
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-gray-500 hover:text-indigo-400 transition-colors" aria-label="GitHub">
                            <Github className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-gray-500 hover:text-indigo-400 transition-colors" aria-label="LinkedIn">
                            <Linkedin className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
