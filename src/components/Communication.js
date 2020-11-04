import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import './Communication.css';

const Communication = ({
	send,
	handleInput,
	handleInvitation,
  message,
  bridge,
}) => bridge !== "established" ? (
	<div className="Communication">
		{(bridge === 'guest-hangup' || bridge === 'join') && <div className="Communication__box">
			<p>
				<span className="you-left">You hung up.&nbsp;</span>Send an invitation to join the room.
			</p>
			<form onSubmit={send}>
				<input
          type="text"
          className="Communication__input"
					autoFocus
					onChange={handleInput}
					data-ref="message"
					maxLength="30"
					required
					placeholder="Hi, I'm John Doe."
				/>
				<button className="primary-button">Send</button>
			</form>
		</div>}
		{bridge === 'approve' && <div className="Communication__box">
			<p>A peer has sent you a message to join the room:</p>
			<div>{message}</div>
			<button onClick={handleInvitation} data-ref="reject" className="primary-button">
				Reject
			</button>
			<button onClick={handleInvitation} data-ref="accept" className="primary-button">
				Accept
			</button>
		</div>}
		{bridge === 'full' && <div className="Communication__box">
			<p>Please, try another room!</p>
			<Link className="primary-button" to="/">
				OK
			</Link>
		</div>}
		{(bridge === 'host-hangup' || bridge === 'create' ) && <div className="Communication__box">
			<p>
				<span>Waiting for someone to join this room:&nbsp;</span>
				<a href={window.location.href}>{window.location.href}</a>
				<br />
				{bridge === 'host-hangup' && <span className="remote-left">The remote side hung up.</span>}
			</p>
		</div>}
	</div>
) : null;

Communication.propTypes = {
  message: PropTypes.string.isRequired,
  bridge: PropTypes.string.isRequired,
	send: PropTypes.func.isRequired,
	handleInput: PropTypes.func.isRequired,
	handleInvitation: PropTypes.func.isRequired
};

export default Communication;
