import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const DEFAULT_ROOM = String(new Date() - new Date().setHours(0, 0, 0, 0));

const Home = ({ rooms }) => {
	const [ roomId, setRoomId ] = useState(DEFAULT_ROOM);
	const handleChange = (e) => setRoomId(e.target.value);
	return (
		<div className="home">
			<div>
				<h1 itemProp="headline">Webrtc Video Room</h1>
				<p>Please enter a room name.</p>
				<input
					type="text"
					name="room"
					value={roomId}
					onChange={handleChange}
					pattern="^\w+$"
					maxLength="10"
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
				{rooms.map((room) => (
					<Link key={room} className="recent-room" to={'/r/' + room}>
						{room}
					</Link>
				))}
			</div>
		</div>
	);
};

Home.propTypes = {
	handleChange: PropTypes.func.isRequired,
	defaultRoomId: PropTypes.string.isRequired,
	roomId: PropTypes.string.isRequired,
	rooms: PropTypes.array.isRequired
};

const mapStateToProps = (store) => ({ rooms: store.rooms });

export default connect(mapStateToProps)(Home);
