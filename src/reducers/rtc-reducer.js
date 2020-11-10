import game from '../game/chess';

const initalState = {
	game,
	rooms: [],
	isVideoEnabled: true,
	isAudioEnabled: true
};

const rtcReducer = (state = initalState, action) => {
	switch (action.type) {
		case 'UPDATE_GAME':
			console.log('[reducer] UPDATE_GAME');
			return { ...state, game: action.game };
		case 'ADD_ROOM':
			if (state.rooms.includes(action.room)) return state;
			return { ...state, rooms: [ ...state.rooms, action.room ] };
		case 'SET_VIDEO':
			return { ...state, isVideoEnabled: action.isVideoEnabled };
		case 'SET_AUDIO':
			return { ...state, isAudioEnabled: action.isAudioEnabled };
		default:
			return state;
	}
};
export default rtcReducer;
