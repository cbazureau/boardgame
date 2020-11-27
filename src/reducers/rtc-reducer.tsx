import _get from 'lodash/get';

const initalState: RTCstore = {
  game: undefined,
  rooms: [],
  users: [],
  isVideoEnabled: true,
  isAudioEnabled: true,
};

type ActionType = {
  type: string;
  game?: GameUpdate | Game;
  users?: Array<User>;
  room?: Room;
  isVideoEnabled?: boolean;
  isAudioEnabled?: boolean;
};

const rtcReducer = (state: RTCstore = initalState, action: ActionType): RTCstore => {
  switch (action.type) {
    case 'UPDATE_GAME':
      console.log('[reducer] UPDATE_GAME');
      return {
        ...state,
        game:
          // eslint-disable-next-line no-nested-ternary
          _get(action, 'game.name')
            ? (action.game as Game)
            : state.game
            ? { ...state.game, ...(action.game as GameUpdate) }
            : undefined,
        users: action.users || state.users,
      };
    case 'ADD_ROOM':
      if (!action.room || state.rooms.includes(action.room)) return state;
      return { ...state, rooms: [...state.rooms, action.room] };
    case 'SET_VIDEO':
      return { ...state, isVideoEnabled: !!action.isVideoEnabled };
    case 'SET_AUDIO':
      return { ...state, isAudioEnabled: !!action.isAudioEnabled };
    default:
      return state;
  }
};
export default rtcReducer;
