import React, { useState } from 'react';
import RealTimeChat from './RealTimeChat';
import EnhancedRoomManager from './EnhancedRoomManager';
import PushNotifications from './PushNotifications';

interface MultiplayerEnhancementsProps {
  roomId: string;
  currentUserId: string;
  currentUsername: string;
  onLeaveRoom: () => void;
  onStartGame: () => void;
}

export default function MultiplayerEnhancements({
  roomId,
  currentUserId,
  currentUsername,
  onLeaveRoom,
  onStartGame
}: MultiplayerEnhancementsProps) {
  const [showChat, setShowChat] = useState(false);

  const handleJoinRoom = (newRoomId: string) => {
    // Logic to join a different room
    console.log(`Joining room: ${newRoomId}`);
  };

  const handleOpenChat = () => {
    setShowChat(true);
  };

  const handleToggleChat = () => {
    setShowChat(!showChat);
  };

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <div className="flex justify-end">
        <PushNotifications
          userId={currentUserId}
          username={currentUsername}
          onJoinRoom={handleJoinRoom}
          onOpenChat={handleOpenChat}
        />
      </div>

      {/* Room Manager */}
      <EnhancedRoomManager
        roomId={roomId}
        currentUserId={currentUserId}
        onLeaveRoom={onLeaveRoom}
        onStartGame={onStartGame}
      />

      {/* Real-time Chat */}
      <RealTimeChat
        roomId={roomId}
        currentUserId={currentUserId}
        currentUsername={currentUsername}
        onToggleChat={handleToggleChat}
        isMinimized={!showChat}
      />
    </div>
  );
}