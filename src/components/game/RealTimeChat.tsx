import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Users, MessageCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'system' | 'game';
}

interface RealTimeChatProps {
  roomId: string;
  currentUserId: string;
  currentUsername: string;
  onToggleChat?: () => void;
  isMinimized?: boolean;
}

export default function RealTimeChat({ 
  roomId, 
  currentUserId, 
  currentUsername, 
  onToggleChat, 
  isMinimized = false 
}: RealTimeChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Mock WebSocket connection - replace with actual implementation
  useEffect(() => {
    // Simulate real-time messages
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        userId: 'system',
        username: 'Sistema',
        message: `¡Bienvenido a la sala ${roomId}!`,
        timestamp: new Date(),
        type: 'system'
      }
    ];
    setMessages(mockMessages);
    setOnlineUsers([currentUsername, 'Player1', 'Player2']);

    // Simulate incoming messages
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomMessages = [
          '¡Buena suerte a todos!',
          '¿Listos para la siguiente ronda?',
          'Esa palabra con M estaba difícil',
          '¡Rápido, quedan 10 segundos!'
        ];
        const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        const newMsg: ChatMessage = {
          id: Date.now().toString(),
          userId: 'player1',
          username: 'Player1',
          message: randomMessage,
          timestamp: new Date(),
          type: 'message'
        };
        setMessages(prev => [...prev, newMsg]);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [roomId, currentUsername]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUserId,
      username: currentUsername,
      message: newMessage.trim(),
      timestamp: new Date(),
      type: 'message'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Here you would send the message via WebSocket
    // webSocket.send(JSON.stringify({ type: 'message', data: message }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    } else {
      // Handle typing indicator
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Simulate typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        // Stop typing indicator
      }, 2000);
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageStyle = (type: string) => {
    switch (type) {
      case 'system':
        return 'text-blue-600 bg-blue-50 italic text-center py-1 px-2 rounded text-sm';
      case 'game':
        return 'text-green-600 bg-green-50 italic text-center py-1 px-2 rounded text-sm';
      default:
        return '';
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggleChat}
          className="rounded-full h-12 w-12 shadow-lg"
          variant="default"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 h-96 z-50 shadow-xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Chat de Sala
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              {onlineUsers.length}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleChat}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-2">
        <ScrollArea className="h-60 mb-2">
          <div className="space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className={msg.type !== 'message' ? getMessageStyle(msg.type) : ''}>
                {msg.type === 'message' ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-medium text-gray-700">{msg.username}</span>
                      <span>{formatTime(msg.timestamp)}</span>
                    </div>
                    <div className="text-sm bg-gray-100 rounded px-2 py-1">
                      {msg.message}
                    </div>
                  </div>
                ) : (
                  <div>{msg.message}</div>
                )}
              </div>
            ))}
            {isTyping.length > 0 && (
              <div className="text-xs text-gray-500 italic">
                {isTyping.join(', ')} está escribiendo...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe un mensaje..."
            className="text-sm"
            maxLength={200}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="sm"
            className="px-3"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-xs text-gray-400 mt-1">
          Usuarios conectados: {onlineUsers.join(', ')}
        </div>
      </CardContent>
    </Card>
  );
}