import Link from 'next/link';
import { Ghost, Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-[#0A0A0A] pt-16 md:pt-20 pb-8 md:pb-10">
            <div className="container mx-auto px-4">
                {/* Main Grid - Responsive Layout */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 mb-12 md:mb-16">
                    {/* Brand Column (Span 2 on mobile, 2 on tablet, 2 on large) */}
                    <div className="col-span-2 sm:col-span-3 lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4 group">
                            <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                                <Ghost className="w-6 h-6 text-indigo-400" />
                            </div>
                            <span className="font-bold text-white tracking-tight text-xl">
                                Advice<span className="text-indigo-400">Expert</span>.io
                            </span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-sm">Automate your data intake with AI-powered video forms. Turn raw footage into actionable data and business insights instantly.</p>
                    </div>

                    {/* Links Columns (Stacked nicely on mobile, inline on tablet+) */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-semibold text-white text-base mb-1">Product</h4>
                        <Link href="#features" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">
                            Features
                        </Link>
                        <Link href="#pricing" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">
                            Pricing
                        </Link>
                        <Link href="#" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">
                            Roadmap
                        </Link>
                        <Link href="#" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">
                            Changelog
                        </Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="font-semibold text-white text-base mb-1">Resources</h4>
                        <Link href="#" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">
                            Documentation
                        </Link>
                        <Link href="#" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">
                            Help Center
                        </Link>
                        <Link href="#" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">
                            Careers
                        </Link>
                        <Link href="#" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">
                            Community
                        </Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="font-semibold text-white text-base mb-1">Legal</h4>
                        <Link href="#" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="#" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">
                            Security
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
