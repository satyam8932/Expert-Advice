import { memo } from 'react';
import { User, Mail, Phone, MapPin, HelpCircle, ScrollText, FileText, AlertCircle, Sparkles } from 'lucide-react';

interface SubmissionDetailsProps {
    data: {
        first_name?: string;
        last_name?: string;
        email?: string;
        phone?: string;
        zipcode?: string;
        help_type?: string;
    };
    transcript: string | null;
    summary: string | null;
    videoSummary: string | null;
    errorMessage: string | null;
}

interface FieldProps {
    icon: React.ReactNode;
    label: string;
    value: string | undefined;
    capitalize?: boolean;
}

const Field = memo(function Field({ icon, label, value, capitalize }: FieldProps) {
    return (
        <div className="group flex flex-col gap-2 p-4 rounded-lg bg-card border border-border hover:border-indigo-500/30 transition-all duration-200">
            <div className="flex items-center gap-2 text-muted-foreground group-hover:text-indigo-400 transition-colors">
                {icon}
                <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
            </div>
            <div className={`text-sm font-medium text-foreground ${capitalize ? 'capitalize' : ''} ${!value ? 'text-muted-foreground/50' : ''}`}>{value || 'Not provided'}</div>
        </div>
    );
});

export const SubmissionDetails = memo(function SubmissionDetails({ data, transcript, summary, videoSummary, errorMessage }: SubmissionDetailsProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Field icon={<User className="w-4 h-4" />} label="First Name" value={data.first_name} />
                <Field icon={<User className="w-4 h-4" />} label="Last Name" value={data.last_name} />
                <Field icon={<Mail className="w-4 h-4" />} label="Email" value={data.email} />
                <Field icon={<Phone className="w-4 h-4" />} label="Phone" value={data.phone} />
                <Field icon={<MapPin className="w-4 h-4" />} label="Zipcode" value={data.zipcode} />
                <Field icon={<HelpCircle className="w-4 h-4" />} label="Help Type" value={data.help_type} capitalize />
            </div>

            <div className={`grid grid-cols-1 ${videoSummary ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-4`}>
                <div className="flex flex-col gap-3 p-5 rounded-lg bg-card border border-border hover:border-blue-500/30 transition-all duration-200">
                    <div className="flex items-center gap-2 text-blue-400">
                        <ScrollText className="w-5 h-5" />
                        <span className="text-sm font-semibold uppercase tracking-wide">Transcript</span>
                    </div>
                    <div className="relative">
                        <textarea
                            readOnly
                            value={transcript || 'Transcript not yet generated.'}
                            className="w-full text-sm text-foreground/90 bg-muted/50 px-4 py-3 rounded-lg border border-border resize-none min-h-[300px] font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3 p-5 rounded-lg bg-card border border-border hover:border-green-500/30 transition-all duration-200">
                    <div className="flex items-center gap-2 text-green-400">
                        <FileText className="w-5 h-5" />
                        <span className="text-sm font-semibold uppercase tracking-wide">Summary</span>
                    </div>
                    <div className="relative">
                        <textarea
                            readOnly
                            value={summary || 'Summary not yet generated.'}
                            className="w-full text-sm text-foreground/90 bg-muted/50 px-4 py-3 rounded-lg border border-border resize-none min-h-[300px] font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
                        />
                    </div>
                </div>

                {videoSummary && (
                    <div className="flex flex-col gap-3 p-5 rounded-lg bg-card border border-border hover:border-violet-500/30 transition-all duration-200">
                        <div className="flex items-center gap-2 text-violet-400">
                            <Sparkles className="w-5 h-5" />
                            <span className="text-sm font-semibold uppercase tracking-wide">AI Video Summary</span>
                        </div>
                        <div className="relative">
                            <textarea
                                readOnly
                                value={videoSummary}
                                className="w-full text-sm text-foreground/90 bg-muted/50 px-4 py-3 rounded-lg border border-border resize-none min-h-[300px] font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                            />
                        </div>
                    </div>
                )}
            </div>

            {errorMessage && (
                <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-semibold text-red-400 mb-1">Processing Error</h4>
                        <p className="text-xs text-red-300/90 leading-relaxed">{errorMessage}</p>
                    </div>
                </div>
            )}
        </div>
    );
});
