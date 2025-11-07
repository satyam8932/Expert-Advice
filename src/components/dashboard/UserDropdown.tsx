'use client';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HelpCircle, LogOut, ChevronDown, Settings, LayoutDashboard, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { getInitials } from '@/lib/getInitials';

interface UserData {
    name: string;
    email: string;
    profilePhoto?: string | null;
}

interface UserDropdownProps {
    user: UserData;
    onLogout: () => void;
}

export default function UserDropdown({ user, onLogout }: UserDropdownProps) {
    const router = useRouter();

    const avatarUrl = user.profilePhoto || `https://avatar.vercel.sh/${user.email}`;
    const initials = getInitials(user.name);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2 py-1.5 h-auto rounded-full hover:bg-gray-100 transition-colors">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                        <AvatarImage src={avatarUrl} alt={user.name} />
                        <AvatarFallback className="bg-linear-to-br from-indigo-600 to-purple-600 text-white text-xs sm:text-sm font-semibold">{initials}</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-gray-500 hidden sm:block" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-64 p-1 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg rounded-xl" sideOffset={8}>
                <div className="flex items-center gap-3 px-2 py-3 mb-2">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={avatarUrl} alt={user.name} />
                        <AvatarFallback className="bg-linear-to-br from-indigo-600 to-purple-600 text-white text-sm font-semibold">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                </div>

                <DropdownMenuSeparator className="bg-gray-100" />

                <DropdownMenuItem onClick={() => router.push('/dashboard')} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <LayoutDashboard className="h-4 w-4 text-gray-500" />
                    Dashboard
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push('/dashboard/billings')} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    Billings
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push('/dashboard/settings')} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <Settings className="h-4 w-4 text-gray-500" />
                    Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-gray-100 my-2" />

                <DropdownMenuItem onClick={() => router.push('/help')} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <HelpCircle className="h-4 w-4 text-gray-500" />
                    Help center
                </DropdownMenuItem>

                <DropdownMenuItem onClick={onLogout} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500 rounded-lg cursor-pointer transition-colors hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600">
                    <LogOut className="h-4 w-4 text-red-500" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
