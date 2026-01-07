import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface CallScreenProps {
  contactName: string;
  contactAvatar: string;
  isVideo: boolean;
  onEnd: () => void;
}

export default function CallScreen({ contactName, contactAvatar, isVideo, onEnd }: CallScreenProps) {
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(isVideo);
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected'>('connecting');

  useEffect(() => {
    const timer = setTimeout(() => {
      setCallStatus('connected');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (callStatus === 'connected') {
      const interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-xl z-50 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="p-6 text-center flex-1 flex flex-col justify-center items-center">
        <Avatar className="h-32 w-32 mb-6">
          <AvatarFallback className="bg-primary/20 text-primary text-4xl font-medium">
            {contactAvatar}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-3xl font-bold mb-2">{contactName}</h2>
        <p className="text-lg text-muted-foreground">
          {callStatus === 'connecting' ? 'Соединение...' : formatDuration(duration)}
        </p>
        {isVideo && (
          <div className="mt-8 text-sm text-muted-foreground flex items-center gap-2">
            <Icon name="Video" size={16} />
            <span>Видеозвонок</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-8 space-y-6">
        <div className="flex justify-center gap-6">
          <Button
            size="icon"
            variant={isMuted ? 'default' : 'secondary'}
            className="h-16 w-16 rounded-full"
            onClick={() => setIsMuted(!isMuted)}
          >
            <Icon name={isMuted ? 'MicOff' : 'Mic'} size={24} />
          </Button>
          
          {isVideo && (
            <Button
              size="icon"
              variant={isVideoOn ? 'secondary' : 'default'}
              className="h-16 w-16 rounded-full"
              onClick={() => setIsVideoOn(!isVideoOn)}
            >
              <Icon name={isVideoOn ? 'Video' : 'VideoOff'} size={24} />
            </Button>
          )}

          <Button
            size="icon"
            variant={isSpeaker ? 'default' : 'secondary'}
            className="h-16 w-16 rounded-full"
            onClick={() => setIsSpeaker(!isSpeaker)}
          >
            <Icon name={isSpeaker ? 'Volume2' : 'VolumeX'} size={24} />
          </Button>
        </div>

        <div className="flex justify-center">
          <Button
            size="icon"
            variant="destructive"
            className="h-20 w-20 rounded-full"
            onClick={onEnd}
          >
            <Icon name="PhoneOff" size={28} />
          </Button>
        </div>
      </div>
    </div>
  );
}
