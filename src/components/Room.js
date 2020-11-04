import React, { Fragment, useEffect, useRef, useState } from "react";
import Communication from "./Communication";
import { connect } from "react-redux";
import store from "../store";
import io from "socket.io-client";
import media from "../utils/media";
import useBeforeUnload from '../utils/useBeforeUnload';
import './Room.css';
import RoomControls from "./RoomControl";
import Game from "./Game";

/**
 * Room
 * Create or access to a room
 */
const Room = ({
  addRoom,
  match,
  isVideoEnabled,
  isAudioEnabled,
  setVideo,
  setAudio,
}) => {
  // For debugging
  const gameOnly = false;
  const socketDomain = window.location.host === 'localhost:3000' ? 'localhost:5000' : window.location.host;
  const protocol = window.location.host.indexOf('localhost') > -1 ? 'http' : 'https';

  const [bridge, setBridge] = useState("");
  const [user, setUser] = useState("");
  const [currentMessage, setMessage] = useState("");
  const [currentSid, setSid] = useState("");
  const remoteVideo = useRef(null);
  const localVideo = useRef(null);
  const socket = useRef(io.connect(`${protocol}://${socketDomain}`));
  const getUserMedia = useRef(
    !gameOnly && navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .catch((e) => alert("getUserMedia() error: " + e.name))
  );
  const currentMedia = useRef();
  const roomId = match.params.room;

  useBeforeUnload(() => {
    if(currentMedia.current) {
      console.log("[Room] useBeforeUnload handleHangup");
      currentMedia.current.hangup();
    }
  })

  useEffect(() => {
    if (currentMedia.current) {
      currentMedia.current.setUser(user);
    }
  }, [user]);

  useEffect(() => {
    const onRemoteStream = (stream) => {
      console.log("[Room] onRemoteStream");
      remoteVideo.current.srcObject = stream;
      setBridge("established");
    };
    const onLocalStream = (stream) => {
      console.log("[Room] onLocalStream");
      localVideo.current.srcObject = stream;
    };
    const onApprove = ({ message, sid }) => {
      console.log("[Room] onApprove", message, sid);
      setBridge("approve");
      setMessage(message);
      setSid(sid);
    };
    const onJoin = () => {
      console.log("[Room] onJoin");
      setBridge("join");
      setUser("guest");
    };
    const onCreate = () => {
      console.log("[Room] onCreate");
      setBridge("create");
      setUser("host");
    };
    const onFull = () => {
      console.log("[Room] onFull");
      setBridge("full");
    };
    const onHangUp = () => {
      console.log("[Room] onHangUp");
      setBridge("guest-hangup");
      setUser("guest");
    };

    const onRemoteHangup = () => {
      setBridge("host-hangup");
      setUser("host");
    };

    addRoom(roomId);

    if (!currentMedia.current && !gameOnly) {
      console.log("[Room] new media");
      currentMedia.current = media({
        socket: socket.current,
        onRemoteStream,
        getUserMedia: getUserMedia.current,
        onApprove,
        onJoin,
        onCreate,
        isVideoEnabled,
        isAudioEnabled,
        onFull,
        onHangUp,
        onLocalStream,
        onRemoteHangup,
      });
      console.log("[Room] createCommunication");
      currentMedia.current.createCommunication();
    }
  }, [addRoom, isAudioEnabled, isVideoEnabled, roomId, user, gameOnly]);

  const handleInput = (e) => {
    const msg = e.target.value;
    console.log("[Room] handleInput", msg);
    setMessage(msg);
  };
  const send = (e) => {
    e.preventDefault();
    const authInfo = {
      sid: currentSid,
      message: currentMessage,
      audio: isAudioEnabled,
      video: isVideoEnabled,
    };
    console.log("[Room] send", authInfo);
    socket.current.emit("auth", authInfo);
    setBridge("connecting");
  };
  const handleInvitation = (e) => {
    e.preventDefault();
    const status = e.target.dataset.ref;
    console.log("[Room] handleInvitation", status, currentSid);
    socket.current.emit([status], currentSid);
    setBridge("connecting");
  };
  const toggleVideo = () => {
    console.log("[Room] toggleVideo", !isVideoEnabled);
    currentMedia.current.toggleVideo(!isVideoEnabled);
    setVideo(!isVideoEnabled);
  };
  const toggleAudio = () => {
    console.log("[Room] toggleAudio", !isAudioEnabled);
    currentMedia.current.toggleAudio(!isAudioEnabled);
    setAudio(!isAudioEnabled);
  };
  const handleHangup = () => {
    console.log("[Room] handleHangup");
    currentMedia.current.hangup();
  };

  return (
    <div className="Room">
      <div className="Room__game">
        <Game />
      </div>
      {!gameOnly &&
      <Fragment>
      <div className={`Room__videos ${bridge}`}>
        <div className="Room__videobox">
          <video className="Room__video is-remote" ref={remoteVideo} autoPlay />
        </div>
        <div className="Room__videobox">
          <video className="Room__video is-local" ref={localVideo} autoPlay muted />
          <RoomControls
            bridge={bridge}
            audio={isAudioEnabled}
            video={isVideoEnabled}
            toggleVideo={toggleVideo}
            toggleAudio={toggleAudio}
            handleHangup={handleHangup}
          />
        </div>
      </div>
      <Communication
        bridge={bridge}
        message={currentMessage}
        send={send}
        handleInput={handleInput}
        handleInvitation={handleInvitation}
      />
      </Fragment>}
    </div>
  );
};

const mapStateToProps = ({
  rtc: { rooms, isVideoEnabled, isAudioEnabled },
}) => ({ rooms, isVideoEnabled, isAudioEnabled });
const mapDispatchToProps = (dispatch, ownProps) => ({
  addRoom: roomId => store.dispatch({ type: "ADD_ROOM", room: roomId }),
  setVideo: enabled => store.dispatch({ type: "SET_VIDEO", isVideoEnabled: enabled }),
  setAudio: enabled => store.dispatch({ type: "SET_AUDIO", isAudioEnabled: enabled }),
});
export default connect(mapStateToProps, mapDispatchToProps)(Room);
