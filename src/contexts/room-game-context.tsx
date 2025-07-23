"use client";
import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';
import { PlayerInLobby, RoomGameState } from '@/types/player';

interface RoomGameContextValue {
  activeRoomId: string | null;
  setActiveRoomId: (id: string | null) => void;
  gameData: RoomGameState | null;
  connectedPlayers: PlayerInLobby[];
  joinRoom: (roomId: string, player: PlayerInLobby) => Promise<void>;
  leaveRoom: () => Promise<void>;
  broadcastGameState: (state: Partial<RoomGameState>) => Promise<void>;
  isHost: boolean;
}

const RoomGameContext = createContext<RoomGameContextValue | undefined>(undefined);

export const RoomGameProvider = ({ children }: { children: ReactNode }) => {
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [gameData, setGameData] = useState<RoomGameState | null>(null);
  const [connectedPlayers, setConnectedPlayers] = useState<PlayerInLobby[]>([]);
  const [isHost, setIsHost] = useState(false);
  const channelRef = useRef<any>(null);

  const joinRoom = useCallback(async (roomId: string, player: PlayerInLobby) => {
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single();

    if (roomError || !room) {
      throw new Error(roomError?.message || 'Room not found');
    }

    const { error: playerError } = await supabase
      .from('room_players')
      .upsert({
        room_id: roomId,
        player_id: player.id,
        player_data: player,
        last_seen: new Date().toISOString()
      });

    if (playerError) throw playerError;

    const channel = supabase.channel(`room:${roomId}`, {
      config: { presence: { key: player.id } }
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const newPlayers = Object.values(channel.presenceState())
          .flat()
          .map((presence: any) => presence.player_data);
        setConnectedPlayers(newPlayers);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'rooms',
        filter: `id=eq.${roomId}`
      }, (payload) => {
        setGameData(payload.new.game_state);
      })
      .subscribe();

    channelRef.current = channel;
    setActiveRoomId(roomId);
    setIsHost(room.owner_id === player.id);
  }, []);

  const leaveRoom = useCallback(async () => {
    if (!activeRoomId || !channelRef.current) return;

    await channelRef.current.unsubscribe();
    channelRef.current = null;
    setActiveRoomId(null);
    setGameData(null);
    setConnectedPlayers([]);
    setIsHost(false);
  }, [activeRoomId]);

  const broadcastGameState = useCallback(async (state: Partial<RoomGameState>) => {
    if (!activeRoomId || !isHost) return;

    const newState: RoomGameState = {
      current_state: gameData?.current_state || 'IDLE',
      current_letter: gameData?.current_letter || null,
      time_left: gameData?.time_left || 60,
      players_connected: gameData?.players_connected || [],
      ...state,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('rooms')
      .update({ game_state: newState })
      .eq('id', activeRoomId);

    if (error) throw error;

    setGameData(newState);
  }, [activeRoomId, gameData, isHost]);

  useEffect(() => {
    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, []);

  return (
    <RoomGameContext.Provider value={{
      activeRoomId,
      setActiveRoomId,
      gameData,
      connectedPlayers,
      joinRoom,
      leaveRoom,
      broadcastGameState,
      isHost
    }}>
      {children}
    </RoomGameContext.Provider>
  );
};

export const useRoomGameContext = () => {
  const context = useContext(RoomGameContext);
  if (context === undefined) {
    throw new Error('useRoomGameContext must be used within a RoomGameProvider');
  }
  return context;
};