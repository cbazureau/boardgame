let pc = null;
let dc = null;
let remoteStream = null;
let localStream = null;

const media = ({
  socket,
  onRemoteStream,
  getUserMedia,
  isVideoEnabled,
  isAudioEnabled,
  onHangUp,
  onLocalStream,
}) => {
  let user = null;
  window.RTCPeerConnection =
    window.RTCPeerConnection || window.webkitRTCPeerConnection;
  const setDescription = (offer) => pc.setLocalDescription(offer);
  const sendDescription = () => socket.send(pc.localDescription);
  const setupDataHandlers = () => {
    dc.onmessage = (e) =>
      console.log(
        "[Media] received message over data channel:" + JSON.parse(e.data)
      );
    dc.onclose = () => {
      remoteStream.getVideoTracks()[0].stop();
      console.log("[Media] The Data Channel is Closed");
    };
  };
  const setUser = (u) => (user = u);
  const init = () => {
    console.log("[Media] init");
    // wait for local media to be ready
    const attachMediaIfReady = () => {
      console.log("[Media] attachMediaIfReady");
      dc = pc.createDataChannel("chat");
      setupDataHandlers();
      pc.createOffer()
        .then(setDescription)
        .then(sendDescription)
        .catch(console.log);
    };
    // set up the peer connection
    // this is one of Google's public STUN servers
    // make sure your offer/answer role does not change. If user A does a SLD
    // with type=offer initially, it must do that during  the whole session
    pc = new RTCPeerConnection({
      iceServers: [{ url: "stun:stun.l.google.com:19302" }],
    });
    // when our browser gets a candidate, send it to the peer
    pc.onicecandidate = (e) => {
      console.log(e, "onicecandidate");
      if (e.candidate) {
        socket.send({
          type: "candidate",
          mlineindex: e.candidate.sdpMLineIndex,
          candidate: e.candidate.candidate,
        });
      }
    };
    // when the other side added a media stream, show it on screen
    pc.onaddstream = (e) => {
      console.log("[media] onaddstream", e);
      remoteStream = e.stream;
      onRemoteStream(remoteStream);
    };
    pc.ondatachannel = (e) => {
      // data channel
      console.log("[media] ondatachannel", e);
      dc = e.channel;
      setupDataHandlers();
      dc.send(
        JSON.stringify({
          peerMediaStream: {
            video: localStream.getVideoTracks()[0].enabled,
          },
        })
      );
    };
    // attach local media to the peer connection
    localStream
      .getTracks()
      .forEach(
        (track) => !console.log(track) && pc.addTrack(track, localStream)
      );
    // call if we were the last to connect (to increase
    // chances that everything is set up properly at both ends)
    if (user === "host") getUserMedia.then(attachMediaIfReady);
  };
  const onMessage = (message) => {
    console.log("[media] onMessage", message);
    if (message.type === "offer") {
      // set remote description and answer
      pc.setRemoteDescription(new RTCSessionDescription(message));
      pc.createAnswer()
        .then(setDescription)
        .then(sendDescription)
        .catch(console.log); // An error occurred, so handle the failure to connect
    } else if (message.type === "answer") {
      // set remote description
      pc.setRemoteDescription(new RTCSessionDescription(message));
    } else if (message.type === "candidate") {
      // add ice candidate
      pc.addIceCandidate(
        new RTCIceCandidate({
          sdpMLineIndex: message.mlineindex,
          candidate: message.candidate,
        })
      );
    }
  };
  const createCommunication = () => {
    socket.on("message", onMessage);
    socket.on("bridge", (role) => init());
    getUserMedia.then((stream) => {
      localStream = stream;
      localStream.getVideoTracks()[0].enabled = isVideoEnabled;
      localStream.getAudioTracks()[0].enabled = isAudioEnabled;
      onLocalStream(stream);
    });
  };

  const toggleAudio = (enabled) => {
    localStream.getAudioTracks()[0].enabled = enabled;
  };
  const toggleVideo = (enabled) => {
    localStream.getVideoTracks()[0].enabled = enabled;
  };

  const hangup = () => {
    pc.close();
    socket.emit("leave");
    onHangUp();
  };
  return {
    setDescription,
    sendDescription,
    setupDataHandlers,
    init,
    createCommunication,
    toggleVideo,
    toggleAudio,
    hangup,
    setUser,
  };
};

export default media;
