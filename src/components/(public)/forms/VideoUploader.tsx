'use client';
import { useRef, DragEvent, useState, useEffect } from 'react';
import { Upload, Video as VideoIcon, X, CheckCircle2, Camera, Loader2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import MobileVideoCapture from './MobileVideoCapture';
import { VideoSource } from '@/lib/types/video-recorder.types';
import { supabaseClient } from '@/supabase/client';
import { toast } from 'sonner';

const VideoRecorder = dynamic(() => import('./VideoRecorder'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center aspect-video bg-muted rounded-xl border border-border">
            <div className="text-muted-foreground flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading camera...
            </div>
        </div>
    ),
});

interface VideoUploaderProps {
    videoUrl: string;
    isUploading: boolean;
    onUploadStart: () => void;
    onUploadComplete: (url: string) => void;
    onUploadError: (error: string) => void;
    formId: string;
}

export default function VideoUploader({ videoUrl, isUploading, onUploadStart, onUploadComplete, onUploadError, formId }: VideoUploaderProps) {
    const uploadInputRef = useRef<HTMLInputElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedSource, setSelectedSource] = useState<VideoSource | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [currentFileName, setCurrentFileName] = useState<string>('');

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
        };
        checkMobile();
    }, []);

    async function uploadToSupabase(file: File) {
        try {
            onUploadStart();
            setError(null);
            setUploadProgress(0);
            setCurrentFileName(file.name);

            const fileExt = file.name.split('.').pop();
            const fileName = `${formId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const bucketName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET!;

            await uploadWithProgress(bucketName, fileName, file);

            const {
                data: { publicUrl },
            } = supabaseClient.storage.from(bucketName).getPublicUrl(fileName);

            setUploadProgress(100);
            onUploadComplete(publicUrl);
            toast.success('Video uploaded successfully!');
        } catch (err: any) {
            console.error('Upload error:', err);
            const errorMsg = err.message || 'Failed to upload video';
            setError(errorMsg);
            onUploadError(errorMsg);
            toast.error(errorMsg);
        }
    }

    function uploadWithProgress(bucketName: string, fileName: string, file: File): Promise<void> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentComplete = Math.round((e.loaded / e.total) * 100);
                    setUploadProgress(percentComplete);
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    resolve();
                } else {
                    reject(new Error(`Upload failed with status ${xhr.status}`));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Network error during upload'));
            });

            xhr.addEventListener('abort', () => {
                reject(new Error('Upload cancelled'));
            });

            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
            const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

            xhr.open('POST', `${supabaseUrl}/storage/v1/object/${bucketName}/${fileName}`);
            xhr.setRequestHeader('Authorization', `Bearer ${supabaseKey}`);
            xhr.setRequestHeader('apikey', supabaseKey);
            xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

            xhr.send(file);
        });
    }

    async function handleFile(f?: FileList) {
        setError(null);
        if (!f || f.length === 0) return;
        const file = f[0];

        if (!file.type.startsWith('video/')) {
            const errorMsg = 'Please upload a valid video file';
            setError(errorMsg);
            toast.error(errorMsg);
            return;
        }

        const maxSizeMB = parseInt(process.env.NEXT_PUBLIC_MAX_VIDEO_SIZE_MB || '50', 10);
        const maxSizeBytes = maxSizeMB * 1024 * 1024;

        if (file.size > maxSizeBytes) {
            const errorMsg = `Video size must be less than ${maxSizeMB}MB`;
            setError(errorMsg);
            toast.error(errorMsg);
            return;
        }

        try {
            const { data: formData } = await supabaseClient.from('forms').select('user_id').eq('id', formId).single();

            if (formData?.user_id) {
                const storageCheck = await fetch('/api/check-storage', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: formData.user_id, fileSize: file.size }),
                });

                const { allowed, current, limit } = await storageCheck.json();

                if (!allowed) {
                    const currentGB = (current / 1024 / 1024 / 1024).toFixed(1);
                    const limitGB = (limit / 1024 / 1024 / 1024).toFixed(0);
                    const fileSizeMB = (file.size / 1024 / 1024).toFixed(1);
                    const remainingMB = ((limit - current) / 1024 / 1024).toFixed(0);
                    const wouldBeGB = ((current + file.size) / 1024 / 1024 / 1024).toFixed(1);

                    const errorMsg = `This form's storage is full. Currently using ${currentGB}GB of ${limitGB}GB. Your ${fileSizeMB}MB video would bring the total to ${wouldBeGB}GB. Only ${remainingMB}MB space remaining. Please record a shorter video or contact the form owner.`;
                    setError(errorMsg);
                    toast.error(errorMsg, { duration: 8000 });
                    return;
                }
            }
        } catch (err) {
            console.error('Storage check failed:', err);
        }

        uploadToSupabase(file);
    }

    function onDrop(e: DragEvent) {
        e.preventDefault();
        setIsDragging(false);
        handleFile(e.dataTransfer.files);
    }

    function onDragOver(e: DragEvent) {
        e.preventDefault();
        setIsDragging(true);
    }

    function onDragLeave(e: DragEvent) {
        e.preventDefault();
        setIsDragging(false);
    }

    function removeVideo() {
        onUploadComplete('');
        setError(null);
        setCurrentFileName('');
        setUploadProgress(0);
        setSelectedSource(null);
        if (uploadInputRef.current) uploadInputRef.current.value = '';
    }

    function handleRecordingComplete(recordedFile: File) {
        uploadToSupabase(recordedFile);
        setSelectedSource(null);
    }

    function handleCancelRecording() {
        setSelectedSource(null);
    }

    if (selectedSource === 'record') {
        if (isMobile) {
            return <MobileVideoCapture onVideoCapture={handleRecordingComplete} onCancel={handleCancelRecording} />;
        }
        return <VideoRecorder onRecordingComplete={handleRecordingComplete} onCancel={handleCancelRecording} />;
    }

    return (
        <div className="space-y-4">
            {!videoUrl ? (
                <>
                    {isUploading && (
                        <div className="border-2 border-indigo-600 bg-indigo-500/10 rounded-xl p-6 transition-all duration-200">
                            <div className="flex flex-col items-center justify-center">
                                <Loader2 className="w-10 h-10 text-indigo-500 dark:text-indigo-400 animate-spin mb-3" />
                                <p className="text-lg font-semibold text-foreground mb-2">Uploading...</p>
                                <p className="text-sm text-muted-foreground mb-4 truncate w-full px-2 text-center">{currentFileName}</p>
                                <div className="w-3/4 h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                                </div>
                                <span className="text-sm font-semibold text-indigo-500 dark:text-indigo-400 mt-2">{uploadProgress}% Complete</span>
                            </div>
                        </div>
                    )}

                    {!isUploading && (
                        <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Upload Box */}
                            <div
                                onDrop={onDrop}
                                onDragOver={onDragOver}
                                onDragLeave={onDragLeave}
                                onClick={() => uploadInputRef.current?.click()}
                                className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer
                                    ${isDragging
                                        ? 'border-indigo-600 bg-indigo-500/20 scale-[1.02] shadow-lg shadow-indigo-500/20'
                                        : error
                                            ? 'border-red-500/50 bg-red-500/10 hover:border-red-500/50'
                                            : 'border-border bg-muted/30 hover:border-indigo-500/50 hover:bg-muted'
                                    }`}
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <div className={`p-3 rounded-full transition-colors border border-border ${isDragging ? 'bg-indigo-600' : error ? 'bg-red-500/20' : 'bg-muted'}`}>
                                        <Upload className={`w-6 h-6 ${isDragging ? 'text-white' : error ? 'text-red-500' : 'text-indigo-500 dark:text-indigo-400'}`} />
                                    </div>
                                    <div>
                                        <p className={`font-semibold text-base mb-1 ${error ? 'text-red-600 dark:text-red-400' : isDragging ? 'text-indigo-600 dark:text-indigo-400' : 'text-foreground'}`}>
                                            {error ? 'Error: Click to Retry' : isDragging ? 'Drop Here' : 'Click to Upload'}
                                        </p>
                                        <p className="text-xs text-muted-foreground">MP4, MOV, WEBM</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Max {process.env.NEXT_PUBLIC_MAX_VIDEO_SIZE_MB || '50'}MB</p>
                                    </div>
                                </div>
                                <input ref={uploadInputRef} onChange={(e) => handleFile(e.target.files || undefined)} accept="video/*" type="file" className="hidden" />
                            </div>

                            {/* OR Divider */}
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden sm:flex items-center justify-center z-10">
                                <div className="bg-card px-3 py-1.5 rounded-full border border-border shadow-sm">
                                    <span className="text-sm font-semibold text-muted-foreground">OR</span>
                                </div>
                            </div>
                            <div className="sm:hidden flex items-center justify-center -my-2">
                                <span className="bg-card px-3 py-1 rounded-full border border-border text-xs font-semibold text-muted-foreground">OR</span>
                            </div>

                            {/* Record Box */}
                            <div
                                onClick={() => setSelectedSource('record')}
                                className="relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer border-border bg-muted/30 hover:border-indigo-500/50 hover:bg-muted"
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <div className="p-3 rounded-full transition-colors border border-border bg-muted">
                                        <Camera className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-base mb-1 text-foreground">Record Now</p>
                                        <p className="text-xs text-muted-foreground">Use your camera</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Instant capture</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="border border-green-500/30 bg-green-500/10 rounded-xl p-5 transition-all duration-200 shadow-lg">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-green-500/20 rounded-lg">
                            <VideoIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
                                        <p className="font-semibold text-base text-foreground">Video Ready</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate">{currentFileName || 'Video uploaded successfully'}</p>
                                </div>
                                <button type="button" onClick={removeVideo} disabled={isUploading} className="p-1.5 hover:bg-muted rounded-lg transition-colors shrink-0 text-muted-foreground hover:text-red-500" aria-label="Remove video">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="mt-2.5 flex items-center gap-2">
                                <div className="flex-1 h-1 bg-green-500/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-600 dark:bg-green-500 w-full transition-all duration-500" />
                                </div>
                                <span className="text-xs font-medium text-green-600 dark:text-green-400">100%</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
