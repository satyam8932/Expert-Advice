'use client';

import { Truck, Bug, HardHat, Package, Droplets, Wrench, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

type Industry = {
    name: string;
    icon: any;
    description: string;
    useCases: string[];
    color: string;
    gradient: string;
};

const industries: Industry[] = [
    {
        name: 'Movers',
        icon: Truck,
        description: 'Streamline quotes and inventory management with video-based assessments.',
        useCases: ['Virtual home surveys', 'Automated inventory lists', 'Accurate volume estimates', 'Damage documentation'],
        color: 'blue',
        gradient: 'from-blue-500/10 to-transparent',
    },
    {
        name: 'Pest Control',
        icon: Bug,
        description: 'Identify pest types and infestation severity instantly from customer videos.',
        useCases: ['Pest identification', 'Damage assessment', 'Treatment planning', 'Follow-up verification'],
        color: 'green',
        gradient: 'from-green-500/10 to-transparent',
    },
    {
        name: 'Contractors',
        icon: HardHat,
        description: 'Get detailed site assessments before you arrive on location.',
        useCases: ['Pre-construction surveys', 'Material estimation', 'Scope documentation', 'Progress tracking'],
        color: 'orange',
        gradient: 'from-orange-500/10 to-transparent',
    },
    {
        name: 'Storage',
        icon: Package,
        description: 'Document customer belongings and facility conditions with precision.',
        useCases: ['Move-in inventory', 'Condition reports', 'Space optimization', 'Dispute resolution'],
        color: 'purple',
        gradient: 'from-purple-500/10 to-transparent',
    },
    {
        name: 'Restoration',
        icon: Droplets,
        description: 'Triage water, fire, and mold damage cases with AI-powered analysis.',
        useCases: ['Damage severity scoring', 'Equipment planning', 'Insurance documentation', 'Timeline estimation'],
        color: 'cyan',
        gradient: 'from-cyan-500/10 to-transparent',
    },
    {
        name: 'Home Services',
        icon: Wrench,
        description: 'HVAC, plumbing, electrical—diagnose issues faster with visual intelligence.',
        useCases: ['Remote diagnostics', 'Parts identification', 'Service prioritization', 'Customer education'],
        color: 'pink',
        gradient: 'from-pink-500/10 to-transparent',
    },
];

const colorMap: Record<string, { text: string; bg: string; border: string; hover: string }> = {
    blue: { text: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', hover: 'hover:border-blue-500/30' },
    green: { text: 'text-green-500 dark:text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', hover: 'hover:border-green-500/30' },
    orange: { text: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', hover: 'hover:border-orange-500/30' },
    purple: { text: 'text-purple-500 dark:text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', hover: 'hover:border-purple-500/30' },
    cyan: { text: 'text-cyan-500 dark:text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', hover: 'hover:border-cyan-500/30' },
    pink: { text: 'text-pink-500 dark:text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', hover: 'hover:border-pink-500/30' },
};

export function Industries() {
    return (
        <section className="py-15 px-4 relative overflow-hidden" id="industries">
            {/* Background Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-b from-foreground to-muted-foreground mb-4">Powering Industries Worldwide</h2>
                    <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">From movers to contractors, our AI adapts to your specific needs and delivers actionable insights instantly.</p>
                </div>

                {/* Industries Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {industries.map((industry, index) => {
                        const Icon = industry.icon;
                        const colors = colorMap[industry.color];

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`group relative p-8 rounded-2xl border border-border bg-card transition-all hover:shadow-xl ${colors.hover}`}
                            >
                                {/* Gradient Background */}
                                <div className={`absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l ${industry.gradient} pointer-events-none rounded-2xl`} />

                                {/* Icon */}
                                <div className={`relative w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border ${colors.border}`}>
                                    <Icon className={`w-7 h-7 ${colors.text}`} />
                                </div>

                                {/* Content */}
                                <div className="relative">
                                    <h3 className="text-xl font-bold text-foreground mb-3">{industry.name}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">{industry.description}</p>

                                    {/* Use Cases */}
                                    <div className="space-y-2">
                                        <div className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Key Use Cases</div>
                                        {industry.useCases.map((useCase, i) => (
                                            <div key={i} className="flex items-start gap-2">
                                                <ArrowRight className={`w-4 h-4 ${colors.text} shrink-0 mt-0.5`} />
                                                <span className="text-sm text-muted-foreground">{useCase}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Hover Effect Border */}
                                <div className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-${industry.color}-500/20 transition-all pointer-events-none`} />
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA Section */}
                <div className="mt-16 text-center">
                    <div className="inline-block p-8 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20">
                        <h3 className="text-2xl font-bold text-foreground mb-3">And Many More Industries!</h3>
                        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                            We support countless industries — these are just a few examples. Our flexible AI platform works for any business that needs video-based data collection and analysis. <span className="text-foreground font-medium">Try it now and see if it fits your needs!</span>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
