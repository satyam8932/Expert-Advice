'use client';

import { useState } from 'react';
import { Shield, ShieldOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface EditAdminStatusProps {
    userId: string;
    userName: string;
    isSuper: boolean;
    onUpdate: () => void;
}

export default function EditAdminStatus({ userId, userName, isSuper, onUpdate }: EditAdminStatusProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isSuper: !isSuper }),
            });

            if (!res.ok) throw new Error('Failed to update admin status');

            toast.success(`${userName} is now ${!isSuper ? 'an admin' : 'a regular user'}`);
            setIsOpen(false);
            onUpdate();
        } catch (error) {
            toast.error('Failed to update admin status');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className={isSuper ? 'text-orange-500 hover:text-orange-400 hover:bg-orange-500/10' : 'text-blue-500 hover:text-blue-400 hover:bg-blue-500/10'}>
                    {isSuper ? <ShieldOff className="w-4 h-4 mr-1" /> : <Shield className="w-4 h-4 mr-1" />}
                    {isSuper ? 'Remove Admin' : 'Make Admin'}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{isSuper ? 'Remove Admin Access' : 'Grant Admin Access'}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {isSuper ? `Are you sure you want to remove admin access from ${userName}? They will no longer be able to access the admin panel.` : `Are you sure you want to grant admin access to ${userName}? They will be able to access the admin panel and manage all users.`}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleToggle();
                        }}
                        disabled={isLoading}
                        className={isSuper ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-500 hover:bg-blue-600'}
                    >
                        {isLoading ? 'Updating...' : 'Confirm'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
