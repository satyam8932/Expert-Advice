import { Metadata } from 'next';
import SettingsWrapper from '@/components/settings/SettingsWrapper';

export const metadata: Metadata = {
    title: 'Settings | AdviceExpert.io',
};

export default function SettingsPage() {
    return <SettingsWrapper />;
}
