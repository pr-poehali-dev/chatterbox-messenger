import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
}

interface MusicSearchProps {
  onClose: () => void;
  onAddTrack: (track: Track) => void;
}

const availableTracks: Track[] = [
  { id: 101, title: 'Shape of You', artist: 'Ed Sheeran', duration: '3:53' },
  { id: 102, title: 'Someone Like You', artist: 'Adele', duration: '4:45' },
  { id: 103, title: 'Bohemian Rhapsody', artist: 'Queen', duration: '5:55' },
  { id: 104, title: 'Imagine', artist: 'John Lennon', duration: '3:03' },
  { id: 105, title: 'Billie Jean', artist: 'Michael Jackson', duration: '4:54' },
  { id: 106, title: 'Hotel California', artist: 'Eagles', duration: '6:30' },
  { id: 107, title: 'Smells Like Teen Spirit', artist: 'Nirvana', duration: '5:01' },
  { id: 108, title: 'Wonderwall', artist: 'Oasis', duration: '4:18' },
  { id: 109, title: 'Sweet Child O Mine', artist: 'Guns N Roses', duration: '5:56' },
  { id: 110, title: 'Stairway to Heaven', artist: 'Led Zeppelin', duration: '8:02' },
];

export default function MusicSearch({ onClose, onAddTrack }: MusicSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [addedTracks, setAddedTracks] = useState<Set<number>>(new Set());

  const filteredTracks = availableTracks.filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTrack = (track: Track) => {
    onAddTrack(track);
    setAddedTracks(prev => new Set(prev).add(track.id));
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col animate-slide-in-right">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3 mb-4">
          <Button size="icon" variant="ghost" onClick={onClose}>
            <Icon name="ArrowLeft" size={22} />
          </Button>
          <h1 className="text-xl font-bold">Поиск музыки</h1>
        </div>
        <div className="relative">
          <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Название или исполнитель"
            className="pl-10"
          />
        </div>
      </div>

      {/* Results */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredTracks.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Music" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                {searchQuery ? 'Ничего не найдено' : 'Введите запрос для поиска'}
              </p>
            </div>
          ) : (
            filteredTracks.map((track) => {
              const isAdded = addedTracks.has(track.id);
              return (
                <div
                  key={track.id}
                  className="flex items-center gap-3 p-4 rounded-xl hover:bg-card/50 transition-colors mb-2"
                >
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
                    <Icon name="Music" size={24} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{track.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                  </div>
                  <span className="text-sm text-muted-foreground shrink-0">{track.duration}</span>
                  <Button
                    size="icon"
                    variant={isAdded ? 'secondary' : 'default'}
                    onClick={() => handleAddTrack(track)}
                    disabled={isAdded}
                  >
                    <Icon name={isAdded ? 'Check' : 'Plus'} size={20} />
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
