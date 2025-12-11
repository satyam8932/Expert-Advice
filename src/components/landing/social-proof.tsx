'use client';

import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

type Testimonial = {
    name: string;
    role: string;
    company: string;
    content: string;
    rating: number;
    industry: string;
};

const testimonials: Testimonial[] = [
    {
        name: 'Sarah Mitchell',
        role: 'Operations Manager',
        company: 'Premier Moving Co.',
        content: 'AdviceExpert transformed our quote process. We now get accurate inventory data from customer videos in minutes instead of scheduling in-person visits. Game changer!',
        rating: 5,
        industry: 'Movers',
    },
    {
        name: 'David Chen',
        role: 'Owner',
        company: 'PestGuard Solutions',
        content: 'The AI accurately identifies pest types and damage severity from videos. Our response time improved by 60% and customers love the convenience.',
        rating: 5,
        industry: 'Pest Control',
    },
    {
        name: 'Jennifer Rodriguez',
        role: 'Project Coordinator',
        company: 'BuildRight Contractors',
        content: 'We use it for initial site assessments. The transcription and visual analysis help us prepare accurate estimates before even visiting the site.',
        rating: 5,
        industry: 'Contractors',
    },
    {
        name: 'Michael Thompson',
        role: 'Facility Manager',
        company: 'SecureStore Facilities',
        content: 'Customer move-ins are smoother than ever. The automated inventory documentation protects both us and our clients. Highly recommend!',
        rating: 5,
        industry: 'Storage',
    },
    {
        name: 'Lisa Anderson',
        role: 'Claims Director',
        company: 'RestorePro Services',
        content: 'For water and fire damage assessments, this tool is invaluable. We can triage cases immediately and dispatch the right team with proper equipment.',
        rating: 5,
        industry: 'Restoration',
    },
    {
        name: 'Robert Kim',
        role: 'Service Manager',
        company: 'HomeHelp Pros',
        content: 'Our HVAC, plumbing, and electrical teams save hours every week. Customers send videos, we get structured data, and everyone is happier.',
        rating: 5,
        industry: 'Home Services',
    },
];

export function SocialProof() {
    return (
        <section className="py-24 px-4 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-b from-foreground to-muted-foreground mb-4">Trusted by Industry Leaders</h2>
                    <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">See how businesses across industries are transforming their operations with AI-powered video intelligence.</p>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto">
                    <div className="text-center p-6 rounded-xl bg-card border border-border">
                        <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">500+</div>
                        <div className="text-sm text-muted-foreground">Active Businesses</div>
                    </div>
                    <div className="text-center p-6 rounded-xl bg-card border border-border">
                        <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">50K+</div>
                        <div className="text-sm text-muted-foreground">Videos Processed</div>
                    </div>
                    <div className="text-center p-6 rounded-xl bg-card border border-border">
                        <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">98%</div>
                        <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                    </div>
                    <div className="text-center p-6 rounded-xl bg-card border border-border">
                        <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">4.9/5</div>
                        <div className="text-sm text-muted-foreground">Customer Rating</div>
                    </div>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative p-6 rounded-2xl border border-border bg-card hover:border-indigo-500/30 transition-all hover:shadow-lg"
                        >
                            {/* Quote Icon */}
                            <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Quote className="w-12 h-12 text-indigo-500" />
                            </div>

                            {/* Industry Badge */}
                            <div className="mb-4">
                                <span className="text-xs bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20 font-medium">{testimonial.industry}</span>
                            </div>

                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                ))}
                            </div>

                            {/* Content */}
                            <p className="text-sm text-muted-foreground leading-relaxed mb-6 relative z-10">"{testimonial.content}"</p>

                            {/* Author */}
                            <div className="border-t border-border pt-4">
                                <div className="font-semibold text-foreground text-sm">{testimonial.name}</div>
                                <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                                <div className="text-xs text-muted-foreground">{testimonial.company}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Trust Badges */}
                <div className="mt-16 text-center">
                    <p className="text-sm text-muted-foreground mb-6">Trusted and Secure</p>
                    <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
                        <div className="text-xs font-semibold text-muted-foreground tracking-wider">SOC 2 COMPLIANT</div>
                        <div className="text-xs font-semibold text-muted-foreground tracking-wider">GDPR READY</div>
                        <div className="text-xs font-semibold text-muted-foreground tracking-wider">256-BIT ENCRYPTION</div>
                        <div className="text-xs font-semibold text-muted-foreground tracking-wider">99.9% UPTIME</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
