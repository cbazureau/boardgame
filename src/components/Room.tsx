/* eslint-disable jsx-a11y/media-has-caption */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
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
import { USER_STATUS, RTC_STATUS } from '../utils/status';

// For debugging purpose
const ACTIVATE_RTC = false;

type Props = {
  proposedGame: Game | null;
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
  proposedGame,
}: Props): JSX.Element => {
  const socketDomain =
    window.location.host === 'localhost:3000' ? 'localhost:5000' : 'sandboard-server.herokuapp.com';
  const protocol = window.location.host.indexOf('localhost') > -1 ? 'http' : 'https';

  const [status, setStatus] = useState(USER_STATUS.GETTING_ROOM);
  const [rtcStatus, setRTCStatus] = useState(RTC_STATUS.OFF);
  const [user, setUser] = useState('');
  const [currentMessage, setMessage] = useState('');
  const [currentSid, setSid] = useState('');
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const localVideo = useRef<HTMLVideoElement>(null);
  const socket = useRef(io.connect(`${protocol}://${socketDomain}`));
  const [isMediaActive, setMediaActive] = useState(false);
  const roomId = match.params.room;

  const onHangUp = () => {
    console.log('[Room] onHangUp');
    setRTCStatus(RTC_STATUS.CREATE);
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
    setRTCStatus(RTC_STATUS.CONNECTING);
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
    if (status === USER_STATUS.GETTING_ROOM) {
      const onApprove = ({ message, sid }: { message: any; sid: any }) => {
        console.log('[Room] onApprove', message, sid);
        setMessage(message);
        setSid(sid);
        // Manuel accept
        // setStatus(STATUS.APPROVE);

        // Auto accept
        socket.current.emit('accept', sid);
        setRTCStatus(RTC_STATUS.CONNECTING);
      };
      const onJoin = () => {
        console.log('[Room] onJoin');
        setStatus(USER_STATUS.READY);
        setUser('guest');
        if (!ACTIVATE_RTC) return;
        setRTCStatus(RTC_STATUS.JOIN);

        // Auto request to join
        send();
      };
      const onCreate = () => {
        console.log('[Room] onCreate');
        setStatus(USER_STATUS.READY);
        setUser('host');
        if (!ACTIVATE_RTC) return;
        setRTCStatus(RTC_STATUS.CREATE);
      };
      const onFull = () => {
        console.log('[Room] onFull');
        setRTCStatus(RTC_STATUS.FULL);
      };

      const onEnterLobby = ({ currentUser }: { currentUser: User }) => {
        console.log('[Room] onEnterLobby', { currentUser });
        setStatus(USER_STATUS.IN_LOBBY);
      };

      const onRemoteHangup = () => {
        setUser('host');
        if (!ACTIVATE_RTC) return;
        setRTCStatus(RTC_STATUS.CREATE);
      };
      socket.current.on('hangup', onRemoteHangup);
      socket.current.on('enter-lobby', onEnterLobby);
      socket.current.on('create', onCreate);
      socket.current.on('full', onFull);
      socket.current.on('join', onJoin);
      socket.current.on('approve', onApprove);
      socket.current.on('update', updateGame);

      // Emit a welcome to enter in the Lobby
      socket.current.emit('welcome-lobby', { roomId, proposedGame });
    }
  }, [roomId, send, status, updateGame, proposedGame]);

  /**
   * onRemoteStream
   * @param stream
   */
  const onRemoteStream = (stream: any) => {
    console.log('[Room] onRemoteStream');
    if (remoteVideo.current) remoteVideo.current.srcObject = stream;
    setRTCStatus(RTC_STATUS.ESTABLISHED);
  };

  /**
   * onLocalStream
   * @param stream
   */
  const onLocalStream = (stream: any) => {
    console.log('[Room] onLocalStream');
    if (localVideo.current) localVideo.current.srcObject = stream;
  };

  const create = async () => {
    console.log('[Room] createLocalStream');
    if (ACTIVATE_RTC) {
      await createLocalStream({
        socket: socket.current,
        isVideoEnabled,
        isAudioEnabled,
        onLocalStream,
        onRemoteStream,
        user,
      });
    }
    setMediaActive(true);
    socket.current.emit('welcome-game', { username: 'Bob' });
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
    setRTCStatus(RTC_STATUS.CONNECTING);
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
  const sendInfos = () => {
    console.log('[Room] sendInfos');
    if (!isMediaActive && (proposedGame || game)) create();
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

  console.log('[Room] status', status, rtcStatus);

  if (!proposedGame && !game) {
    return (
      <Link className="Room__button" to="/">
        Go
      </Link>
    );
  }

  return (
    <div className="Room">
      <div className="Room__game">
        {!!game && <Game game={game} updateGame={updateSocketGame} resetGame={resetGame} />}
      </div>

      {ACTIVATE_RTC && (
        <div
          className={`Room__videos ${rtcStatus === RTC_STATUS.ESTABLISHED ? 'is-established' : ''}`}
        >
          <div className="Room__videobox">
            <video className="Room__video is-remote" ref={remoteVideo} autoPlay />
          </div>
          <div className="Room__videobox">
            <video className="Room__video is-local" ref={localVideo} autoPlay muted />
            <RoomControls
              rtcStatus={rtcStatus}
              isAudioEnabled={isAudioEnabled}
              isVideoEnabled={isVideoEnabled}
              toggleVideo={onToggleVideo}
              toggleAudio={onToggleAudio}
              handleHangup={handleHangup}
            />
          </div>
        </div>
      )}
      <Communication
        rtcStatus={rtcStatus}
        status={status}
        message={currentMessage}
        send={send}
        sendInfos={sendInfos}
        handleInvitation={handleInvitation}
      />
    </div>
  );
};

const mapStateToProps = ({
  rtc: { game, isVideoEnabled, isAudioEnabled, proposedGame },
}: Store) => ({
  game,
  isVideoEnabled,
  isAudioEnabled,
  proposedGame,
});
const mapDispatchToProps = () => ({
  updateGame: ({ game, users }: { game?: GameUpdate | Game; users?: Array<User> }) =>
    store.dispatch({ type: 'UPDATE_GAME', game, users }),
  setVideo: (enabled: boolean) => store.dispatch({ type: 'SET_VIDEO', isVideoEnabled: enabled }),
  setAudio: (enabled: boolean) => store.dispatch({ type: 'SET_AUDIO', isAudioEnabled: enabled }),
});
export default connect(mapStateToProps, mapDispatchToProps)(Room);
