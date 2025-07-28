import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  Settings, 
  Copy, 
  Share2, 
  Lock, 
  Unlock,
  Crown,
  UserX,
  MessageSquare,
  Timer,
  Trophy
} from 'lucide-react';
import { toast } from 'sonner';

interface RoomSettings {
  maxPlayers: number;
  roundDuration: number;
  categories: string[];
  isPrivate: boolean;
  password?: string;
  allowSpectators: boolean;
  autoStart: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Player {
  id: string;
  username: string;
  isReady: boolean;
  isHost: boolean;
  score: number;
  status: 'online' | 'away' | 'offline';
  joinedAt: Date;
}

interface EnhancedRoomManagerProps {
  roomId: string;
  currentUserId: string;
  onLeaveRoom: () => void;
  onStartGame: () => void;
}

export default function EnhancedRoomManager({ 
  roomId, 
  currentUserId, 
  onLeaveRoom, 
  onStartGame 
}: EnhancedRoomManagerProps) {
  const [players, setPlayers] = useState<Player[]>([
    {
      id: currentUserId,
      username: 'Tú',
      isReady: false,
      isHost: true,
      score: 0,
      status: 'online',
      joinedAt: new Date()
    },
    {
      id: '2',
      username: 'Player1',
      isReady: true,
      isHost: false,
      score: 150,
      status: 'online',
      joinedAt: new Date(Date.now() - 300000)
    },
    {
      id: '3',
      username: 'Player2',
      isReady: false,
      isHost: false,
      score: 80,
      status: 'away',
      joinedAt: new Date(Date.now() - 600000)
    }
  ]);

  const [roomSettings, setRoomSettings] = useState<RoomSettings>({
    maxPlayers: 6,
    roundDuration: 60,
    categories: ['lugar', 'animal', 'nombre', 'comida', 'color', 'objeto'],
    isPrivate: false,
    allowSpectators: true,
    autoStart: false,
    difficulty: 'medium'
  });

  const [showSettings, setShowSettings] = useState(false);
  const [inviteMessage, setInviteMessage] = useState('');

  const currentPlayer = players.find(p => p.id === currentUserId);
  const isHost = currentPlayer?.isHost || false;
  const readyPlayers = players.filter(p => p.isReady).length;
  const canStartGame = readyPlayers >= 2 && (isHost || roomSettings.autoStart);

  const handleToggleReady = () => {
    setPlayers(prev => prev.map(player => 
      player.id === currentUserId 
        ? { ...player, isReady: !player.isReady }
        : player
    ));
  };

  const handleKickPlayer = (playerId: string) => {
    if (!isHost) return;
    setPlayers(prev => prev.filter(p => p.id !== playerId));
    toast.success('Jugador expulsado de la sala');
  };

  const handlePromoteToHost = (playerId: string) => {
    if (!isHost) return;
    setPlayers(prev => prev.map(player => ({
      ...player,
      isHost: player.id === playerId
    })));
    toast.success('Nuevo anfitrión asignado');
  };

  const handleCopyRoomCode = () => {
    navigator.clipboard.writeText(roomId);
    toast.success('Código de sala copiado al portapapeles');
  };

  const handleShareRoom = async () => {
    const shareData = {
      title: 'Únete a mi partida de STOP',
      text: `${inviteMessage || '¡Ven a jugar STOP conmigo!'}\nCódigo de sala: ${roomId}`,
      url: `${window.location.origin}/room/${roomId}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
        handleCopyRoomCode();
      }
    } else {
      handleCopyRoomCode();
    }
  };

  const handleUpdateSettings = (newSettings: Partial<RoomSettings>) => {
    if (!isHost) return;
    setRoomSettings(prev => ({ ...prev, ...newSettings }));
    toast.success('Configuración de sala actualizada');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case 'away':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />;
      case 'offline':
        return <div className="w-2 h-2 bg-gray-400 rounded-full" />;
      default:
        return null;
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return minutes > 0 ? `${minutes}m ${seconds % 60}s` : `${seconds}s`;
  };

  return (
    <div className="space-y-4">
      {/* Room Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {roomSettings.isPrivate ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                Sala: {roomId}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {players.length}/{roomSettings.maxPlayers} jugadores • {readyPlayers} listos
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyRoomCode}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copiar código
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Invitar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invitar jugadores</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="invite-message">Mensaje personalizado</Label>
                      <Textarea
                        id="invite-message"
                        value={inviteMessage}
                        onChange={(e) => setInviteMessage(e.target.value)}
                        placeholder="¡Ven a jugar STOP conmigo!"
                        className="mt-1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleShareRoom} className="flex-1">
                        <Share2 className="h-4 w-4 mr-2" />
                        Compartir
                      </Button>
                      <Button variant="outline" onClick={handleCopyRoomCode}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar enlace
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {isHost && (
                <Dialog open={showSettings} onOpenChange={setShowSettings}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Configuración de Sala</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="max-players">Máximo de jugadores</Label>
                        <Select 
                          value={roomSettings.maxPlayers.toString()} 
                          onValueChange={(value) => handleUpdateSettings({ maxPlayers: parseInt(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2">2 jugadores</SelectItem>
                            <SelectItem value="4">4 jugadores</SelectItem>
                            <SelectItem value="6">6 jugadores</SelectItem>
                            <SelectItem value="8">8 jugadores</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="round-duration">Duración por ronda</Label>
                        <Select 
                          value={roomSettings.roundDuration.toString()} 
                          onValueChange={(value) => handleUpdateSettings({ roundDuration: parseInt(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 segundos</SelectItem>
                            <SelectItem value="60">1 minuto</SelectItem>
                            <SelectItem value="90">1.5 minutos</SelectItem>
                            <SelectItem value="120">2 minutos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Dificultad</Label>
                        <Select 
                          value={roomSettings.difficulty} 
                          onValueChange={(value: 'easy' | 'medium' | 'hard') => handleUpdateSettings({ difficulty: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Fácil</SelectItem>
                            <SelectItem value="medium">Medio</SelectItem>
                            <SelectItem value="hard">Difícil</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="private-room">Sala privada</Label>
                        <Switch
                          id="private-room"
                          checked={roomSettings.isPrivate}
                          onCheckedChange={(checked) => handleUpdateSettings({ isPrivate: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="allow-spectators">Permitir espectadores</Label>
                        <Switch
                          id="allow-spectators"
                          checked={roomSettings.allowSpectators}
                          onCheckedChange={(checked) => handleUpdateSettings({ allowSpectators: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-start">Inicio automático</Label>
                        <Switch
                          id="auto-start"
                          checked={roomSettings.autoStart}
                          onCheckedChange={(checked) => handleUpdateSettings({ autoStart: checked })}
                        />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Timer className="h-4 w-4" />
              {formatDuration(roomSettings.roundDuration)}
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              {roomSettings.difficulty}
            </div>
            <Badge variant={roomSettings.isPrivate ? "destructive" : "secondary"}>
              {roomSettings.isPrivate ? "Privada" : "Pública"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Players List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Jugadores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {players.map((player) => (
              <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(player.status)}
                    <span className="font-medium">{player.username}</span>
                    {player.isHost && <Crown className="h-4 w-4 text-yellow-500" />}
                  </div>
                  <Badge variant={player.isReady ? "default" : "secondary"} className="text-xs">
                    {player.isReady ? "Listo" : "Esperando"}
                  </Badge>
                  <span className="text-sm text-gray-500">{player.score} pts</span>
                </div>
                
                {isHost && player.id !== currentUserId && (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePromoteToHost(player.id)}
                      title="Hacer anfitrión"
                    >
                      <Crown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleKickPlayer(player.id)}
                      title="Expulsar jugador"
                      className="text-red-600 hover:text-red-700"
                    >
                      <UserX className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Game Controls */}
      <div className="flex gap-2">
        <Button
          onClick={handleToggleReady}
          variant={currentPlayer?.isReady ? "secondary" : "default"}
          className="flex-1"
        >
          {currentPlayer?.isReady ? "Cancelar" : "¡Estoy listo!"}
        </Button>
        
        {(isHost || roomSettings.autoStart) && (
          <Button
            onClick={onStartGame}
            disabled={!canStartGame}
            className="flex-1"
            variant="default"
          >
            Iniciar juego ({readyPlayers}/2)
          </Button>
        )}
        
        <Button
          onClick={onLeaveRoom}
          variant="outline"
        >
          Salir
        </Button>
      </div>
    </div>
  );
}