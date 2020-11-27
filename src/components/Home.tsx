import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './Home.css';

type Props = {
  rooms: Array<string>;
};

const DEFAULT_ROOM: string = String(new Date().getTime() - new Date().setHours(0, 0, 0, 0));

const Home = ({ rooms }: Props): JSX.Element => {
  const [roomId, setRoomId] = useState(DEFAULT_ROOM);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setRoomId(e.target.value);
  return (
    <div className="Home">
      <div>
        <h1 itemProp="headline">Webrtc Video Room</h1>
        <p>Please enter a room name.</p>
        <input
          type="text"
          name="room"
          value={roomId}
          onChange={handleChange}
          pattern="^\w+$"
          maxLength={10}
          required
          autoFocus
          title="Room name should only contain letters or numbers."
        />
        <Link className="primary-button" to={'/r/' + roomId}>
          Join
        </Link>
        <Link className="primary-button" to={'/r/' + DEFAULT_ROOM}>
          Random
        </Link>
        {rooms.length !== 0 && <div>Recently used rooms:</div>}
        {rooms.map(room => (
          <Link key={room} className="Home__recent" to={'/r/' + room}>
            {room}
          </Link>
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = ({ rtc }: Store) => ({ rooms: rtc.rooms });

export default connect(mapStateToProps)(Home);
