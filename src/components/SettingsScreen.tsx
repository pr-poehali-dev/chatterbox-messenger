import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';

interface SettingsScreenProps {
  onBack: () => void;
  userName: string;
  userPhone: string;
  onUpdateProfile: (name: string, bio: string) => void;
}

export default function SettingsScreen({ onBack, userName, userPhone, onUpdateProfile }: SettingsScreenProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(userName);
  const [editBio, setEditBio] = useState('Доступен для общения');
  const { theme, toggleTheme } = useTheme();

  const handleSaveProfile = () => {
    onUpdateProfile(editName, editBio);
    setIsEditingProfile(false);
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      <div className="p-4 border-b border-border bg-card flex items-center gap-3">
        <Button size="icon" variant="ghost" onClick={onBack}>
          <Icon name="ArrowLeft" size={20} />
        </Button>
        <h1 className="text-xl font-bold">Настройки</h1>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Profile Section */}
          <div className="bg-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary/20 text-primary text-2xl font-medium">
                  {userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                {!isEditingProfile ? (
                  <>
                    <h2 className="text-xl font-bold">{userName}</h2>
                    <p className="text-sm text-muted-foreground">{userPhone}</p>
                    <p className="text-sm mt-1">{editBio}</p>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Ваше имя"
                    />
                    <Input
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      placeholder="О себе"
                    />
                  </div>
                )}
              </div>
            </div>
            {!isEditingProfile ? (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setIsEditingProfile(true)}
              >
                <Icon name="Edit" size={18} className="mr-2" />
                Редактировать профиль
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setEditName(userName);
                    setIsEditingProfile(false);
                  }}
                >
                  Отмена
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleSaveProfile}
                >
                  Сохранить
                </Button>
              </div>
            )}
          </div>

          {/* Appearance */}
          <div className="bg-card rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2">ВНЕШНИЙ ВИД</h3>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Icon name={theme === 'dark' ? 'Moon' : 'Sun'} size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium">Тёмная тема</p>
                  <p className="text-xs text-muted-foreground">Комфортная для глаз</p>
                </div>
              </div>
              <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-card rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2">КОНФИДЕНЦИАЛЬНОСТЬ</h3>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                <Icon name="Lock" size={20} className="text-accent" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Приватность и безопасность</p>
                <p className="text-xs text-muted-foreground">Блокировка, видимость</p>
              </div>
              <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Icon name="Bell" size={20} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Уведомления</p>
                <p className="text-xs text-muted-foreground">Звуки, вибрация</p>
              </div>
              <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left">
              <div className="w-10 h-10 bg-destructive/20 rounded-lg flex items-center justify-center">
                <Icon name="Shield" size={20} className="text-destructive" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Шифрование</p>
                <p className="text-xs text-muted-foreground">Сквозное шифрование</p>
              </div>
              <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
            </button>
          </div>

          {/* Other Settings */}
          <div className="bg-card rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2">ДРУГОЕ</h3>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                <Icon name="Database" size={20} className="text-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Данные и хранилище</p>
                <p className="text-xs text-muted-foreground">512 МБ</p>
              </div>
              <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                <Icon name="HelpCircle" size={20} className="text-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Помощь</p>
                <p className="text-xs text-muted-foreground">FAQ, поддержка</p>
              </div>
              <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
            </button>
          </div>

          {/* Version */}
          <div className="text-center text-xs text-muted-foreground py-4">
            ChatterBox v1.0.0
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
