import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Users, Copy, Check, UserPlus, Share } from 'lucide-react';
import ContactsManager from "./ContactsManager";

interface Player {
  id: string;
  name: string;
  isReady: boolean;
  isVoiceEnabled: boolean;
}

interface Room {
  id: string;
  code: string;
  host: string;
  players: Player[];
  maxPlayers: number;
  status: 'waiting' | 'playing' | 'finished';
}

interface RoomManagerProps {
  language: 'es' | 'en' | 'fr' | 'pt';
  user: { id: string; name: string } | null;
  onRoomJoined: (room: Room) => void;
  onStartGame: () => void;
}

const content = {
  es: {
    createRoom: "Crear Sala",
    joinRoom: "Unirse a Sala",
    roomCode: "Código de sala",
    enterCode: "Ingresa el código",
    maxPlayers: "Jugadores máximo",
    createNewRoom: "Crear nueva sala",
    joinExistingRoom: "Unirse a sala existente",
    waitingForPlayers: "Esperando jugadores...",
    playersInRoom: "Jugadores en la sala",
    ready: "Listo",
    notReady: "No listo",
    startGame: "Iniciar Juego",
    leaveRoom: "Salir de la Sala",
    copyCode: "Copiar código",
    codeCopied: "¡Código copiado!",
    voiceChat: "Chat de voz",
    enableVoice: "Activar micrófono",
    disableVoice: "Desactivar micrófono",
    youAreHost: "Eres el anfitrión",
    waitingForHost: "Esperando al anfitrión para iniciar",
    allPlayersReady: "Todos los jugadores están listos",
    inviteContacts: "Invitar contactos",
    shareInvitation: "Compartir invitación",
    inviteViaWhatsApp: "Invitar por WhatsApp",
  },
  en: {
    createRoom: "Create Room",
    joinRoom: "Join Room",
    roomCode: "Room code",
    enterCode: "Enter the code",
    maxPlayers: "Max players",
    createNewRoom: "Create new room",
    joinExistingRoom: "Join existing room",
    waitingForPlayers: "Waiting for players...",
    playersInRoom: "Players in room",
    ready: "Ready",
    notReady: "Not ready",
    startGame: "Start Game",
    leaveRoom: "Leave Room",
    copyCode: "Copy code",
    codeCopied: "Code copied!",
    voiceChat: "Voice chat",
    enableVoice: "Enable microphone",
    disableVoice: "Disable microphone",
    youAreHost: "You are the host",
    waitingForHost: "Waiting for host to start",
    allPlayersReady: "All players are ready",
    inviteContacts: "Invite contacts",
    shareInvitation: "Share invitation",
    inviteViaWhatsApp: "Invite via WhatsApp",
  },
  fr: {
    createRoom: "Créer une Salle",
    joinRoom: "Rejoindre une Salle",
    roomCode: "Code de la salle",
    enterCode: "Entrez le code",
    maxPlayers: "Joueurs maximum",
    createNewRoom: "Créer une nouvelle salle",
    joinExistingRoom: "Rejoindre une salle existante",
    waitingForPlayers: "En attente des joueurs...",
    playersInRoom: "Joueurs dans la salle",
    ready: "Prêt",
    notReady: "Pas prêt",
    startGame: "Commencer le Jeu",
    leaveRoom: "Quitter la Salle",
    copyCode: "Copier le code",
    codeCopied: "Code copié!",
    voiceChat: "Chat vocal",
    enableVoice: "Activer le microphone",
    disableVoice: "Désactiver le microphone",
    youAreHost: "Vous êtes l'hôte",
    waitingForHost: "En attente de l'hôte pour commencer",
    allPlayersReady: "Tous les joueurs sont prêts",
    inviteContacts: "Inviter des contacts",
    shareInvitation: "Partager l'invitation",
    inviteViaWhatsApp: "Inviter via WhatsApp",
  },
  pt: {
    createRoom: "Criar Sala",
    joinRoom: "Entrar na Sala",
    roomCode: "Código da sala",
    enterCode: "Digite o código",
    maxPlayers: "Jogadores máximo",
    createNewRoom: "Criar nova sala",
    joinExistingRoom: "Entrar em sala existente",
    waitingForPlayers: "Aguardando jogadores...",
    playersInRoom: "Jogadores na sala",
    ready: "Pronto",
    notReady: "Não pronto",
    startGame: "Iniciar Jogo",
    leaveRoom: "Sair da Sala",
    copyCode: "Copiar código",
    codeCopied: "Código copiado!",
    voiceChat: "Chat de voz",
    enableVoice: "Ativar microfone",
    disableVoice: "Desativar microfone",
    youAreHost: "Você é o anfitrião",
    waitingForHost: "Aguardando anfitrião iniciar",
    allPlayersReady: "Todos os jogadores estão prontos",
    inviteContacts: "Convidar contatos",
    shareInvitation: "Compartilhar convite",
    inviteViaWhatsApp: "Convidar via WhatsApp",
  }
};

