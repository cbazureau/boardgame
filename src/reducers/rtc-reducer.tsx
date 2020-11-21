import Game from '../components/Game';
import game from '../game/chess';
import { prepare } from '../utils/game';

const initalState: RTCstore = {
  game: prepare(game),
  rooms: [],
  isVideoEnabled: true,
  isAudioEnabled: true,
};

type ActionType = {
  type: string;
  game?: Game;
  room?: Room;
  isVideoEnabled?: boolean;
  isAudioEnabled?: boolean;
};

const rtcReducer = (state: RTCstore = initalState, action: ActionType) => {
  switch (action.type) {
    case 'UPDATE_GAME':
      console.log('[reducer] UPDATE_GAME');
      return { ...state, game: { ...state.game, ...action.game } };
    case 'ADD_ROOM':
      if (!action.room || state.rooms.includes(action.room)) return state;
      return { ...state, rooms: [...state.rooms, action.room] };
    case 'SET_VIDEO':
      return { ...state, isVideoEnabled: action.isVideoEnabled };
    case 'SET_AUDIO':
      return { ...state, isAudioEnabled: action.isAudioEnabled };
    default:
      return state;
  }
};
export default rtcReducer;
