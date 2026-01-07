import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import AuthScreen from '@/components/AuthScreen';
import SettingsScreen from '@/components/SettingsScreen';
import VoiceRecorder from '@/components/VoiceRecorder';
import CallScreen from '@/components/CallScreen';
import MusicSearch from '@/components/MusicSearch';

type Tab = 'chats' | 'calls' | 'stories' | 'music' | 'profile';

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread?: number;
  online?: boolean;
  avatar: string;
}

interface Message {
  id: number;
  text?: string;
  audioUrl?: string;
  audioDuration?: number;
  time: string;
  isMine: boolean;
}

interface Story {
  id: number;
  name: string;
  avatar: string;
  viewed: boolean;
}

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
}

interface Call {
  id: number;
  name: string;
  avatar: string;
  type: 'incoming' | 'outgoing' | 'missed';
  isVideo: boolean;
  time: string;
}

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMusicSearch, setShowMusicSearch] = useState(false);
  const [activeCall, setActiveCall] = useState<{ name: string; avatar: string; isVideo: boolean } | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userBio, setUserBio] = useState('Доступен для общения');
  const [activeTab, setActiveTab] = useState<Tab>('chats');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const [chats, setChats] = useState<Chat[]>([
    { id: 1, name: 'Анна Смирнова', lastMessage: 'Отлично, встретимся завтра!', time: '14:32', unread: 2, online: true, avatar: 'АС' },
    { id: 2, name: 'Группа проекта', lastMessage: 'Михаил: Добавил новые файлы', time: '13:15', unread: 5, avatar: 'ГП' },
    { id: 3, name: 'Дмитрий Волков', lastMessage: 'Спасибо за помощь 👍', time: '11:20', online: true, avatar: 'ДВ' },
    { id: 4, name: 'Мама', lastMessage: 'Не забудь позвонить бабушке', time: 'Вчера', avatar: 'М' },
    { id: 5, name: 'Екатерина', lastMessage: 'Фото: IMG_2847.jpg', time: 'Вчера', avatar: 'Е' },
  ]);

  const [messages, setMessages] = useState<Record<number, Message[]>>({
    1: [
      { id: 1, text: 'Привет! Как дела?', time: '10:30', isMine: false },
      { id: 2, text: 'Отлично! А у тебя?', time: '10:32', isMine: true },
      { id: 3, text: 'Отлично, встретимся завтра!', time: '14:32', isMine: false },
    ],
  });

  const [calls, setcalls] = useState<Call[]>([
    { id: 1, name: 'Анна Смирнова', avatar: 'АС', type: 'incoming', isVideo: false, time: '14:30' },
    { id: 2, name: 'Дмитрий Волков', avatar: 'ДВ', type: 'outgoing', isVideo: true, time: 'Вчера' },
    { id: 3, name: 'Мама', avatar: 'М', type: 'missed', isVideo: false, time: '2 дня назад' },
  ]);

  const stories: Story[] = [
    { id: 1, name: 'Ваша история', avatar: userName.charAt(0) || 'Я', viewed: false },
    { id: 2, name: 'Анна', avatar: 'АС', viewed: false },
    { id: 3, name: 'Дмитрий', avatar: 'ДВ', viewed: false },
    { id: 4, name: 'Группа', avatar: 'ГП', viewed: true },
    { id: 5, name: 'Екатерина', avatar: 'Е', viewed: true },
  ];

  const [tracks, setTracks] = useState<Track[]>([
    { id: 1, title: 'Midnight City', artist: 'M83', duration: '4:04' },
    { id: 2, title: 'Blinding Lights', artist: 'The Weeknd', duration: '3:22' },
    { id: 3, title: 'Levitating', artist: 'Dua Lipa', duration: '3:23' },
    { id: 4, title: 'Stay', artist: 'The Kid LAROI', duration: '2:21' },
  ]);

  const handleAuth = (phone: string, name: string) => {
    setUserPhone(phone);
    setUserName(name);
    setIsAuthenticated(true);
  };

  const handleUpdateProfile = (name: string, bio: string) => {
    setUserName(name);
    setUserBio(bio);
  };

  const handleSendMessage = () => {
    if (message.trim() && selectedChat) {
      const newMessage: Message = {
        id: Date.now(),
        text: message,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        isMine: true,
      };
      
      setMessages(prev => ({
        ...prev,
        [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage],
      }));

      setChats(prev => prev.map(chat => 
        chat.id === selectedChat.id 
          ? { ...chat, lastMessage: message, time: newMessage.time }
          : chat
      ));

      setMessage('');
    }
  };

  const handleSendVoice = (audioUrl: string, duration: number) => {
    if (selectedChat) {
      const newMessage: Message = {
        id: Date.now(),
        audioUrl,
        audioDuration: duration,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        isMine: true,
      };
      
      setMessages(prev => ({
        ...prev,
        [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage],
      }));

      setChats(prev => prev.map(chat => 
        chat.id === selectedChat.id 
          ? { ...chat, lastMessage: '🎤 Голосовое сообщение', time: newMessage.time }
          : chat
      ));

      setIsRecordingVoice(false);
    }
  };

  const handleStartCall = (isVideo: boolean) => {
    if (selectedChat) {
      setActiveCall({
        name: selectedChat.name,
        avatar: selectedChat.avatar,
        isVideo,
      });

      const newCall: Call = {
        id: Date.now(),
        name: selectedChat.name,
        avatar: selectedChat.avatar,
        type: 'outgoing',
        isVideo,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      };
      setcalls(prev => [newCall, ...prev]);
    }
  };

  const handleEndCall = () => {
    setActiveCall(null);
  };

  const handleAddTrack = (track: Track) => {
    setTracks(prev => [...prev, track]);
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return <AuthScreen onAuth={handleAuth} />;
  }

  if (showSettings) {
    return (
      <SettingsScreen
        onBack={() => setShowSettings(false)}
        userName={userName}
        userPhone={userPhone}
        onUpdateProfile={handleUpdateProfile}
      />
    );
  }

  if (showMusicSearch) {
    return (
      <MusicSearch
        onClose={() => setShowMusicSearch(false)}
        onAddTrack={handleAddTrack}
      />
    );
  }

  if (activeCall) {
    return (
      <CallScreen
        contactName={activeCall.name}
        contactAvatar={activeCall.avatar}
        isVideo={activeCall.isVideo}
        onEnd={handleEndCall}
      />
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden pb-16">
      {/* Main Content */}
      {activeTab === 'chats' && !selectedChat && (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Чаты</h1>
              <div className="flex gap-2">
                <Button 
                  size="icon" 
                  variant="ghost"
                  onClick={() => setShowSearch(!showSearch)}
                >
                  <Icon name="Search" size={20} />
                </Button>
                <Button size="icon" variant="ghost">
                  <Icon name="Plus" size={20} />
                </Button>
              </div>
            </div>
            {showSearch && (
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск чатов..."
                className="mb-2"
              />
            )}
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2">
              {filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => {
                    setSelectedChat(chat);
                    setChats(prev => prev.map(c => 
                      c.id === chat.id ? { ...c, unread: 0 } : c
                    ));
                  }}
                  className="w-full p-4 rounded-xl hover:bg-card/50 transition-colors mb-2 text-left active:scale-98"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-14 w-14">
                        <AvatarFallback className="bg-primary/20 text-primary font-medium text-lg">
                          {chat.avatar}
                        </AvatarFallback>
                      </Avatar>
                      {chat.online && (
                        <span className="absolute bottom-0 right-0 w-4 h-4 bg-accent rounded-full border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold truncate">{chat.name}</h3>
                        <span className="text-xs text-muted-foreground">{chat.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                        {chat.unread && chat.unread > 0 && (
                          <Badge className="ml-2 h-6 min-w-[24px] bg-primary text-primary-foreground rounded-full">
                            {chat.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Chat Window */}
      {selectedChat && (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-border bg-card flex items-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setSelectedChat(null)}
            >
              <Icon name="ArrowLeft" size={22} />
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/20 text-primary font-medium">
                {selectedChat.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="font-semibold">{selectedChat.name}</h2>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon name="Lock" size={12} />
                <span>Шифрование</span>
              </div>
            </div>
            <Button size="icon" variant="ghost" onClick={() => handleStartCall(false)}>
              <Icon name="Phone" size={20} />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => handleStartCall(true)}>
              <Icon name="Video" size={20} />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4 bg-background">
            <div className="space-y-3">
              {(messages[selectedChat.id] || []).map((msg) => (
                <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`px-4 py-2.5 rounded-2xl max-w-[75%] animate-fade-in ${
                    msg.isMine 
                      ? 'bg-primary text-primary-foreground rounded-tr-md' 
                      : 'bg-card rounded-tl-md'
                  }`}>
                    {msg.text && <p className="text-sm">{msg.text}</p>}
                    {msg.audioUrl && (
                      <audio src={msg.audioUrl} controls className="max-w-full" />
                    )}
                    <span className={`text-xs mt-1 inline-block ${
                      msg.isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border bg-card relative">
            {isRecordingVoice ? (
              <VoiceRecorder
                onSend={handleSendVoice}
                onCancel={() => setIsRecordingVoice(false)}
              />
            ) : (
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" className="shrink-0">
                  <Icon name="Plus" size={22} />
                </Button>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Сообщение..."
                  className="flex-1 bg-muted border-0 h-11"
                />
                {message.trim() ? (
                  <Button size="icon" onClick={handleSendMessage} className="shrink-0">
                    <Icon name="Send" size={20} />
                  </Button>
                ) : (
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="shrink-0"
                    onClick={() => setIsRecordingVoice(true)}
                  >
                    <Icon name="Mic" size={22} />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Calls Tab */}
      {activeTab === 'calls' && (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-border bg-card">
            <h1 className="text-2xl font-bold">Звонки</h1>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2">
              {calls.map((call) => (
                <div
                  key={call.id}
                  className="flex items-center gap-3 p-4 rounded-xl hover:bg-card/50 transition-colors mb-2"
                >
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="bg-primary/20 text-primary font-medium text-lg">
                      {call.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{call.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon 
                        name={call.type === 'incoming' ? 'PhoneIncoming' : call.type === 'outgoing' ? 'PhoneOutgoing' : 'PhoneMissed'} 
                        size={14}
                        className={call.type === 'missed' ? 'text-destructive' : ''}
                      />
                      <span>{call.isVideo ? 'Видео' : 'Голосовой'}</span>
                      <span>•</span>
                      <span>{call.time}</span>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost">
                    <Icon name={call.isVideo ? 'Video' : 'Phone'} size={20} />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Stories Tab */}
      {activeTab === 'stories' && (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-border bg-card">
            <h1 className="text-2xl font-bold">Истории</h1>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="grid grid-cols-2 gap-3">
              {stories.map((story) => (
                <button
                  key={story.id}
                  className="relative aspect-[9/16] rounded-2xl overflow-hidden active:scale-95 transition-transform"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${
                    story.viewed ? 'from-muted to-muted/50' : 'from-primary to-accent'
                  }`} />
                  <div className="absolute inset-0 flex flex-col justify-between p-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-card text-foreground font-medium">
                        {story.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-white font-medium drop-shadow-lg">{story.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Music Tab */}
      {activeTab === 'music' && (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-border bg-card">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Музыка</h1>
              <Button 
                size="icon" 
                variant="ghost"
                onClick={() => setShowMusicSearch(true)}
              >
                <Icon name="Search" size={20} />
              </Button>
            </div>
          </div>
          <ScrollArea className="flex-1 p-2">
            {tracks.map((track) => (
              <button
                key={track.id}
                className="w-full p-4 rounded-xl hover:bg-card/50 transition-colors flex items-center gap-3 active:scale-98 mb-2"
              >
                <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
                  <Icon name="Music" size={24} className="text-primary" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-semibold truncate">{track.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm text-muted-foreground">{track.duration}</span>
                  <Button size="icon" variant="ghost">
                    <Icon name="Play" size={20} />
                  </Button>
                </div>
              </button>
            ))}
          </ScrollArea>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-border bg-card">
            <h1 className="text-2xl font-bold">Профиль</h1>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              <div className="bg-card rounded-2xl p-6">
                <div className="flex flex-col items-center gap-4 mb-6">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="bg-primary/20 text-primary text-3xl font-medium">
                      {userName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="text-xl font-bold">{userName}</h3>
                    <p className="text-sm text-muted-foreground">{userPhone}</p>
                    <p className="text-sm mt-2">{userBio}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowSettings(true)}
                >
                  <Icon name="Settings" size={18} className="mr-2" />
                  Настройки
                </Button>
              </div>

              <div className="bg-card rounded-2xl p-4 space-y-2">
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left active:scale-98">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Icon name="Bell" size={20} className="text-primary" />
                  </div>
                  <span className="font-medium">Уведомления</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left active:scale-98">
                  <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                    <Icon name="Lock" size={20} className="text-accent" />
                  </div>
                  <span className="font-medium">Приватность</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left active:scale-98">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    <Icon name="HelpCircle" size={20} className="text-foreground" />
                  </div>
                  <span className="font-medium">Помощь</span>
                </button>
              </div>
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-bottom">
        <div className="flex justify-around items-center px-2 py-3">
          <Button
            variant={activeTab === 'chats' ? 'default' : 'ghost'}
            size="icon"
            className="h-12 w-12 rounded-xl"
            onClick={() => { setActiveTab('chats'); setSelectedChat(null); }}
          >
            <Icon name="MessageCircle" size={22} />
          </Button>
          <Button
            variant={activeTab === 'calls' ? 'default' : 'ghost'}
            size="icon"
            className="h-12 w-12 rounded-xl"
            onClick={() => { setActiveTab('calls'); setSelectedChat(null); }}
          >
            <Icon name="Phone" size={22} />
          </Button>
          <Button
            variant={activeTab === 'stories' ? 'default' : 'ghost'}
            size="icon"
            className="h-12 w-12 rounded-xl"
            onClick={() => { setActiveTab('stories'); setSelectedChat(null); }}
          >
            <Icon name="Circle" size={22} />
          </Button>
          <Button
            variant={activeTab === 'music' ? 'default' : 'ghost'}
            size="icon"
            className="h-12 w-12 rounded-xl"
            onClick={() => { setActiveTab('music'); setSelectedChat(null); }}
          >
            <Icon name="Music" size={22} />
          </Button>
          <Button
            variant={activeTab === 'profile' ? 'default' : 'ghost'}
            size="icon"
            className="h-12 w-12 rounded-xl"
            onClick={() => { setActiveTab('profile'); setSelectedChat(null); }}
          >
            <Icon name="User" size={22} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
