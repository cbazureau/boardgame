let pc: RTCPeerConnection;
let dc: RTCDataChannel;
const remoteStream: Array<MediaStream> = [];
let localStream: MediaStream;
let currentSocket: any = null;
let getUserMedia: any = null;
let currentUser: string;

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

window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection;

export const setUserForMedia = (user: string): void => {
  currentUser = user;
};

const setupDataHandlers = () => {
  dc.onmessage = (e: MessageEvent) => console.log(`[dc.onmessage] ${JSON.parse(e.data)}`);
  dc.onclose = () => remoteStream[0].getVideoTracks()[0].stop();
};

/**
 * init
 */
export const init = async ({ onRemoteStream }: { onRemoteStream: any }): Promise<void> => {
  console.log('[media.init]');
  // set up the peer connection
  // this is one of Google's public STUN servers
  // make sure your offer/answer role does not change. If user A does a SLD
  // with type=offer initially, it must do that during  the whole session
  pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  });
  // when our browser gets a candidate, send it to the peer
  pc.onicecandidate = (e: RTCPeerConnectionIceEvent): void => {
    // console.log(e, "onicecandidate");
    if (e.candidate) {
      currentSocket.send({
        type: 'candidate',
        mlineindex: e.candidate.sdpMLineIndex,
        candidate: e.candidate.candidate,
      });
    }
  };
  // when the other side added a media stream, show it on screen
  pc.ontrack = (e: RTCTrackEvent): void => {
    const stream: MediaStream = e.streams[0];
    remoteStream[0] = stream;
    onRemoteStream(remoteStream[0]);
  };
  // data channel
  pc.ondatachannel = (e: RTCDataChannelEvent): void => {
    dc = e.channel;
    setupDataHandlers();
    dc.send(
      JSON.stringify({
        peerMediaStream: {
          video: localStream.getVideoTracks()[0].enabled,
        },
      }),
    );
  };
  // attach local media to the peer connection
  localStream.getTracks().forEach((track: MediaStreamTrack) => pc.addTrack(track, localStream));
  // call if we were the last to connect (to increase
  // chances that everything is set up properly at both ends)
  if (currentUser === 'host') {
    await getUserMedia;
    dc = pc.createDataChannel('chat');
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    currentSocket.send(pc.localDescription);
  }
};

/**
 * onMessage
 */
const onMessage = async (message: any): Promise<void> => {
  // console.log('[media] onMessage', message);
  if (message.type === 'offer') {
    // set remote description and answer
    pc.setRemoteDescription(new RTCSessionDescription(message));
    const offer = await pc.createAnswer();
    await pc.setLocalDescription(offer);
    currentSocket.send(pc.localDescription);
  } else if (message.type === 'answer') {
    // set remote description
    pc.setRemoteDescription(new RTCSessionDescription(message));
  } else if (message.type === 'candidate') {
    // add ice candidate
    pc.addIceCandidate(
      new RTCIceCandidate({
        sdpMLineIndex: message.mlineindex,
        candidate: message.candidate,
      }),
    );
  }
};

/**
 * createLocalStream
 */
export const createLocalStream = async ({
  socket,
  isVideoEnabled,
  isAudioEnabled,
  onLocalStream,
  onRemoteStream,
  user,
}: {
  socket: any;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  onLocalStream: any;
  onRemoteStream: any;
  user: string;
}): Promise<void> => {
  currentSocket = socket;
  currentUser = user;

  getUserMedia = navigator.mediaDevices.getUserMedia(CONSTRAINTS);
  currentSocket.on('message', onMessage);
  currentSocket.on('bridge', () => init({ onRemoteStream }));
  localStream = await getUserMedia;
  localStream.getVideoTracks()[0].enabled = isVideoEnabled;
  localStream.getAudioTracks()[0].enabled = isAudioEnabled;
  onLocalStream(localStream);
};

/**
 * hangup
 */
export const hangup = (): void => {
  if (pc) pc.close();
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
