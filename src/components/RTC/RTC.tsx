/* eslint-disable jsx-a11y/media-has-caption */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import store from '../../store';
import useBeforeUnload from '../../utils/useBeforeUnload';
import {
  toggleAudio,
  setUserForMedia,
  toggleVideo,
  hangup,
  createLocalStream,
} from '../../utils/media';
import RoomControls from '../RoomControl';
import { RTC_STATUS } from '../../utils/status';
import Button from '../Button';
import Users from '../Users';
import './RTC.css';

type Props = {
  socket: any;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  setVideo: (val: boolean) => void;
  setAudio: (val: boolean) => void;
  onHangUp: () => void;
  users: Array<User>;
};

/**
 * Room
 * Create or access to a room
 */
const RTC = ({
  isVideoEnabled,
  isAudioEnabled,
  setVideo,
  setAudio,
  socket,
  onHangUp: onGameHangUp,
  users,
}: Props): JSX.Element => {
  const [rtcStatus, setRTCStatus] = useState(RTC_STATUS.OFF);
  const [user, setUser] = useState<string>('');
  const [currentMessage, setMessage] = useState('');
  const [currentSid, setSid] = useState<string>('');
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const localVideo = useRef<HTMLVideoElement>(null);
  const [isMediaActive, setMediaActive] = useState(false);

  const onHangUp = useCallback(
    (beforeUnloadHangUp = false) => {
      console.log('[RTC] onHangUp');
      setRTCStatus(RTC_STATUS.CREATE);
      hangup();
      if (!beforeUnloadHangUp) onGameHangUp();
      setUser('guest');
    },
    [onGameHangUp],
  );

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
    console.log('[RTC] send', authInfo);
    socket.current.emit('auth', authInfo);
    setRTCStatus(RTC_STATUS.CONNECTING);
  }, [currentSid, isAudioEnabled, isVideoEnabled, socket]);

  const beforeUnload = useCallback(() => {
    if (isMediaActive) {
      console.log('[RTC] useBeforeUnload handleHangup');
      onHangUp(true);
    }
  }, [isMediaActive, onHangUp]);

  useBeforeUnload(beforeUnload);

  useEffect(() => {
    if (isMediaActive) {
      setUserForMedia(user);
    }
  }, [user, isMediaActive]);

  useEffect(() => {
    if (rtcStatus === RTC_STATUS.OFF) {
      const onApprove = ({ message, sid }: { message: any; sid: any }) => {
        console.log('[RTC] onApprove', message, sid);
        setMessage(message);
        setSid(sid);
        // Manuel accept
        // setStatus(STATUS.APPROVE);

        // Auto accept
        socket.current.emit('accept', sid);
        setRTCStatus(RTC_STATUS.CONNECTING);
      };
      const onJoin = () => {
        console.log('[RTC] onJoin');
        setUser('guest');
        setRTCStatus(RTC_STATUS.JOIN);

        // Auto request to join
        send();
      };
      const onCreate = () => {
        console.log('[RTC] onCreate');
        setUser('host');
        setRTCStatus(RTC_STATUS.CREATE);
      };
      const onFull = () => {
        console.log('[RTC] onFull');
        setRTCStatus(RTC_STATUS.FULL);
      };

      const onRemoteHangup = () => {
        setUser('host');
        setRTCStatus(RTC_STATUS.CREATE);
      };
      socket.current.on('hangup', onRemoteHangup);
      socket.current.on('create', onCreate);
      socket.current.on('full', onFull);
      socket.current.on('join', onJoin);
      socket.current.on('approve', onApprove);
    }
  }, [rtcStatus, send, socket]);

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
    console.log('[RTC] onLocalStream');
    if (localVideo.current) localVideo.current.srcObject = stream;
  };

  const createChat = async () => {
    console.log('[RTC] createLocalStream');
    await createLocalStream({
      socket: socket.current,
      isVideoEnabled,
      isAudioEnabled,
      onLocalStream,
      onRemoteStream,
      user,
    });
    setMediaActive(true);
    socket.current.emit('welcome-rtc');
  };

  /**
   * handleInvitation
   * @param {*} response (accept/reject)
   */
  const handleInvitation = (response: string) => () => {
    console.log('[RTC] handleInvitation', response, currentSid);
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
    console.log('[RTC] toggleVideo', !isVideoEnabled);
    toggleVideo(!isVideoEnabled);
    setVideo(!isVideoEnabled);
  };

  /**
   * onToggleAudio
   */
  const onToggleAudio = () => {
    console.log('[RTC] toggleAudio', !isAudioEnabled);
    toggleAudio(!isAudioEnabled);
    setAudio(!isAudioEnabled);
  };

  /**
   * handleHangup
   */
  const handleHangup = () => {
    console.log('[RTC] handleHangup');
    onHangUp();
  };

  /**
   * handleHangup
   */
  const sendChat = () => {
    console.log('[RTC] sendChat');
    if (!isMediaActive) createChat();
  };

  console.log('[RTC] status', rtcStatus);

  return (
    <div
      className={classnames('RTC', {
        'is-established': rtcStatus === RTC_STATUS.ESTABLISHED,
        'is-local-ready': rtcStatus !== RTC_STATUS.OFF,
      })}
    >
      <div className="RTC_users">
        <Users users={users} />
      </div>
      {rtcStatus === RTC_STATUS.OFF && (
        <div className="RTC__box">
          <p>Videochat</p>
          <Button onClick={sendChat}>Start</Button>
        </div>
      )}
      {rtcStatus === RTC_STATUS.JOIN && (
        <div className="RTC__box">
          <p>Send an invitation to join the room.</p>
          <Button onClick={send}>Send</Button>
        </div>
      )}
      {rtcStatus === RTC_STATUS.APPROVE && (
        <div className="RTC__box">
          <p>A peer has sent you a message to join the room:</p>
          <div>{currentMessage}</div>
          <button
            onClick={handleInvitation('reject')}
            type="button"
            data-ref="reject"
            className="primary-button"
          >
            Reject
          </button>
          <button
            onClick={handleInvitation('accept')}
            type="button"
            data-ref="accept"
            className="primary-button"
          >
            Accept
          </button>
        </div>
      )}
      {rtcStatus === RTC_STATUS.FULL && <div>FULL</div>}
      <div className="RTC__videobox">
        <video className="RTC__video is-remote" ref={remoteVideo} autoPlay />
      </div>
      <div className="RTC__videobox">
        <video className="RTC__video is-local" ref={localVideo} autoPlay muted />
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
  );
};

const mapStateToProps = ({ rtc: { isVideoEnabled, isAudioEnabled, users } }: Store) => ({
  isVideoEnabled,
  isAudioEnabled,
  users,
});
const mapDispatchToProps = () => ({
  setVideo: (enabled: boolean) => store.dispatch({ type: 'SET_VIDEO', isVideoEnabled: enabled }),
  setAudio: (enabled: boolean) => store.dispatch({ type: 'SET_AUDIO', isAudioEnabled: enabled }),
});
export default connect(mapStateToProps, mapDispatchToProps)(RTC);
