import { Hero } from '@/components/landing/hero';
import { FeatureBento } from '@/components/landing/feature-bento';
import { UseCaseTicker } from '@/components/landing/use-case-ticker';
import { PricingTable } from '@/components/landing/pricing';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';

export const metadata = {
    title: 'AdviceExpert.io | Automated Video Data Intake & Analysis',
    description: 'Capture video, auto-transcribe to JSON/Markdown, and detect objects instantly.',
};

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-[#030303] text-gray-200 selection:bg-indigo-500/30 selection:text-indigo-200">
            <Navbar />
            <div className="flex flex-col gap-24 pb-20">
                <Hero />
                <UseCaseTicker />
                <FeatureBento />
                <PricingTable />
            </div>
            <Footer />
        </main>
    );
}
