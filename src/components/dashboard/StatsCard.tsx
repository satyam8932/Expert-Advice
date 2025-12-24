import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getIcon } from './IconMap';

interface StatsCardProps {
    label: string;
    value: string | number;
    subtitle?: string;
    iconName: string;
    color: 'indigo' | 'green' | 'yellow' | 'pink' | 'purple';
}

const colorMap = {
    indigo: { accent: 'text-indigo-600 dark:text-indigo-400', background: 'bg-indigo-500/10 border-indigo-500/20' },
    green: { accent: 'text-green-600 dark:text-green-400', background: 'bg-green-500/10 border-green-500/20' },
    yellow: { accent: 'text-yellow-600 dark:text-yellow-400', background: 'bg-yellow-500/10 border-yellow-500/20' },
    pink: { accent: 'text-pink-600 dark:text-pink-400', background: 'bg-pink-500/10 border-pink-500/20' },
    purple: { accent: 'text-purple-600 dark:text-purple-400', background: 'bg-purple-500/10 border-purple-500/20' },
};

export default function StatsCard({ label, value, subtitle, iconName, color }: StatsCardProps) {
    const { accent, background } = colorMap[color];
    const Icon = getIcon(iconName);

    return (
        <Card className="bg-card border-border shadow-xl hover:border-indigo-500/20 transition-colors duration-200">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground mb-1 tracking-wider">{label}</p>
                        <h3 className="text-3xl font-bold text-foreground mb-2">{value}</h3>
                        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
                    </div>
                    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center border', background)}>
                        <Icon className={cn('w-5 h-5', accent)} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
