import React, { useCallback, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import Communication from './Communication';
import store from '../store';
import {
  toggleAudio,
  setUserForMedia,
  toggleVideo,
  hangup,
  createLocalStream,
} from '../utils/media';
import useBeforeUnload from '../utils/useBeforeUnload';
import './Room.css';
import RoomControls from './RoomControl';
import Game from './Game';
import STATUS from '../utils/status';

type Props = {
  match: any;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  setVideo: (val: boolean) => void;
  setAudio: (val: boolean) => void;
  game: Game | void;
  updateGame: (updateInfos: { game?: GameUpdate | Game; users?: Array<User> }) => void;
};

/**
 * Room
 * Create or access to a room
 */
const Room = ({
  match,
  isVideoEnabled,
  isAudioEnabled,
  setVideo,
  setAudio,
  game,
  updateGame,
}: Props) => {
  const socketDomain =
    window.location.host === 'localhost:3000' ? 'localhost:5000' : 'sandboard-server.herokuapp.com';
  const protocol = window.location.host.indexOf('localhost') > -1 ? 'http' : 'https';

  const [status, setStatus] = useState(STATUS.GETTING_ROOM);
  const [user, setUser] = useState('');
  const [currentMessage, setMessage] = useState('');
  const [currentSid, setSid] = useState('');
  const remoteVideo: React.MutableRefObject<any> = useRef(null);
  const localVideo: React.MutableRefObject<any> = useRef(null);
  const socket = useRef(io.connect(`${protocol}://${socketDomain}`));
  const [isMediaActive, setMediaActive] = useState(false);
  const roomId = match.params.room;

  const onHangUp = () => {
    console.log('[Room] onHangUp');
    setStatus(STATUS.CREATE);
    hangup();
    socket.current.emit('leave');
    setUser('guest');
  };

  /**
   * send
   */
  const send = useCallback(() => {
    const authInfo = {
      sid: currentSid,
      message: 'Please invite me !',
      audio: isAudioEnabled,
      video: isVideoEnabled,
    };
    console.log('[Room] send', authInfo);
    socket.current.emit('auth', authInfo);
    setStatus(STATUS.CONNECTING);
  }, [currentSid, isAudioEnabled, isVideoEnabled]);

  const beforeUnload = useCallback(() => {
    if (isMediaActive) {
      console.log('[Room] useBeforeUnload handleHangup');
      onHangUp();
    }
  }, [isMediaActive]);

  useBeforeUnload(beforeUnload);

  useEffect(() => {
    if (isMediaActive) {
      setUserForMedia(user);
    }
  }, [user, isMediaActive]);

  useEffect(() => {
    if (status === STATUS.GETTING_ROOM) {
      const onApprove = ({ message, sid }: { message: any; sid: any }) => {
        console.log('[Room] onApprove', message, sid);
        setMessage(message);
        setSid(sid);
        // Manuel accept
        // setStatus(STATUS.APPROVE);

        // Auto accept
        socket.current.emit('accept', sid);
        setStatus(STATUS.CONNECTING);
      };
      const onJoin = () => {
        console.log('[Room] onJoin');
        setStatus(STATUS.JOIN);
        setUser('guest');

        // Auto request to join
        send();
      };
      const onCreate = () => {
        console.log('[Room] onCreate');
        setStatus(STATUS.CREATE);
        setUser('host');
      };
      const onFull = () => {
        console.log('[Room] onFull');
        setStatus(STATUS.FULL);
      };

      const onEnterLobby = ({ currentUser }: { currentUser: User }) => {
        console.log('[Room] onEnterLobby', { currentUser });
        setStatus(STATUS.IN_LOBBY);
      };

      const onRemoteHangup = () => {
        setStatus(STATUS.CREATE);
        setUser('host');
      };
      socket.current.on('hangup', onRemoteHangup);
      socket.current.on('enter-lobby', onEnterLobby);
      socket.current.on('create', onCreate);
      socket.current.on('full', onFull);
      socket.current.on('join', onJoin);
      socket.current.on('approve', onApprove);
      socket.current.on('update', updateGame);

      // Emit a welcome to enter in the Lobby
      socket.current.emit('welcome-lobby', { roomId });
    }
  }, [roomId, send, status, updateGame]);

  /**
   * onRemoteStream
   * @param stream
   */
  const onRemoteStream = (stream: any) => {
    console.log('[Room] onRemoteStream');
    remoteVideo.current.srcObject = stream;
    setStatus(STATUS.ESTABLISHED);
  };

  /**
   * onLocalStream
   * @param stream
   */
  const onLocalStream = (stream: any) => {
    console.log('[Room] onLocalStream');
    localVideo.current.srcObject = stream;
  };

  const create = async (selectedGame: Game) => {
    console.log('[Room] createLocalStream');
    await createLocalStream({
      socket: socket.current,
      isVideoEnabled,
      isAudioEnabled,
      onLocalStream,
      onRemoteStream,
      user,
    });
    setMediaActive(true);
    socket.current.emit('welcome-game', { userName: 'Bob', game: selectedGame });
  };

  /**
   * handleInvitation
   * @param {*} response (accept/reject)
   */
  const handleInvitation = (response: string) => () => {
    console.log('[Room] handleInvitation', response, currentSid);
    if (response === 'accept') {
      socket.current.emit('accept', currentSid);
    } else {
      socket.current.emit('reject', currentSid);
    }
    setStatus(STATUS.CONNECTING);
  };

  /**
   * onToggleVideo
   */
  const onToggleVideo = () => {
    console.log('[Room] toggleVideo', !isVideoEnabled);
    toggleVideo(!isVideoEnabled);
    setVideo(!isVideoEnabled);
  };

  /**
   * onToggleAudio
   */
  const onToggleAudio = () => {
    console.log('[Room] toggleAudio', !isAudioEnabled);
    toggleAudio(!isAudioEnabled);
    setAudio(!isAudioEnabled);
  };

  /**
   * handleHangup
   */
  const handleHangup = () => {
    console.log('[Room] handleHangup');
    onHangUp();
  };

  /**
   * handleHangup
   */
  const sendInfos = (selectedGame: Game) => {
    console.log('[Room] sendInfos');
    if (!isMediaActive) create(selectedGame);
  };

  /**
   * updateSocketGame
   * @param {*} param0
   */
  const updateSocketGame = ({ game: newGame }: { game: GameUpdate }) => {
    socket.current.emit('play', { game: newGame });
  };

  /**
   * resetGame
   */
  const resetGame = () => {
    socket.current.emit('reset');
  };

  console.log('[Room] status', status, isMediaActive);

  return (
    <div className="Room">
      <div className="Room__game">
        {!!game && <Game game={game} updateGame={updateSocketGame} resetGame={resetGame} />}
      </div>

      <div className={`Room__videos ${status === STATUS.ESTABLISHED ? 'is-established' : ''}`}>
        <div className="Room__videobox">
          <video className="Room__video is-remote" ref={remoteVideo} autoPlay />
        </div>
        <div className="Room__videobox">
          <video className="Room__video is-local" ref={localVideo} autoPlay muted />
          <RoomControls
            status={status}
            isAudioEnabled={isAudioEnabled}
            isVideoEnabled={isVideoEnabled}
            toggleVideo={onToggleVideo}
            toggleAudio={onToggleAudio}
            handleHangup={handleHangup}
          />
        </div>
      </div>
      <Communication
        status={status}
        message={currentMessage}
        send={send}
        sendInfos={sendInfos}
        handleInvitation={handleInvitation}
      />
    </div>
  );
};

const mapStateToProps = ({ rtc: { game, rooms, isVideoEnabled, isAudioEnabled } }: Store) => ({
  game,
  rooms,
  isVideoEnabled,
  isAudioEnabled,
});
const mapDispatchToProps = () => ({
  updateGame: ({ game, users }: { game?: GameUpdate | Game; users?: Array<User> }) =>
    store.dispatch({ type: 'UPDATE_GAME', game, users }),
  setVideo: (enabled: boolean) => store.dispatch({ type: 'SET_VIDEO', isVideoEnabled: enabled }),
  setAudio: (enabled: boolean) => store.dispatch({ type: 'SET_AUDIO', isAudioEnabled: enabled }),
});
export default connect(mapStateToProps, mapDispatchToProps)(Room);
