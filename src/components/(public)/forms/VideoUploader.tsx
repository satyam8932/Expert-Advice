'use client';
import { useRef, DragEvent, useState, useEffect } from 'react';
import { Upload, Video as VideoIcon, X, CheckCircle2, Camera, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import MobileVideoCapture from './MobileVideoCapture';
import { VideoSource } from '@/lib/types/video-recorder.types';
import { supabaseClient } from '@/supabase/client';
import { toast } from 'sonner';

const VideoRecorder = dynamic(() => import('./VideoRecorder'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center aspect-video bg-gray-900 rounded-xl">
            <div className="text-white">Loading camera...</div>
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

    function handleFile(f?: FileList) {
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

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    if (selectedSource === 'record') {
        if (isMobile) {
            return <MobileVideoCapture onVideoCapture={handleRecordingComplete} onCancel={handleCancelRecording} />;
        }
        return <VideoRecorder onRecordingComplete={handleRecordingComplete} onCancel={handleCancelRecording} />;
    }

    return (
        <div className="space-y-3">
            {!videoUrl ? (
                <>
                    <div
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onClick={() => !isUploading && uploadInputRef.current?.click()}
                        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
                            isUploading
                                ? 'border-indigo-400 bg-indigo-50 cursor-not-allowed'
                                : isDragging
                                  ? 'border-indigo-600 bg-indigo-50 scale-[1.01] cursor-pointer'
                                  : error
                                    ? 'border-red-300 bg-red-50 hover:border-red-400 cursor-pointer'
                                    : 'border-gray-300 bg-gray-50/50 hover:border-indigo-400 hover:bg-indigo-50/50 cursor-pointer'
                        }`}
                    >
                        <div className="flex flex-col items-center gap-3">
                            <div className={`p-3 rounded-full transition-colors ${isUploading ? 'bg-indigo-600' : isDragging ? 'bg-indigo-600' : error ? 'bg-red-100' : 'bg-white border border-gray-200'}`}>
                                {isUploading ? <Loader2 className="w-7 h-7 text-white animate-spin" /> : <Upload className={`w-7 h-7 ${isDragging ? 'text-white' : error ? 'text-red-600' : 'text-indigo-600'}`} />}
                            </div>
                            <div>
                                <p className={`text-base font-semibold mb-1 ${error ? 'text-red-700' : isUploading ? 'text-indigo-700' : 'text-gray-900'}`}>{isUploading ? 'Uploading...' : isDragging ? 'Drop your video here' : error ? error : 'Upload Video'}</p>
                                {!isUploading && <p className="text-sm text-gray-600">Drag and drop or click to browse</p>}
                                {!isUploading && <p className="text-xs text-gray-500 mt-1">MP4, MOV, AVI, WEBM • Max {process.env.NEXT_PUBLIC_MAX_VIDEO_SIZE_MB || '50'}MB</p>}
                                {isUploading && currentFileName && (
                                    <div className="mt-3">
                                        <p className="text-xs text-gray-600 mb-2">{currentFileName}</p>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 bg-indigo-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                                            </div>
                                            <span className="text-sm font-semibold text-indigo-700 min-w-12 text-right">{uploadProgress}%</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <input ref={uploadInputRef} onChange={(e) => handleFile(e.target.files || undefined)} accept="video/*" type="file" className="hidden" disabled={isUploading} />
                    </div>

                    {!isUploading && (
                        <>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">OR</span>
                                </div>
                            </div>

                            <Button type="button" onClick={() => setSelectedSource('record')} variant="outline" className="w-full h-auto py-4 border-2 hover:border-indigo-600 hover:bg-indigo-50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                        <Camera className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-gray-900">Record Video</p>
                                        <p className="text-xs text-gray-600">Use your camera to record</p>
                                    </div>
                                </div>
                            </Button>
                        </>
                    )}
                </>
            ) : (
                <div className="border-2 border-indigo-200 bg-indigo-50 rounded-xl p-5 transition-all duration-200">
                    <div className="flex items-start gap-3">
                        <div className="p-2.5 bg-indigo-600 rounded-lg">
                            <VideoIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                                        <p className="font-semibold text-sm text-indigo-900">Video uploaded successfully</p>
                                    </div>
                                    <p className="text-xs text-indigo-700 truncate">{currentFileName || 'Video ready'}</p>
                                </div>
                                <button type="button" onClick={removeVideo} disabled={isUploading} className="p-1.5 hover:bg-indigo-100 rounded-lg transition-colors shrink-0" aria-label="Remove video">
                                    <X className="w-4 h-4 text-indigo-900" />
                                </button>
                            </div>
                            <div className="mt-2.5 flex items-center gap-2">
                                <div className="flex-1 h-1 bg-indigo-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-600 w-full transition-all duration-500" />
                                </div>
                                <span className="text-xs font-medium text-indigo-700">100%</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
