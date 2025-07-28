import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Bell, BellRing, Users, GamepadIcon, Trophy, MessageSquare, X, Check } from 'lucide-react';
import { toast } from 'sonner';

interface GameInvitation {
  id: string;
  fromUser: string;
  fromUserId: string;
  roomId: string;
  message: string;
  timestamp: Date;
  type: 'room_invite' | 'game_start' | 'game_finish' | 'chat_mention';
  status: 'pending' | 'accepted' | 'declined' | 'expired';
}

interface PushNotificationsProps {
  userId: string;
  username: string;
  onJoinRoom: (roomId: string) => void;
  onOpenChat: () => void;
}

export default function PushNotifications({ 
  userId, 
  username, 
  onJoinRoom, 
  onOpenChat 
}: PushNotificationsProps) {
  const [notifications, setNotifications] = useState<GameInvitation[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check current notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // Mock notifications for demo
    const mockNotifications: GameInvitation[] = [
      {
        id: '1',
        fromUser: 'Player1',
        fromUserId: 'user1',
        roomId: 'ROOM123',
        message: '¡Únete a mi partida de STOP!',
        timestamp: new Date(Date.now() - 300000),
        type: 'room_invite',
        status: 'pending'
      },
      {
        id: '2',
        fromUser: 'Player2',
        fromUserId: 'user2',
        roomId: 'ROOM456',
        message: 'Te mencioné en el chat',
        timestamp: new Date(Date.now() - 120000),
        type: 'chat_mention',
        status: 'pending'
      },
      {
        id: '3',
        fromUser: 'Sistema',
        fromUserId: 'system',
        roomId: 'ROOM789',
        message: '¡La partida ha comenzado!',
        timestamp: new Date(Date.now() - 60000),
        type: 'game_start',
        status: 'pending'
      }
    ];

    setNotifications(mockNotifications);

    // Simulate receiving new notifications
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const newNotification: GameInvitation = {
          id: Date.now().toString(),
          fromUser: `Player${Math.floor(Math.random() * 10)}`,
          fromUserId: `user${Math.floor(Math.random() * 10)}`,
          roomId: `ROOM${Math.floor(Math.random() * 1000)}`,
          message: '¡Nueva invitación a jugar!',
          timestamp: new Date(),
          type: 'room_invite',
          status: 'pending'
        };

        setNotifications(prev => [newNotification, ...prev]);
        showPushNotification(newNotification);
        toast.info(`Nueva invitación de ${newNotification.fromUser}`);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        toast.success('Notificaciones activadas');
      } else {
        toast.error('Notificaciones denegadas');
      }
    }
  };

  const showPushNotification = (notification: GameInvitation) => {
    if (notificationPermission === 'granted' && 'Notification' in window) {
      const notif = new Notification(`STOP Game - ${notification.fromUser}`, {
        body: notification.message,
        icon: '/images/favicon.jpg',
        badge: '/images/favicon.jpg',
        tag: notification.id,
        renotify: true
      });

      notif.onclick = () => {
        window.focus();
        if (notification.type === 'room_invite') {
          handleAcceptInvitation(notification.id);
        } else if (notification.type === 'chat_mention') {
          onOpenChat();
        }
        notif.close();
      };

      // Auto close after 10 seconds
      setTimeout(() => notif.close(), 10000);
    }
  };

  const handleAcceptInvitation = (notificationId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && notification.type === 'room_invite') {
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, status: 'accepted' as const }
            : n
        )
      );
      onJoinRoom(notification.roomId);
      toast.success(`Te uniste a la sala ${notification.roomId}`);
    }
  };

  const handleDeclineInvitation = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId 
          ? { ...n, status: 'declined' as const }
          : n
      )
    );
    toast.info('Invitación rechazada');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'room_invite':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'game_start':
        return <GamepadIcon className="h-4 w-4 text-green-500" />;
      case 'game_finish':
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'chat_mention':
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationTitle = (type: string) => {
    switch (type) {
      case 'room_invite':
        return 'Invitación a jugar';
      case 'game_start':
        return 'Juego iniciado';
      case 'game_finish':
        return 'Juego terminado';
      case 'chat_mention':
        return 'Mención en chat';
      default:
        return 'Notificación';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)}h`;
    return `Hace ${Math.floor(diffInMinutes / 1440)}d`;
  };

  const pendingNotifications = notifications.filter(n => n.status === 'pending');
  const unreadCount = pendingNotifications.length;

  return (
    <>
      {/* Notification Bell Button */}
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowNotifications(true)}
          className="relative"
        >
          {unreadCount > 0 ? (
            <BellRing className="h-4 w-4" />
          ) : (
            <Bell className="h-4 w-4" />
          )}
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Notifications Dialog */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificaciones
                {unreadCount > 0 && (
                  <Badge variant="destructive">{unreadCount}</Badge>
                )}
              </DialogTitle>
              
              {notificationPermission !== 'granted' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={requestNotificationPermission}
                >
                  Activar
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No hay notificaciones</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`transition-all ${
                    notification.status === 'pending' 
                      ? 'border-blue-200 bg-blue-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">
                              {getNotificationTitle(notification.type)}
                            </h4>
                            <Badge 
                              variant={
                                notification.status === 'pending' 
                                  ? 'default' 
                                  : notification.status === 'accepted'
                                  ? 'secondary'
                                  : 'outline'
                              }
                              className="text-xs"
                            >
                              {notification.status === 'pending' ? 'Nuevo' : 
                               notification.status === 'accepted' ? 'Aceptado' : 'Rechazado'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">{notification.fromUser}:</span>{' '}
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            {notification.type === 'room_invite' && (
                              <span className="text-xs text-blue-600 font-mono">
                                {notification.roomId}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {notification.status === 'pending' && (
                        <div className="flex flex-col gap-1">
                          {notification.type === 'room_invite' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleAcceptInvitation(notification.id)}
                                className="h-7 px-2"
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Unirse
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeclineInvitation(notification.id)}
                                className="h-7 px-2"
                              >
                                <X className="h-3 w-3 mr-1" />
                                Rechazar
                              </Button>
                            </>
                          )}
                          
                          {notification.type === 'chat_mention' && (
                            <Button
                              size="sm"
                              onClick={() => {
                                onOpenChat();
                                setShowNotifications(false);
                              }}
                              className="h-7 px-2"
                            >
                              Ver chat
                            </Button>
                          )}
                          
                          {notification.type === 'game_start' && (
                            <Button
                              size="sm"
                              onClick={() => {
                                onJoinRoom(notification.roomId);
                                setShowNotifications(false);
                              }}
                              className="h-7 px-2"
                            >
                              Ir al juego
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {notificationPermission === 'default' && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 mb-2">
                Activa las notificaciones para recibir invitaciones instantáneas
              </p>
              <Button
                size="sm"
                onClick={requestNotificationPermission}
                className="w-full"
              >
                Activar notificaciones
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}