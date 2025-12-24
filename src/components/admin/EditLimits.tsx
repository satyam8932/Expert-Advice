'use client';

import { useState } from 'react';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface EditLimitsProps {
    userId: string;
    userName: string;
    limits: {
        storageLimitBytes: number | null;
        formsLimit: number | null;
        submissionsLimit: number | null;
        audioMinutesLimit: number | null;
        videoMinutesLimit: number | null;
        videoIntelligenceEnabled: boolean | null;
    } | null;
    onUpdate: () => void;
}

export default function EditLimits({ userId, userName, limits, onUpdate }: EditLimitsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        storageLimitBytes: limits?.storageLimitBytes || 10737418240,
        formsLimit: limits?.formsLimit || 5,
        submissionsLimit: limits?.submissionsLimit || 20,
        audioMinutesLimit: limits?.audioMinutesLimit || 120,
        videoMinutesLimit: limits?.videoMinutesLimit || 0,
        videoIntelligenceEnabled: limits?.videoIntelligenceEnabled || false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(`/api/admin/users/${userId}/limits`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to update limits');

            toast.success(`Limits updated for ${userName}`);
            setIsOpen(false);
            onUpdate();
        } catch (error) {
            toast.error('Failed to update limits');
        } finally {
            setIsLoading(false);
        }
    };

    const formatBytesToGB = (bytes: number) => (bytes / (1024 * 1024 * 1024)).toFixed(2);
    const formatGBToBytes = (gb: number) => Math.floor(gb * 1024 * 1024 * 1024);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-purple-500 hover:text-purple-400 hover:bg-purple-500/10">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit Limits
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Limits for {userName}</DialogTitle>
                    <DialogDescription>Update user resource limits and feature access</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                        <div className="grid gap-2">
                            <Label htmlFor="storage">Storage Limit (GB)</Label>
                            <Input id="storage" type="number" step="0.01" value={formatBytesToGB(formData.storageLimitBytes)} onChange={(e) => setFormData({ ...formData, storageLimitBytes: formatGBToBytes(parseFloat(e.target.value)) })} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="forms">Forms Limit</Label>
                            <Input id="forms" type="number" value={formData.formsLimit} onChange={(e) => setFormData({ ...formData, formsLimit: parseInt(e.target.value) })} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="submissions">Submissions Limit</Label>
                            <Input id="submissions" type="number" value={formData.submissionsLimit} onChange={(e) => setFormData({ ...formData, submissionsLimit: parseInt(e.target.value) })} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="audioMinutes">Audio Minutes Limit</Label>
                            <Input id="audioMinutes" type="number" value={formData.audioMinutesLimit} onChange={(e) => setFormData({ ...formData, audioMinutesLimit: parseInt(e.target.value) })} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="videoMinutes">Video Minutes Limit</Label>
                            <Input id="videoMinutes" type="number" value={formData.videoMinutesLimit} onChange={(e) => setFormData({ ...formData, videoMinutesLimit: parseInt(e.target.value) })} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="videoAI" checked={formData.videoIntelligenceEnabled} onCheckedChange={(checked: boolean) => setFormData({ ...formData, videoIntelligenceEnabled: checked })} />
                            <Label htmlFor="videoAI" className="cursor-pointer">
                                Video Intelligence Enabled
                            </Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
