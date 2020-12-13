let localStream: MediaStream;
let currentSocket: any = null;
let currentUser: User;
let currentVideoRefs: {
  [key: string]: HTMLVideoElement;
};
const peerConnectionConfig = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

const CONSTRAINTS = {
  audio: {
    sampleSize: 16,
    channelCount: 2,
    echoCancellation: true,
    noiseSuppression: true,
  },
  video: {
    width: 320,
    height: 240,
    frameRate: 10,
    facingMode: 'user',
  },
};

const peerConnections: any = {};

/**
 * errorHandler
 * @param error
 */
const errorHandler = (error: any) => {
  console.log(error);
};

/**
 * createdDescription
 * @param description
 * @param peerUuid
 */
const createdDescription = (description: RTCSessionDescription, peerUuid: string) => {
  const localUuid = currentUser.id;
  peerConnections[peerUuid].pc
    .setLocalDescription(description)
    .then(() => {
      currentSocket.send({
        sdp: peerConnections[peerUuid].pc.localDescription,
        uuid: localUuid,
        dest: peerUuid,
      });
    })
    .catch(errorHandler);
};

/**
 * checkPeerDisconnect
 * @param event
 * @param peerUuid
 */
const checkPeerDisconnect = (event: RTCPeerConnection, peerUuid: string) => {
  const state = peerConnections[peerUuid].pc.iceConnectionState;
  if (state === 'failed' || state === 'closed' || state === 'disconnected') {
    delete peerConnections[peerUuid];
    currentVideoRefs[peerUuid].srcObject = null;
  }
};

/**
 * gotIceCandidate
 * @param event
 * @param peerUuid
 */
const gotIceCandidate = (event: RTCPeerConnectionIceEvent, peerUuid: string) => {
  const localUuid = currentUser.id;
  if (event.candidate != null) {
    currentSocket.send({ ice: event.candidate, uuid: localUuid, dest: peerUuid });
  }
};

const gotRemoteStream = (event: RTCTrackEvent, peerUuid: string) => {
  const stream = event.streams[0];
  currentVideoRefs[peerUuid].srcObject = stream;
};

/**
 * setUpPeer
 * @param peerUuid
 * @param initCall
 */
const setUpPeer = (peerUuid: string, initCall = false) => {
  peerConnections[peerUuid] = {
    pc: new RTCPeerConnection(peerConnectionConfig),
  };
  peerConnections[peerUuid].pc.onicecandidate = (event: RTCPeerConnectionIceEvent) =>
    gotIceCandidate(event, peerUuid);
  peerConnections[peerUuid].pc.ontrack = (event: RTCTrackEvent) => gotRemoteStream(event, peerUuid);
  peerConnections[peerUuid].pc.oniceconnectionstatechange = (event: RTCPeerConnection) =>
    checkPeerDisconnect(event, peerUuid);
  peerConnections[peerUuid].pc.addStream(localStream);

  if (initCall) {
    peerConnections[peerUuid].pc
      .createOffer()
      .then((description: RTCSessionDescription) => createdDescription(description, peerUuid))
      .catch(errorHandler);
  }
};

/**
 * onMessage
 * @param message
 */
const onMessage = (signal: {
  uuid: string;
  dest: string;
  sdp: RTCSessionDescriptionInit;
  ice: RTCIceCandidateInit;
}) => {
  const peerUuid = signal.uuid;
  const localUuid = currentUser.id;

  // Ignore messages that are not for us or from ourselves
  if (peerUuid === localUuid || (signal.dest !== localUuid && signal.dest !== 'all')) return;

  if (!signal.sdp && !signal.ice && signal.dest === 'all') {
    // set up peer connection object for a newcomer peer
    setUpPeer(peerUuid);
    currentSocket.send({ uuid: localUuid, dest: peerUuid });
  } else if (!signal.sdp && !signal.ice && signal.dest === localUuid) {
    // initiate call if we are the newcomer peer
    setUpPeer(peerUuid, true);
  } else if (signal.sdp) {
    const remoteDescription = new RTCSessionDescription(signal.sdp);
    peerConnections[peerUuid].pc
      .setRemoteDescription(remoteDescription)
      .then(() => {
        // Only create answers in response to offers
        if (signal.sdp.type === 'offer') {
          peerConnections[peerUuid].pc
            .createAnswer()
            .then((description: RTCSessionDescription) => createdDescription(description, peerUuid))
            .catch(errorHandler);
        }
      })
      .catch(errorHandler);
  } else if (signal.ice) {
    peerConnections[peerUuid].pc
      .addIceCandidate(new RTCIceCandidate(signal.ice))
      .catch(errorHandler);
  }
};

/**
 * toggleAudio
 * @param {*} enabled
 */
export const toggleAudio = (enabled: boolean): void => {
  localStream.getAudioTracks()[0].enabled = enabled;
};

/**
 * toggleVideo
 * @param {*} enabled
 */
export const toggleVideo = (enabled: boolean): void => {
  localStream.getVideoTracks()[0].enabled = enabled;
};

/**
 * start
 * @param param0
 */
export const start = ({
  socket,
  videoRefs,
  currentUser: newCurrentUser,
}: {
  socket: any;
  videoRefs: {
    [key: string]: HTMLVideoElement;
  };
  currentUser: User;
}): void => {
  currentVideoRefs = videoRefs;
  currentSocket = socket;
  currentUser = newCurrentUser;

  // set up local video stream
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia(CONSTRAINTS)
      .then(stream => {
        localStream = stream;
        currentVideoRefs[currentUser.id].srcObject = stream;
      })
      .catch(errorHandler)

      // set up websocket and message all existing clients
      .then(() => {
        currentSocket.on('message', onMessage);
        currentSocket.send({
          uuid: currentUser.id,
          dest: 'all',
        });
      })
      .catch(errorHandler);
  }
};
