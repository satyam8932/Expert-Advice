'use client';
import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Video, Square, Pause, Play, RotateCcw, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useReactMediaRecorder } from 'react-media-recorder';
import RecordingTimerOverlay from './RecordingTimerOverlay';

const VideoPreview = memo(({ videoRef }: { videoRef: React.RefObject<HTMLVideoElement | null> }) => {
    return <video key="live-preview" ref={videoRef} autoPlay muted playsInline className="w-full h-full object-contain" />;
});

VideoPreview.displayName = 'VideoPreview';

interface VideoRecorderProps {
    onRecordingComplete: (file: File) => void;
    onCancel: () => void;
}

export default function VideoRecorder({ onRecordingComplete, onCancel }: VideoRecorderProps) {
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const { status, startRecording, stopRecording, pauseRecording, resumeRecording, mediaBlobUrl, previewStream, clearBlobUrl, error } = useReactMediaRecorder({
        video: true,
        audio: true,
        askPermissionOnMount: true,
        blobPropertyBag: { type: 'video/webm' },
    });

    useEffect(() => {
        if (videoRef.current && previewStream) {
            if (streamRef.current !== previewStream) {
                streamRef.current = previewStream;
                videoRef.current.srcObject = previewStream;
            }
        }
    }, [previewStream]);

    const handleStartRecording = useCallback(() => {
        setIsTimerRunning(true);
        startRecording();
    }, [startRecording]);

    const handleStopRecording = useCallback(() => {
        setIsTimerRunning(false);
        stopRecording();
    }, [stopRecording]);

    const handlePauseRecording = useCallback(() => {
        setIsTimerRunning(false);
        pauseRecording();
    }, [pauseRecording]);

    const handleResumeRecording = useCallback(() => {
        setIsTimerRunning(true);
        resumeRecording();
    }, [resumeRecording]);

    const handleRetake = useCallback(() => {
        clearBlobUrl();
        setIsTimerRunning(false);
    }, [clearBlobUrl]);

    const handleComplete = useCallback(async () => {
        if (mediaBlobUrl) {
            const response = await fetch(mediaBlobUrl);
            const blob = await response.blob();

            // Check video size against limit
            const maxSizeMB = parseInt(process.env.NEXT_PUBLIC_MAX_VIDEO_SIZE_MB || '50', 10);
            const maxSizeBytes = maxSizeMB * 1024 * 1024;

            if (blob.size > maxSizeBytes) {
                const fileSizeMB = (blob.size / 1024 / 1024).toFixed(1);
                const { toast } = await import('sonner');
                toast.error(`Video size (${fileSizeMB}MB) exceeds the ${maxSizeMB}MB limit. Please record a shorter video.`, {
                    duration: 6000,
                });
                handleRetake(); // Clear the recording so user can try again
                return;
            }

            const file = new File([blob], `recorded-video-${Date.now()}.webm`, {
                type: 'video/webm',
            });
            onRecordingComplete(file);
        }
    }, [mediaBlobUrl, onRecordingComplete]);

    if (error) {
        return (
            <div className="border-2 border-red-300 bg-red-50 rounded-xl p-8 text-center">
                <div className="text-red-700 mb-4">Unable to access camera. Please check permissions.</div>
                <Button onClick={onCancel} variant="outline">
                    Cancel
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden">
                {mediaBlobUrl ? <video key={mediaBlobUrl} src={mediaBlobUrl} controls className="w-full h-full object-contain" /> : <VideoPreview videoRef={videoRef} />}
                {status === 'recording' && <RecordingTimerOverlay isRunning={isTimerRunning} />}
            </div>

            <div className="flex gap-3">
                {!mediaBlobUrl ? (
                    <>
                        {status === 'idle' || status === 'acquiring_media' ? (
                            <>
                                <Button onClick={onCancel} variant="outline" className="flex-1" disabled={status === 'acquiring_media'}>
                                    <X className="mr-2 w-4 h-4" />
                                    Cancel
                                </Button>
                                <Button onClick={handleStartRecording} disabled={status === 'acquiring_media'} className="flex-1 bg-red-600 hover:bg-red-700">
                                    <Video className="mr-2 w-4 h-4" />
                                    {status === 'acquiring_media' ? 'Loading Camera...' : 'Start Recording'}
                                </Button>
                            </>
                        ) : status === 'recording' ? (
                            <>
                                <Button onClick={handlePauseRecording} variant="outline" className="flex-1">
                                    <Pause className="mr-2 w-4 h-4" />
                                    Pause
                                </Button>
                                <Button onClick={handleStopRecording} className="flex-1 bg-red-600 hover:bg-red-700">
                                    <Square className="mr-2 w-4 h-4" />
                                    Stop
                                </Button>
                            </>
                        ) : status === 'paused' ? (
                            <>
                                <Button onClick={handleResumeRecording} className="flex-1 bg-green-600 hover:bg-green-700">
                                    <Play className="mr-2 w-4 h-4" />
                                    Resume
                                </Button>
                                <Button onClick={handleStopRecording} className="flex-1 bg-red-600 hover:bg-red-700">
                                    <Square className="mr-2 w-4 h-4" />
                                    Stop
                                </Button>
                            </>
                        ) : null}
                    </>
                ) : (
                    <>
                        <Button onClick={handleRetake} variant="outline" className="flex-1">
                            <RotateCcw className="mr-2 w-4 h-4" />
                            Retake
                        </Button>
                        <Button onClick={handleComplete} className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                            <Check className="mr-2 w-4 h-4" />
                            Use This Video
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
