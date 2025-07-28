import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface VoiceChatProps {
  roomId: string;
  userId: string;
  userName: string;
  language: 'es' | 'en' | 'fr' | 'pt';
}

interface PeerConnection {
  id: string;
  name: string;
  connection: RTCPeerConnection;
  stream?: MediaStream;
}

const content = {
  es: {
    voiceChat: "Chat de Voz",
    micOn: "Micrófono activado",
    micOff: "Micrófono desactivado",
    speakerOn: "Altavoz activado",
    speakerOff: "Altavoz desactivado",
    connecting: "Conectando...",
    connected: "Conectado",
    disconnected: "Desconectado",
    error: "Error de conexión",
  },
  en: {
    voiceChat: "Voice Chat",
    micOn: "Microphone on",
    micOff: "Microphone off",
    speakerOn: "Speaker on",
    speakerOff: "Speaker off",
    connecting: "Connecting...",
    connected: "Connected",
    disconnected: "Disconnected",
    error: "Connection error",
  },
  fr: {
    voiceChat: "Chat Vocal",
    micOn: "Microphone activé",
    micOff: "Microphone désactivé",
    speakerOn: "Haut-parleur activé",
    speakerOff: "Haut-parleur désactivé",
    connecting: "Connexion...",
    connected: "Connecté",
    disconnected: "Déconnecté",
    error: "Erreur de connexion",
  },
  pt: {
    voiceChat: "Chat de Voz",
    micOn: "Microfone ligado",
    micOff: "Microfone desligado",
    speakerOn: "Alto-falante ligado",
    speakerOff: "Alto-falante desligado",
    connecting: "Conectando...",
    connected: "Conectado",
    disconnected: "Desconectado",
    error: "Erro de conexão",
  }
};

export default function VoiceChat({ roomId, userId, userName, language }: VoiceChatProps) {
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<Map<string, PeerConnection>>(new Map());
  
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudiosRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  
  const t = content[language];

  // WebRTC configuration
  const rtcConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  // Initialize local media stream
  const initializeLocalStream = async () => {
    try {
      setConnectionStatus('connecting');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      setLocalStream(stream);
      setConnectionStatus('connected');
      
      // Mute by default
      stream.getAudioTracks().forEach(track => {
        track.enabled = false;
      });
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setConnectionStatus('error');
    }
  };

  // Toggle microphone
  const toggleMicrophone = async () => {
    if (!localStream) {
      await initializeLocalStream();
      return;
    }

    const audioTracks = localStream.getAudioTracks();
    if (audioTracks.length > 0) {
      const isEnabled = !isMicEnabled;
      audioTracks[0].enabled = isEnabled;
      setIsMicEnabled(isEnabled);
      
      // Notify other peers about mic status change
      broadcastMicStatus(isEnabled);
    }
  };

  // Toggle speaker
  const toggleSpeaker = () => {
    setIsSpeakerEnabled(!isSpeakerEnabled);
    
    // Mute/unmute all remote audio elements
    remoteAudiosRef.current.forEach(audio => {
      audio.muted = isSpeakerEnabled; // Will be opposite after state update
    });
  };

  // Broadcast microphone status to other peers
  const broadcastMicStatus = (enabled: boolean) => {
    // In a real implementation, this would send the status through WebSocket or signaling server
    console.log(`Broadcasting mic status: ${enabled ? 'enabled' : 'disabled'}`);
  };

  // Create peer connection
  const createPeerConnection = (peerId: string, peerName: string): RTCPeerConnection => {
    const pc = new RTCPeerConnection(rtcConfig);
    
    // Add local stream to peer connection
    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
    }

    // Handle remote stream
    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
      handleRemoteStream(peerId, peerName, remoteStream);
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        // Send ICE candidate to peer through signaling server
        console.log('ICE candidate:', event.candidate);
      }
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log(`Peer ${peerId} connection state:`, pc.connectionState);
    };

    return pc;
  };

  // Handle remote stream
  const handleRemoteStream = (peerId: string, peerName: string, stream: MediaStream) => {
    // Create audio element for remote stream
    const audio = new Audio();
    audio.srcObject = stream;
    audio.autoplay = true;
    audio.muted = !isSpeakerEnabled;
    
    // Store audio element reference
    remoteAudiosRef.current.set(peerId, audio);
    
    // Update peers state
    setPeers(prev => {
      const newPeers = new Map(prev);
      const existingPeer = newPeers.get(peerId);
      if (existingPeer) {
        existingPeer.stream = stream;
      }
      return newPeers;
    });
  };

  // Simulate joining a room (in real app, this would connect to signaling server)
  const joinVoiceRoom = async () => {
    await initializeLocalStream();
    
    // Simulate other peers in the room
    // In a real implementation, you would get this list from the signaling server
    const mockPeers = [
      { id: 'peer1', name: 'Player 1' },
      { id: 'peer2', name: 'Player 2' }
    ].filter(peer => peer.id !== userId);

    mockPeers.forEach(peer => {
      const pc = createPeerConnection(peer.id, peer.name);
      setPeers(prev => new Map(prev).set(peer.id, {
        id: peer.id,
        name: peer.name,
        connection: pc
      }));
    });
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Close all peer connections
      peers.forEach(peer => {
        peer.connection.close();
      });
      
      // Stop local stream
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      
      // Remove audio elements
      remoteAudiosRef.current.forEach(audio => {
        audio.pause();
        audio.srcObject = null;
      });
    };
  }, []);

  // Auto-join voice room when component mounts
  useEffect(() => {
    joinVoiceRoom();
  }, [roomId]);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-400';
      case 'connecting': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return t.connected;
      case 'connecting': return t.connecting;
      case 'error': return t.error;
      default: return t.disconnected;
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold">{t.voiceChat}</h4>
            <span className={`text-sm ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={toggleMicrophone}
              size="sm"
              disabled={connectionStatus !== 'connected'}
              className={`${
                isMicEnabled 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isMicEnabled ? <Mic size={16} /> : <MicOff size={16} />}
            </Button>
            
            <Button
              onClick={toggleSpeaker}
              size="sm"
              className={`${
                isSpeakerEnabled 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {isSpeakerEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </Button>
          </div>
        </div>
        
        {/* Voice status indicators */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${isMicEnabled ? 'bg-green-400' : 'bg-red-400'}`} />
            <span>{isMicEnabled ? t.micOn : t.micOff}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${isSpeakerEnabled ? 'bg-blue-400' : 'bg-gray-400'}`} />
            <span>{isSpeakerEnabled ? t.speakerOn : t.speakerOff}</span>
          </div>
        </div>
        
        {/* Connected peers */}
        {peers.size > 0 && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="text-sm text-white/70 mb-2">
              {language === 'es' ? 'Conectado con:' : 
               language === 'fr' ? 'Connecté avec:' :
               language === 'pt' ? 'Conectado com:' : 'Connected with:'}
            </div>
            {Array.from(peers.values()).map(peer => (
              <div key={peer.id} className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span>{peer.name}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}