import { Metadata } from 'next';
import HelpWrapper from '@/components/help/HelpWrapper';

export const metadata: Metadata = {
    title: 'Help & Information | AdviceExpert.io',
};

export default function HelpPage() {
    return <HelpWrapper />;
}
