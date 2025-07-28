import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, RefreshCw, User } from 'lucide-react';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';

const AVATAR_STYLES = [
  'adventurer', 'adventurer-neutral', 'avataaars', 'big-ears',
  'big-ears-neutral', 'big-smile', 'bottts', 'croodles',
  'croodles-neutral', 'fun-emoji', 'icons', 'identicon',
  'initials', 'lorelei', 'lorelei-neutral', 'micah',
  'miniavs', 'notionists', 'open-peeps', 'personas',
  'pixel-art', 'pixel-art-neutral'
];

const COLORS = ['amber', 'blue', 'cyan', 'emerald', 'fuchsia', 'green', 'indigo', 'lime', 'orange', 'pink', 'purple', 'red', 'rose', 'sky', 'teal', 'violet', 'yellow'];

interface AvatarSelectorProps {
  username?: string;
  onAvatarChange?: (avatarUrl: string) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showUsername?: boolean;
}

export default function AvatarSelector({ 
  username = 'Usuario',
  onAvatarChange,
  size = 'md',
  showUsername = true
}: AvatarSelectorProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('pixel-art');
  const [seed, setSeed] = useState<string>('');
  const [open, setOpen] = useState(false);
  
  const { updateSettings, offlineData } = useOfflineStorage();
  
  // Tamaños de avatar
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };
  
  // Cargar avatar guardado o generar uno nuevo
  useEffect(() => {
    const savedAvatar = offlineData.settings.avatarUrl || localStorage.getItem('user-avatar');
    const savedSeed = offlineData.settings.avatarSeed || localStorage.getItem('avatar-seed') || username;
    const savedStyle = offlineData.settings.avatarStyle || localStorage.getItem('avatar-style') || 'pixel-art';
    
    if (savedAvatar) {
      setSelectedAvatar(savedAvatar);
    } else {
      generateAvatar(savedStyle, savedSeed);
    }
    
    setSelectedStyle(savedStyle);
    setSeed(savedSeed);
  }, [username, offlineData.settings]);
  
  // Generar un avatar aleatorio con DiceBear
  const generateAvatar = (style = selectedStyle, seedValue = seed || username) => {
    const apiSeed = seedValue || Math.random().toString(36).substring(2, 10);
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const url = `https://api.dicebear.com/7.x/${style}/svg?seed=${apiSeed}&backgroundColor=${randomColor}`;
    
    setSelectedAvatar(url);
    setSeed(apiSeed);
    
    // Guardar en configuración
    localStorage.setItem('user-avatar', url);
    localStorage.setItem('avatar-seed', apiSeed);
    localStorage.setItem('avatar-style', style);
    updateSettings({ avatarUrl: url, avatarSeed: apiSeed, avatarStyle: style });
    
    if (onAvatarChange) {
      onAvatarChange(url);
    }
  };
  
  // Seleccionar un estilo de avatar
  const handleStyleSelect = (style: string) => {
    setSelectedStyle(style);
    generateAvatar(style, seed);
  };
  
  // Regenerar con mismo estilo pero semilla aleatoria
  const handleRegenerate = () => {
    generateAvatar(selectedStyle, Math.random().toString(36).substring(2, 10));
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="p-0 h-auto hover:opacity-80 relative group">
            <Avatar className={`${sizeClasses[size]} border-2 border-white/50 transition-all hover:border-primary`}>
              <AvatarImage src={selectedAvatar} alt={username} />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="text-xs text-white font-bold">Cambiar</span>
            </div>
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Personaliza tu avatar</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col gap-4">
            {/* Avatar preview */}
            <div className="flex justify-center my-4">
              <Avatar className="h-32 w-32 border-4 border-primary/30">
                <AvatarImage src={selectedAvatar} alt={username} />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
            </div>
            
            {/* Regenerate button */}
            <Button onClick={handleRegenerate} variant="outline" className="mb-2">
              <RefreshCw className="w-4 h-4 mr-2" />
              Generar aleatorio
            </Button>
            
            {/* Style selector */}
            <div className="text-sm font-medium mb-1">Selecciona un estilo:</div>
            <ScrollArea className="h-60 rounded-md border">
              <div className="grid grid-cols-2 gap-2 p-3">
                {AVATAR_STYLES.map((style) => {
                  const isSelected = style === selectedStyle;
                  const previewUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=sample`;
                  
                  return (
                    <Button
                      key={style}
                      variant={isSelected ? "default" : "outline"}
                      className={`h-auto p-2 justify-start ${isSelected ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => handleStyleSelect(style)}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={previewUrl} alt={style} />
                        </Avatar>
                        <span className="text-xs capitalize flex-1">{style.replace('-', ' ')}</span>
                        {isSelected && <Check className="h-4 w-4" />}
                      </div>
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>
            
            <Button onClick={() => setOpen(false)}>Confirmar</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {showUsername && (
        <span className="text-sm font-medium">{username}</span>
      )}
    </div>
  );
}