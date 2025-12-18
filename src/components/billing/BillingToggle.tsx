'use client';

interface BillingToggleProps {
    isYearly: boolean;
    onToggle: () => void;
    discountPercent: number;
}

export function BillingToggle({ isYearly, onToggle, discountPercent }: BillingToggleProps) {
    return (
        <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium transition-colors ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
            <button onClick={onToggle} className={`relative w-14 h-7 rounded-full transition-colors ${isYearly ? 'bg-indigo-600' : 'bg-muted'}`}>
                <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${isYearly ? 'translate-x-7' : ''}`} />
            </button>
            <span className={`text-sm font-medium transition-colors ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
                Yearly <span className="text-green-500 text-xs font-semibold">Save {discountPercent}%</span>
            </span>
        </div>
    );
}
