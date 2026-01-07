import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

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

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('chats');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState('');

  const chats: Chat[] = [
    { id: 1, name: 'Анна Смирнова', lastMessage: 'Отлично, встретимся завтра!', time: '14:32', unread: 2, online: true, avatar: 'АС' },
    { id: 2, name: 'Группа проекта', lastMessage: 'Михаил: Добавил новые файлы', time: '13:15', unread: 5, avatar: 'ГП' },
    { id: 3, name: 'Дмитрий Волков', lastMessage: 'Спасибо за помощь 👍', time: '11:20', online: true, avatar: 'ДВ' },
    { id: 4, name: 'Мама', lastMessage: 'Не забудь позвонить бабушке', time: 'Вчера', avatar: 'М' },
    { id: 5, name: 'Екатерина', lastMessage: 'Фото: IMG_2847.jpg', time: 'Вчера', avatar: 'Е' },
  ];

  const stories: Story[] = [
    { id: 1, name: 'Ваша история', avatar: 'Я', viewed: false },
    { id: 2, name: 'Анна', avatar: 'АС', viewed: false },
    { id: 3, name: 'Дмитрий', avatar: 'ДВ', viewed: false },
    { id: 4, name: 'Группа', avatar: 'ГП', viewed: true },
    { id: 5, name: 'Екатерина', avatar: 'Е', viewed: true },
  ];

  const tracks: Track[] = [
    { id: 1, title: 'Midnight City', artist: 'M83', duration: '4:04' },
    { id: 2, title: 'Blinding Lights', artist: 'The Weeknd', duration: '3:22' },
    { id: 3, title: 'Levitating', artist: 'Dua Lipa', duration: '3:23' },
    { id: 4, title: 'Stay', artist: 'The Kid LAROI', duration: '2:21' },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessage('');
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 border-r border-border bg-card`}>
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">ChatterBox</h1>
            <Button size="icon" variant="ghost">
              <Icon name="Search" size={20} />
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-muted/50 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('chats')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'chats' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              Чаты
            </button>
            <button
              onClick={() => setActiveTab('calls')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'calls' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              Звонки
            </button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          {activeTab === 'chats' && (
            <div className="p-2">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`w-full p-3 rounded-lg hover:bg-muted/50 transition-colors mb-1 text-left ${
                    selectedChat?.id === chat.id ? 'bg-muted' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/20 text-primary font-medium">
                          {chat.avatar}
                        </AvatarFallback>
                      </Avatar>
                      {chat.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-accent rounded-full border-2 border-card" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-sm truncate">{chat.name}</h3>
                        <span className="text-xs text-muted-foreground">{chat.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                        {chat.unread && (
                          <Badge className="ml-2 h-5 min-w-[20px] bg-primary text-primary-foreground">
                            {chat.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'calls' && (
            <div className="p-4 text-center text-muted-foreground">
              <Icon name="Phone" size={48} className="mx-auto mb-4 opacity-50" />
              <p>История звонков пуста</p>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Chat Window */}
      {selectedChat ? (
        <div className="flex flex-col flex-1">
          {/* Chat Header */}
          <div className="p-4 border-b border-border bg-card flex items-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              className="md:hidden"
              onClick={() => setSelectedChat(null)}
            >
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/20 text-primary font-medium">
                {selectedChat.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="font-semibold">{selectedChat.name}</h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon name="Lock" size={12} />
                <span>Сквозное шифрование</span>
              </div>
            </div>
            <Button size="icon" variant="ghost">
              <Icon name="Phone" size={20} />
            </Button>
            <Button size="icon" variant="ghost">
              <Icon name="Video" size={20} />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4 bg-background">
            <div className="space-y-4">
              <div className="flex justify-start">
                <div className="bg-card px-4 py-2 rounded-2xl rounded-tl-md max-w-[70%] animate-fade-in">
                  <p className="text-sm">Привет! Как дела?</p>
                  <span className="text-xs text-muted-foreground">10:30</span>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-primary px-4 py-2 rounded-2xl rounded-tr-md max-w-[70%] animate-fade-in">
                  <p className="text-sm text-primary-foreground">Отлично! А у тебя?</p>
                  <span className="text-xs text-primary-foreground/70">10:32</span>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-card px-4 py-2 rounded-2xl rounded-tl-md max-w-[70%] animate-fade-in">
                  <p className="text-sm">{selectedChat.lastMessage}</p>
                  <span className="text-xs text-muted-foreground">{selectedChat.time}</span>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border bg-card">
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost">
                <Icon name="Paperclip" size={20} />
              </Button>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Введите сообщение..."
                className="flex-1 bg-muted border-0"
              />
              <Button size="icon" variant="ghost">
                <Icon name="Mic" size={20} />
              </Button>
              <Button size="icon" onClick={handleSendMessage}>
                <Icon name="Send" size={20} />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-background">
          <div className="text-center space-y-4 animate-fade-in">
            <div className="w-24 h-24 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
              <Icon name="MessageCircle" size={48} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Добро пожаловать в ChatterBox</h2>
            <p className="text-muted-foreground max-w-md">
              Выберите чат из списка, чтобы начать общение с защищенным сквозным шифрованием
            </p>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex justify-around p-2">
          <Button
            variant={activeTab === 'chats' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => { setActiveTab('chats'); setSelectedChat(null); }}
          >
            <Icon name="MessageCircle" size={20} />
          </Button>
          <Button
            variant={activeTab === 'calls' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => { setActiveTab('calls'); setSelectedChat(null); }}
          >
            <Icon name="Phone" size={20} />
          </Button>
          <Button
            variant={activeTab === 'stories' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => { setActiveTab('stories'); setSelectedChat(null); }}
          >
            <Icon name="Circle" size={20} />
          </Button>
          <Button
            variant={activeTab === 'music' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => { setActiveTab('music'); setSelectedChat(null); }}
          >
            <Icon name="Music" size={20} />
          </Button>
          <Button
            variant={activeTab === 'profile' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => { setActiveTab('profile'); setSelectedChat(null); }}
          >
            <Icon name="User" size={20} />
          </Button>
        </div>
      </div>

      {/* Stories Modal (Desktop) */}
      {activeTab === 'stories' && !selectedChat && (
        <div className="hidden md:flex flex-1 flex-col bg-background">
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl font-bold">Истории</h2>
          </div>
          <ScrollArea className="flex-1 p-6">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {stories.map((story) => (
                <button
                  key={story.id}
                  className="relative aspect-[9/16] rounded-2xl overflow-hidden group hover:scale-105 transition-transform"
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
                    <p className="text-white font-medium">{story.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Music Modal (Desktop) */}
      {activeTab === 'music' && !selectedChat && (
        <div className="hidden md:flex flex-1 flex-col bg-background">
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl font-bold">Музыка</h2>
          </div>
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-2">
              {tracks.map((track) => (
                <button
                  key={track.id}
                  className="w-full p-4 rounded-lg hover:bg-card transition-colors flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Icon name="Music" size={24} className="text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">{track.title}</p>
                    <p className="text-sm text-muted-foreground">{track.artist}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{track.duration}</span>
                  <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100">
                    <Icon name="Play" size={20} />
                  </Button>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Profile Modal (Desktop) */}
      {activeTab === 'profile' && !selectedChat && (
        <div className="hidden md:flex flex-1 flex-col bg-background">
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl font-bold">Профиль</h2>
          </div>
          <ScrollArea className="flex-1 p-6">
            <div className="max-w-md mx-auto space-y-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-primary/20 text-primary text-3xl font-medium">
                    Я
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-xl font-bold">Ваше имя</h3>
                  <p className="text-muted-foreground">+7 900 123-45-67</p>
                </div>
              </div>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="Settings" size={20} className="mr-3" />
                  Настройки
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="Bell" size={20} className="mr-3" />
                  Уведомления
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="Lock" size={20} className="mr-3" />
                  Приватность
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="HelpCircle" size={20} className="mr-3" />
                  Помощь
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default Index;
