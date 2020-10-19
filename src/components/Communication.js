import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';

const Communication = ({
	send,
	handleInput,
	handleInvitation,
  message,
  bridge,
}) => (
	<div className="auth">
		<div className="request-access">
			<p>
				<span className="you-left">You hung up.&nbsp;</span>Send an invitation to join the room.
			</p>
			<form onSubmit={send}>
				<input
					type="text"
					autoFocus
					onChange={handleInput}
					data-ref="message"
					maxLength="30"
					required
					placeholder="Hi, I'm John Doe."
				/>
				<button className="primary-button">Send</button>
			</form>
		</div>
		<div className="grant-access">
			<p>A peer has sent you a message to join the room:</p>
			<div>{message}</div>
			<button onClick={handleInvitation} data-ref="reject" className="primary-button">
				Reject
			</button>
			<button onClick={handleInvitation} data-ref="accept" className="primary-button">
				Accept
			</button>
		</div>
		<div className="room-occupied">
			<p>Please, try another room!</p>
			<Link className="primary-button" to="/">
				OK
			</Link>
		</div>
		<div className="waiting">
			<p>
				<span>Waiting for someone to join this room:&nbsp;</span>
				<a href={window.location.href}>{window.location.href}</a>
				<br />
				<span className="remote-left">The remote side hung up.</span>
			</p>
		</div>
	</div>
);

Communication.propTypes = {
  message: PropTypes.string.isRequired,
  bridge: PropTypes.string.isRequired,
	send: PropTypes.func.isRequired,
	handleInput: PropTypes.func.isRequired,
	handleInvitation: PropTypes.func.isRequired
};

export default Communication;
