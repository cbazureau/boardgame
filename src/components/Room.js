import React, { useEffect, useRef, useState } from 'react';
import Communication from './Communication';
import { connect } from 'react-redux';
import store from '../store';
import io from 'socket.io-client';
import { toggleAudio, setUserForMedia, toggleVideo, hangup, createCommunication } from '../utils/media';
import useBeforeUnload from '../utils/useBeforeUnload';
import './Room.css';
import RoomControls from './RoomControl';
import Game from './Game';
import STATUS from '../utils/status';

/**
 * Room
 * Create or access to a room
 */
const Room = ({ addRoom, match, isVideoEnabled, isAudioEnabled, setVideo, setAudio, game, updateGame }) => {
	const socketDomain = window.location.host === 'localhost:3000' ? 'localhost:5000' : window.location.host;
	const protocol = window.location.host.indexOf('localhost') > -1 ? 'http' : 'https';

	const [ bridge, setBridge ] = useState('');
	const [ user, setUser ] = useState('');
	const [ currentMessage, setMessage ] = useState('');
	const [ currentSid, setSid ] = useState('');
	const remoteVideo = useRef(null);
	const localVideo = useRef(null);
	const socket = useRef(io.connect(`${protocol}://${socketDomain}`));
	const isMediaActive = useRef(false);
	const roomId = match.params.room;

	const onHangUp = () => {
		console.log('[Room] onHangUp');
		setBridge(STATUS.GUEST_HANGUP);
		setUser('guest');
	};

	useBeforeUnload(() => {
		if (isMediaActive.current) {
			console.log('[Room] useBeforeUnload handleHangup');
			hangup({ onHangUp });
		}
	});

	useEffect(
		() => {
			if (isMediaActive.current) {
				setUserForMedia(user);
			}
		},
		[ user ]
	);

	useEffect(
		() => {
			const onRemoteStream = (stream) => {
				console.log('[Room] onRemoteStream');
				remoteVideo.current.srcObject = stream;
				setBridge(STATUS.ESTABLISHED);
			};
			const onLocalStream = (stream) => {
				console.log('[Room] onLocalStream');
				localVideo.current.srcObject = stream;
			};
			const onApprove = ({ message, sid }) => {
				console.log('[Room] onApprove', message, sid);
				setMessage(message);
				setSid(sid);
				// Manuel accept
				setBridge(STATUS.APPROVE);

				// Auto accept
				// socket.current.emit('accept', sid);
				// setBridge(STATUS.CONNECTING);
			};
			const onJoin = () => {
				console.log('[Room] onJoin');
				setBridge(STATUS.JOIN);
				setUser('guest');
			};
			const onCreate = () => {
				console.log('[Room] onCreate');
				setBridge(STATUS.CREATE);
				setUser('host');
			};
			const onFull = () => {
				console.log('[Room] onFull');
				setBridge(STATUS.FULL);
			};

			const onRemoteHangup = () => {
				setBridge(STATUS.HOST_HANGUP);
				setUser('host');
			};

			addRoom(roomId);

			if (!isMediaActive.current) {
				console.log('[Room] createCommunication');
				createCommunication({
					socket: socket.current,
					isVideoEnabled,
					isAudioEnabled,
					onLocalStream,
					onRemoteStream,
					user
				});
				isMediaActive.current = true;
				socket.current.on('hangup', onRemoteHangup);
				socket.current.on('create', onCreate);
				socket.current.on('full', onFull);
				socket.current.on('join', onJoin);
				socket.current.on('approve', onApprove);
				socket.current.on('update', updateGame);
				socket.current.emit('find', { roomId, user: 'Bob', game });
			}
		},
		[ addRoom, isAudioEnabled, isVideoEnabled, user, roomId, game, updateGame ]
	);

	const send = () => {
		const authInfo = {
			sid: currentSid,
			message: 'Please invite me !',
			audio: isAudioEnabled,
			video: isVideoEnabled
		};
		console.log('[Room] send', authInfo);
		socket.current.emit('auth', authInfo);
		setBridge(STATUS.CONNECTING);
	};
	const handleInvitation = (e) => {
		e.preventDefault();
		const status = e.target.dataset.ref;
		console.log('[Room] handleInvitation', status, currentSid);
		socket.current.emit([ status ], currentSid);
		setBridge(STATUS.CONNECTING);
	};
	const onToggleVideo = () => {
		console.log('[Room] toggleVideo', !isVideoEnabled);
		toggleVideo(!isVideoEnabled);
		setVideo(!isVideoEnabled);
	};
	const onToggleAudio = () => {
		console.log('[Room] toggleAudio', !isAudioEnabled);
		toggleAudio(!isAudioEnabled);
		setAudio(!isAudioEnabled);
	};
	const handleHangup = () => {
		console.log('[Room] handleHangup');
		hangup({ onHangUp });
	};

	const updateSocketGame = ({ game }) => {
		socket.current.emit('play', { game });
	};

	return (
		<div className="Room">
			<div className="Room__game">
				<Game game={game} updateGame={updateSocketGame} />
			</div>

			<div className={`Room__videos ${bridge === STATUS.ESTABLISHED ? 'is-established' : ''}`}>
				<div className="Room__videobox">
					<video className="Room__video is-remote" ref={remoteVideo} autoPlay />
				</div>
				<div className="Room__videobox">
					<video className="Room__video is-local" ref={localVideo} autoPlay muted />
					<RoomControls
						bridge={bridge}
						audio={isAudioEnabled}
						video={isVideoEnabled}
						toggleVideo={onToggleVideo}
						toggleAudio={onToggleAudio}
						handleHangup={handleHangup}
					/>
				</div>
			</div>
			<Communication bridge={bridge} message={currentMessage} send={send} handleInvitation={handleInvitation} />
		</div>
	);
};

const mapStateToProps = ({ rtc: { game, rooms, isVideoEnabled, isAudioEnabled } }) => ({
	game,
	rooms,
	isVideoEnabled,
	isAudioEnabled
});
const mapDispatchToProps = (dispatch, ownProps) => ({
	updateGame: ({ game }) => store.dispatch({ type: 'UPDATE_GAME', game }),
	addRoom: (roomId) => store.dispatch({ type: 'ADD_ROOM', room: roomId }),
	setVideo: (enabled) => store.dispatch({ type: 'SET_VIDEO', isVideoEnabled: enabled }),
	setAudio: (enabled) => store.dispatch({ type: 'SET_AUDIO', isAudioEnabled: enabled })
});
export default connect(mapStateToProps, mapDispatchToProps)(Room);
