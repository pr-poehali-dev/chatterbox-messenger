import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface AuthScreenProps {
  onAuth: (phone: string, name: string) => void;
}

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [step, setStep] = useState<'phone' | 'code' | 'name'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  const handlePhoneSubmit = () => {
    if (phone.length >= 10) {
      setStep('code');
    }
  };

  const handleCodeSubmit = () => {
    if (code.length === 6) {
      setStep('name');
    }
  };

  const handleNameSubmit = () => {
    if (name.trim()) {
      onAuth(phone, name);
    }
  };

  return (
    <div className="h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="MessageCircle" size={40} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">ChatterBox</h1>
          <p className="text-muted-foreground">
            {step === 'phone' && 'Введите номер телефона'}
            {step === 'code' && 'Введите код подтверждения'}
            {step === 'name' && 'Как вас зовут?'}
          </p>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-lg space-y-4">
          {step === 'phone' && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Номер телефона</label>
                <Input
                  type="tel"
                  placeholder="+7 (900) 123-45-67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="text-lg"
                />
              </div>
              <Button 
                onClick={handlePhoneSubmit} 
                className="w-full h-12 text-base"
                disabled={phone.length < 10}
              >
                Продолжить
              </Button>
            </>
          )}

          {step === 'code' && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Код подтверждения</label>
                <p className="text-xs text-muted-foreground mb-2">
                  Отправлен на номер {phone}
                </p>
                <Input
                  type="text"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-2xl text-center tracking-widest"
                  maxLength={6}
                />
              </div>
              <Button 
                onClick={handleCodeSubmit} 
                className="w-full h-12 text-base"
                disabled={code.length !== 6}
              >
                Подтвердить
              </Button>
              <Button 
                onClick={() => setStep('phone')} 
                variant="ghost" 
                className="w-full"
              >
                Изменить номер
              </Button>
            </>
          )}

          {step === 'name' && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Ваше имя</label>
                <Input
                  type="text"
                  placeholder="Иван Иванов"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-lg"
                />
              </div>
              <Button 
                onClick={handleNameSubmit} 
                className="w-full h-12 text-base"
                disabled={!name.trim()}
              >
                Начать общение
              </Button>
            </>
          )}

          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon name="Lock" size={14} />
              <span>Сквозное шифрование защищает ваши данные</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
