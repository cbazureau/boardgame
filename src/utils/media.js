let pc = null;
let dc = null;
let remoteStream = null;
let localStream = null;
let currentSocket = null;
let getUserMedia = null;
let currentUser = null;

const CONSTRAINTS = {
	// audio: true,
	// video: true
	audio: {
		sampleSize: 16,
		channelCount: 2,
		echoCancellation: true,
		noiseSuppression: true
	},
	video: {
		width: 320,
		height: 240,
		frameRate: 10,
		facingMode: 'user'
	}
};

window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection;

export const setUserForMedia = (user) => (currentUser = user);
const setDescription = (offer) => pc.setLocalDescription(offer);
const sendDescription = () => currentSocket.send(pc.localDescription);
const setupDataHandlers = () => {
	dc.onmessage = (e) => console.log('[media.setupDataHandlers] data channel : ' + JSON.parse(e.data));
	dc.onclose = () => remoteStream.getVideoTracks()[0].stop();
};

/**
 * init
 */
export const init = ({ onRemoteStream, onLocalStream }) => {
	console.log('[media.init]');
	// wait for local media to be ready
	const attachMediaIfReady = () => {
		console.log('[media.init] attachMediaIfReady');
		dc = pc.createDataChannel('chat');
		setupDataHandlers();
		pc.createOffer().then(setDescription).then(sendDescription).catch(console.log);
	};
	// set up the peer connection
	// this is one of Google's public STUN servers
	// make sure your offer/answer role does not change. If user A does a SLD
	// with type=offer initially, it must do that during  the whole session
	pc = new RTCPeerConnection({
		iceServers: [ { url: 'stun:stun.l.google.com:19302' } ]
	});
	// when our browser gets a candidate, send it to the peer
	pc.onicecandidate = (e) => {
		// console.log(e, "onicecandidate");
		if (e.candidate) {
			currentSocket.send({
				type: 'candidate',
				mlineindex: e.candidate.sdpMLineIndex,
				candidate: e.candidate.candidate
			});
		}
	};
	// when the other side added a media stream, show it on screen
	pc.onaddstream = (e) => {
		// console.log("[media] onaddstream", e);
		remoteStream = e.stream;
		onRemoteStream(remoteStream);
	};
	pc.ondatachannel = (e) => {
		// data channel
		// console.log("[media] ondatachannel", e);
		dc = e.channel;
		setupDataHandlers();
		dc.send(
			JSON.stringify({
				peerMediaStream: {
					video: localStream.getVideoTracks()[0].enabled
				}
			})
		);
	};
	// attach local media to the peer connection
	localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
	// call if we were the last to connect (to increase
	// chances that everything is set up properly at both ends)
	if (currentUser === 'host') getUserMedia.then(attachMediaIfReady);
};

/**
 * onMessage
 */
const onMessage = (message) => {
	// console.log("[media] onMessage", message);
	if (message.type === 'offer') {
		// set remote description and answer
		pc.setRemoteDescription(new RTCSessionDescription(message));
		pc.createAnswer().then(setDescription).then(sendDescription).catch(console.log); // An error occurred, so handle the failure to connect
	} else if (message.type === 'answer') {
		// set remote description
		pc.setRemoteDescription(new RTCSessionDescription(message));
	} else if (message.type === 'candidate') {
		// add ice candidate
		pc.addIceCandidate(
			new RTCIceCandidate({
				sdpMLineIndex: message.mlineindex,
				candidate: message.candidate
			})
		);
	}
};

/**
 * createCommunication
 */
export const createCommunication = async ({
	socket,
	isVideoEnabled,
	isAudioEnabled,
	onLocalStream,
	onRemoteStream,
	user
}) => {
	currentSocket = socket;
	currentUser = user;

	getUserMedia = navigator.mediaDevices.getUserMedia(CONSTRAINTS);
	currentSocket.on('message', onMessage);
	currentSocket.on('bridge', (role) => init({ onRemoteStream, onLocalStream }));
	localStream = await getUserMedia;
	localStream.getVideoTracks()[0].enabled = isVideoEnabled;
	localStream.getAudioTracks()[0].enabled = isAudioEnabled;
	onLocalStream(localStream);
};

/**
 * hangup
 */
export const hangup = ({ onHangUp }) => {
	if (pc) pc.close();
	currentSocket.emit('leave');
	onHangUp();
};

/**
 * toggleAudio
 * @param {*} enabled
 */
export const toggleAudio = (enabled) => {
	localStream.getAudioTracks()[0].enabled = enabled;
};

/**
 * toggleVideo
 * @param {*} enabled
 */
export const toggleVideo = (enabled) => {
	localStream.getVideoTracks()[0].enabled = enabled;
};
