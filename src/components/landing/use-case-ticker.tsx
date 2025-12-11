'use client';

import { motion } from 'framer-motion';

const brands = ['Insurance Claims', 'Pest Control', 'Construction Audits', 'Contractors', 'Logistics Tracking', 'Equipment Rental', 'Movers', 'Storage', 'Restoration', 'Home Services'];

export function UseCaseTicker() {
    return (
        <div className="w-full py-5 bg-white/5 border-y border-white/10 overflow-hidden flex relative z-0">
            <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                    maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                }}
            />

            <motion.div
                className="flex gap-20 items-center whitespace-nowrap"
                // Moving from 0% to -50% creates the seamless loop with the duplicated list
                animate={{ x: ['0%', '-50%'] }}
                transition={{
                    repeat: Infinity,
                    duration: 50,
                    ease: 'linear',
                }}
            >
                {[...brands, ...brands, ...brands, ...brands].map((brand, index) => (
                    <div key={index} className="flex items-center gap-20">
                        <span className="text-base sm:text-lg font-medium text-gray-400 uppercase tracking-widest cursor-default hover:text-white transition-colors duration-300">{brand}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600/50" />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
