import React, { useEffect, useRef } from 'react';
import MediaContainer from '../containers/MediaContainer'
import CommunicationContainer from '../containers/CommunicationContainer'
import { connect } from 'react-redux'
import store from '../store'
import io from 'socket.io-client'

const Room = ({ addRoom, match }) => {
  const currentMedia = useRef(null);
  const getUserMedia = useRef(navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
  }).catch(e => alert('getUserMedia() error: ' + e.name)));
  const roomId = match.params.room;
  const socket = useRef(io.connect('https://localhost:5000'));
  useEffect(() => addRoom(roomId), [addRoom, roomId]);

  return (
    <div>
      <MediaContainer media={media => currentMedia.current = media} socket={socket.current} getUserMedia={getUserMedia.current} />
      <CommunicationContainer socket={socket.current} media={currentMedia.current} getUserMedia={getUserMedia.current} />
    </div>
  );
};

const mapStateToProps = ({ rooms }) => ({ rooms });
const mapDispatchToProps = (dispatch, ownProps) => (
    {
      addRoom: (roomId) => store.dispatch({ type: 'ADD_ROOM', room: roomId })
    }
  );
export default connect(mapStateToProps, mapDispatchToProps)(Room);
