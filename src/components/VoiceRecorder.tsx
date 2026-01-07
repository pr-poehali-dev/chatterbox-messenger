import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface VoiceRecorderProps {
  onSend: (audioUrl: string, duration: number) => void;
  onCancel: () => void;
}

export default function VoiceRecorder({ onSend, onCancel }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startRecording();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      onCancel();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleSend = () => {
    if (audioUrl) {
      onSend(audioUrl, duration);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 bg-card flex items-center gap-3 px-4 animate-slide-in-right">
      {isRecording && (
        <>
          <Button size="icon" variant="ghost" onClick={() => { stopRecording(); onCancel(); }}>
            <Icon name="X" size={22} />
          </Button>
          <div className="flex-1 flex items-center gap-3">
            <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
            <span className="font-mono text-lg">{formatDuration(duration)}</span>
            <div className="flex-1 flex items-center gap-1 h-8">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-primary/30 rounded-full"
                  style={{
                    height: `${Math.random() * 100}%`,
                    animation: 'pulse 0.5s ease-in-out infinite',
                    animationDelay: `${i * 0.05}s`
                  }}
                />
              ))}
            </div>
          </div>
          <Button size="icon" onClick={stopRecording}>
            <Icon name="Square" size={20} />
          </Button>
        </>
      )}
      {!isRecording && audioUrl && (
        <>
          <Button size="icon" variant="ghost" onClick={onCancel}>
            <Icon name="Trash2" size={20} />
          </Button>
          <div className="flex-1">
            <audio src={audioUrl} controls className="w-full h-10" />
          </div>
          <Button size="icon" onClick={handleSend}>
            <Icon name="Send" size={20} />
          </Button>
        </>
      )}
    </div>
  );
}
