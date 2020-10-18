import React, { useEffect, useRef, useState } from 'react';
import Communication from '../components/Communication';
import { connect } from 'react-redux';
import store from '../store';
import io from 'socket.io-client';
import media from '../utils/media';

/**
 * Room
 * Create or access to a room
 */
const Room = ({ addRoom, match, isVideoEnabled, isAudioEnabled, setVideo, setAudio }) => {
	const [ bridge, setBridge ] = useState('');
	const [ user, setUser ] = useState('');
	const [ currentMessage, setMessage ] = useState('');
	const [ currentSid, setSid ] = useState('');
	const remoteVideo = useRef(null);
	const localVideo = useRef(null);
	const socket = useRef(io.connect('https://localhost:5000'));
	const getUserMedia = useRef(
		navigator.mediaDevices
			.getUserMedia({
				audio: true,
				video: true
			})
			.catch((e) => alert('getUserMedia() error: ' + e.name))
	);
	const currentMedia = useRef();
	const roomId = match.params.room;

	useEffect(
		() => {
			const onStream = (stream) => {
        console.log('[Room] onStream');
				remoteVideo.srcObject = stream;
				setBridge('established');
			};
			const onApprove = ({ message, sid }) => {
        console.log('[Room] onApprove', message, sid);
				setBridge('approve');
				setMessage(message);
				setSid(sid);
			};
			const onJoin = () => {
        console.log('[Room] onJoin');
				setBridge('join');
				setUser('guest');
			};
			const onCreate = () => {
        console.log('[Room] onCreate');
				setBridge('create');
				setUser('host');
			};
			const onFull = () => {
        console.log('[Room] onFull');
				setBridge('full');
      };
      const onHangUp = () => {
        console.log('[Room] onHangUp');
        setBridge('guest-hangup');
				setUser('guest');
      };

      addRoom(roomId);

			if (!currentMedia.current) {
        console.log('[Room] new media');
				currentMedia.current = media({
					socket,
					onStream,
					isHost: user === 'host',
					getUserMedia,
					onApprove,
					onJoin,
					onCreate,
					isVideoEnabled,
					isAudioEnabled,
          onFull,
          onHangUp
				});
			}
		},
		[ addRoom, isAudioEnabled, isVideoEnabled, roomId, user ]
  );

  const handleInput = (e) => {
    const msg = e.target.value;
    console.log('[Room] handleInput', msg);
    setMessage(msg);
  }
  const send = (e) => {
    e.preventDefault();
    const authInfo = {
      sid: currentSid,
      message: currentMessage,
      audio: isAudioEnabled,
      video: isVideoEnabled
    }
    console.log('[Room] send', authInfo);
    socket.emit('auth', authInfo);
    setBridge('connecting');
  }
  const handleInvitation = (e) => {
    e.preventDefault();
    const status = e.target.dataset.ref;
    console.log('[Room] handleInvitation', status, currentSid);
    socket.emit([status], currentSid);
    setBridge('connecting');
  }
  const toggleVideo = () => {
    console.log('[Room] toggleVideo', !isVideoEnabled);
    media.toggleVideo(!isVideoEnabled);
    setVideo(!isVideoEnabled);
  }
  const toggleAudio = () => {
    console.log('[Room] toggleAudio', !isAudioEnabled);
    media.toggleAudio(!isAudioEnabled);
    setAudio(!isAudioEnabled);
  }
  const handleHangup = () => {
    console.log('[Room] handleHangup');
    media.hangup();
  }

	return (
		<div>
			<div className={`media-bridge ${bridge}`}>
				<video className="remote-video" ref={remoteVideo} autoPlay />
				<video className="local-video" ref={localVideo} autoPlay muted />
			</div>
			<Communication
				message={currentMessage}
        sid={currentSid}
        audio={isAudioEnabled}
        video={isVideoEnabled}
				toggleVideo={toggleVideo}
				toggleAudio={toggleAudio}
				send={send}
				handleHangup={handleHangup}
				handleInput={handleInput}
				handleInvitation={handleInvitation}
			/>
		</div>
	);
};

const mapStateToProps = ({ rooms, video, audio }) => ({ rooms, isVideoEnabled: video, isAudioEnabled: audio });
const mapDispatchToProps = (dispatch, ownProps) => ({
  addRoom: (roomId) => store.dispatch({ type: 'ADD_ROOM', room: roomId }),
  setVideo: boo => store.dispatch({type: 'SET_VIDEO', video: boo}),
  setAudio: boo => store.dispatch({type: 'SET_AUDIO', audio: boo})
});
export default connect(mapStateToProps, mapDispatchToProps)(Room);
