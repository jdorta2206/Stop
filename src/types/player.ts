export interface PlayerInLobby {
  id: string;
  name: string;
  avatar: string;
  score: number;
  isReady: boolean;
  lastSeen?: string;
}

export interface RoomGameState {
  current_state: string;
  current_letter: string | null;
  time_left: number;
  players_connected: PlayerInLobby[];
  current_responses?: Record<string, string>;
  updated_at?: string;
}