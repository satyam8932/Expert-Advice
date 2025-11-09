import { memo, useState, useEffect } from 'react';

interface RecordingTimerOverlayProps {
    isRunning: boolean;
}

const RecordingTimerOverlay = memo(({ isRunning }: RecordingTimerOverlayProps) => {
    const [timer, setTimer] = useState({ minutes: 0, seconds: 0 });

    useEffect(() => {
        if (!isRunning) {
            setTimer({ minutes: 0, seconds: 0 });
            return;
        }

        const interval = setInterval(() => {
            setTimer((prev) => {
                const newSeconds = prev.seconds + 1;
                if (newSeconds === 60) {
                    return { seconds: 0, minutes: prev.minutes + 1 };
                }
                return { ...prev, seconds: newSeconds };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning]);

    const formatTime = (mins: number, secs: number) => {
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-full z-10 pointer-events-none">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
            <span className="text-sm font-semibold">{formatTime(timer.minutes, timer.seconds)}</span>
        </div>
    );
});

RecordingTimerOverlay.displayName = 'RecordingTimerOverlay';

export default RecordingTimerOverlay;
