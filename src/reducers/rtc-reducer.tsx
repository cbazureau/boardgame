import _get from 'lodash/get';

const initalState: RTCstore = {
  game: undefined,
  proposedGame: null,
  users: [],
  currentUser: undefined,
  isVideoEnabled: true,
  isAudioEnabled: true,
};

type ActionType = {
  type: string;
  proposedGame?: Game | null;
  game?: GameUpdate | Game;
  currentUser?: User;
  users?: Array<User>;
  room?: Room;
  isVideoEnabled?: boolean;
  isAudioEnabled?: boolean;
};

const rtcReducer = (state: RTCstore = initalState, action: ActionType): RTCstore => {
  switch (action.type) {
    case 'UPDATE_GAME':
      console.log('UPDATE_GAME', action.game);
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
    case 'SET_PROPOSED_GAME':
      return { ...state, proposedGame: action.proposedGame || null };
    case 'UPDATE_CURRENTUSER':
      console.log('UPDATE_CURRENTUSER', action.currentUser);
      return { ...state, currentUser: action.currentUser };
    case 'SET_VIDEO':
      return { ...state, isVideoEnabled: !!action.isVideoEnabled };
    case 'SET_AUDIO':
      return { ...state, isAudioEnabled: !!action.isAudioEnabled };
    default:
      return state;
  }
};
export default rtcReducer;