export default function RoomManager({ language, user, onRoomJoined, onStartGame }: RoomManagerProps) {
  const [mode, setMode] = useState<'menu' | 'create' | 'join' | 'room'>('menu');
  const [roomCode, setRoomCode] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [showContactsManager, setShowContactsManager] = useState(false);

  const t = content[language];

  // Generate room code
  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // Create room
  const createRoom = () => {
    if (!user) return;
    
    const newRoom: Room = {
      id: Math.random().toString(36).substring(2),
      code: generateRoomCode(),
      host: user.id,
      players: [{
        id: user.id,
        name: user.name,
        isReady: false,
        isVoiceEnabled: false
      }],
      maxPlayers,
      status: 'waiting'
    };
    
    setCurrentRoom(newRoom);
    setMode('room');
    onRoomJoined(newRoom);
    
    // Store room in localStorage for demo purposes
    localStorage.setItem('currentRoom', JSON.stringify(newRoom));
  };

  // Join room
  const joinRoom = () => {
    if (!user || !roomCode) return;
    
    // In a real app, this would connect to a server
    // For demo, we'll simulate joining
    const room: Room = {
      id: Math.random().toString(36).substring(2),
      code: roomCode,
      host: 'host_id',
      players: [
        { id: 'host_id', name: 'Host', isReady: true, isVoiceEnabled: false },
        { id: user.id, name: user.name, isReady: false, isVoiceEnabled: false }
      ],
      maxPlayers: 4,
      status: 'waiting'
    };
    
    setCurrentRoom(room);
    setMode('room');
    onRoomJoined(room);
  };

  // Toggle ready status
  const toggleReady = () => {
    if (!currentRoom || !user) return;
    
    const updatedRoom = { ...currentRoom };
    const playerIndex = updatedRoom.players.findIndex(p => p.id === user.id);
    
    if (playerIndex !== -1) {
      updatedRoom.players[playerIndex].isReady = !isReady;
      setIsReady(!isReady);
      setCurrentRoom(updatedRoom);
    }
  };

  // Toggle voice chat
  const toggleVoice = async () => {
    try {
      if (!isVoiceEnabled) {
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMediaStream(stream);
        setIsVoiceEnabled(true);
        
        // Update player status
        if (currentRoom && user) {
          const updatedRoom = { ...currentRoom };
          const playerIndex = updatedRoom.players.findIndex(p => p.id === user.id);
          if (playerIndex !== -1) {
            updatedRoom.players[playerIndex].isVoiceEnabled = true;
            setCurrentRoom(updatedRoom);
          }
        }
      } else {
        // Stop microphone
        if (mediaStream) {
          mediaStream.getTracks().forEach(track => track.stop());
          setMediaStream(null);
        }
        setIsVoiceEnabled(false);
        
        // Update player status
        if (currentRoom && user) {
          const updatedRoom = { ...currentRoom };
          const playerIndex = updatedRoom.players.findIndex(p => p.id === user.id);
          if (playerIndex !== -1) {
            updatedRoom.players[playerIndex].isVoiceEnabled = false;
            setCurrentRoom(updatedRoom);
          }
        }
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  // Copy room code
  const copyRoomCode = async () => {
    if (currentRoom) {
      try {
        await navigator.clipboard.writeText(currentRoom.code);
        setCodeCopied(true);
        setTimeout(() => setCodeCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy code:', error);
      }
    }
  };
  
  // Share room invitation via WhatsApp
  const shareViaWhatsApp = () => {
    if (currentRoom) {
      const message = encodeURIComponent(`Join my STOP game! Room code: ${currentRoom.code}`);
      window.open(`https://wa.me/?text=${message}`, '_blank');
    }
  };

  // Leave room
  const leaveRoom = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }
    setCurrentRoom(null);
    setMode('menu');
    setIsReady(false);
    setIsVoiceEnabled(false);
    setMediaStream(null);
    localStorage.removeItem('currentRoom');
  };

  // Start game (host only)
  const startGame = () => {
    if (currentRoom && user && currentRoom.host === user.id) {
      onStartGame();
    }
  };

  // Check if all players are ready
  const allPlayersReady = currentRoom?.players.every(p => p.isReady) || false;
  const isHost = currentRoom && user && currentRoom.host === user.id;

  if (mode === 'menu') {
    return (
      <div className="max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-bold text-white text-center mb-6">{t.joinRoom}</h2>
        
        <Button
          onClick={() => setMode('create')}
          className="w-full bg-white text-red-600 hover:bg-white/90 py-6 text-lg"
        >
          {t.createRoom}
        </Button>
        
        <Button
          onClick={() => setMode('join')}
          className="w-full bg-red-700 text-white hover:bg-red-800 py-6 text-lg"
        >
          {t.joinRoom}
        </Button>
      </div>
    );
  }

  if (mode === 'create') {
    return (
      <Card className="max-w-md mx-auto bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader>
          <h3 className="text-xl font-bold">{t.createNewRoom}</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm mb-1">{t.maxPlayers}</label>
            <Input
              type="number"
              min="2"
              max="8"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(parseInt(e.target.value) || 2)}
              className="bg-white/20 border-white/30 text-white"
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={createRoom} className="flex-1 bg-white text-red-600 hover:bg-white/90">
              {t.createRoom}
            </Button>
            <Button onClick={() => setMode('menu')} variant="outline" className="bg-white/10 border-white/20 text-white">
              Volver
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (mode === 'join') {
    return (
      <Card className="max-w-md mx-auto bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader>
          <h3 className="text-xl font-bold">{t.joinExistingRoom}</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm mb-1">{t.roomCode}</label>
            <Input
              placeholder={t.enterCode}
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="bg-white/20 border-white/30 text-white placeholder-white/50"
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={joinRoom} disabled={!roomCode} className="flex-1 bg-white text-red-600 hover:bg-white/90">
              {t.joinRoom}
            </Button>
            <Button onClick={() => setMode('menu')} variant="outline" className="bg-white/10 border-white/20 text-white">
              Volver
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (mode === 'room' && currentRoom) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        {showContactsManager && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <ContactsManager 
              language={language}
              roomCode={currentRoom.code}
              onClose={() => setShowContactsManager(false)}
            />
          </div>
        )}
        {/* Room Header */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{t.roomCode}: {currentRoom.code}</h3>
                {isHost && <Badge className="bg-yellow-500 text-black">{t.youAreHost}</Badge>}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowContactsManager(true)}
                  size="sm"
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-green-700"
                >
                  <UserPlus size={16} className="mr-1" />
                  {t.inviteContacts}
                </Button>
                <Button
                  onClick={copyRoomCode}
                  size="sm"
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  {codeCopied ? <Check size={16} /> : <Copy size={16} />}
                  {codeCopied ? t.codeCopied : t.copyCode}
                </Button>
                <Button
                  onClick={leaveRoom}
                  size="sm"
                  variant="destructive"
                >
                  {t.leaveRoom}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Voice Chat Controls */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">{t.voiceChat}</span>
              <Button
                onClick={toggleVoice}
                size="sm"
                className={`${isVoiceEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}`}
              >
                {isVoiceEnabled ? <Mic size={16} /> : <MicOff size={16} />}
                {isVoiceEnabled ? t.disableVoice : t.enableVoice}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Players List */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users size={20} />
              <h4 className="text-lg font-semibold">{t.playersInRoom} ({currentRoom.players.length}/{currentRoom.maxPlayers})</h4>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentRoom.players.map((player) => (
              <div key={player.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    {player.name.charAt(0)}
                  </div>
                  <span className="font-medium">{player.name}</span>
                  {player.id === currentRoom.host && <Badge variant="secondary">Host</Badge>}
                </div>
                <div className="flex items-center gap-2">
                  {player.isVoiceEnabled && <Mic size={16} className="text-green-400" />}
                  <Badge className={player.isReady ? 'bg-green-600' : 'bg-gray-600'}>
                    {player.isReady ? t.ready : t.notReady}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Game Controls */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  onClick={toggleReady}
                  className={`${isReady ? 'bg-gray-600 hover:bg-gray-700' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {isReady ? t.notReady : t.ready}
                </Button>
                
                <Button
                  onClick={shareViaWhatsApp}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Share size={16} className="mr-1" />
                  {t.inviteViaWhatsApp}
                </Button>
              </div>
              
              {isHost && (
                <Button
                  onClick={startGame}
                  disabled={!allPlayersReady || currentRoom.players.length < 2}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                >
                  {t.startGame}
                </Button>
              )}
            </div>
            
            <div className="text-center text-sm text-white/70">
              {isHost ? (
                allPlayersReady && currentRoom.players.length >= 2 ? t.allPlayersReady : t.waitingForPlayers
              ) : (
                t.waitingForHost
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}