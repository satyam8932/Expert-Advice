'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to submit');
            }

            setIsSuccess(true);
            toast.success("Message sent successfully! We'll get back to you soon.");
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error: any) {
            toast.error(error.message || 'Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-8 sm:p-12 shadow-2xl shadow-black/5 text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </div>
                </div>
                <h3 className="text-2xl font-bold mb-3">Message Sent!</h3>
                <p className="text-muted-foreground mb-6">Thank you for reaching out. We've received your message and will get back to you as soon as possible.</p>
                <Button onClick={() => setIsSuccess(false)} variant="outline" className="border-border/50 hover:bg-accent">
                    Send Another Message
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/5">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                            Your Name <span className="text-destructive">*</span>
                        </Label>
                        <Input id="name" type="text" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="bg-background/50 border-border/50 focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email Address <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="bg-background/50 border-border/50 focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-medium">
                        Subject <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="subject"
                        type="text"
                        placeholder="How can we help you?"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        className="bg-background/50 border-border/50 focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium">
                        Message <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                        id="message"
                        placeholder="Tell us more about your inquiry..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        rows={6}
                        className="bg-background/50 border-border/50 focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all resize-none"
                    />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 h-11 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
}
