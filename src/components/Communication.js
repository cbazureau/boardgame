import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import './Communication.css';
import STATUS from '../utils/status';

const Communication = ({ send, handleInvitation, message, bridge }) =>
	bridge !== STATUS.ESTABLISHED && bridge !== STATUS.CREATE && bridge !== STATUS.HOST_HANGUP ? (
		<div className="Communication">
			{(bridge === STATUS.GUEST_HANGUP || bridge === STATUS.JOIN) && (
				<div className="Communication__box">
					<p>
						{bridge === STATUS.GUEST_HANGUP && <span className="you-left">You hung up.&nbsp;</span>}
						Send an invitation to join the room.
					</p>
					<button onClick={send} className="primary-button">
						Send
					</button>
				</div>
			)}
			{bridge === STATUS.APPROVE && (
				<div className="Communication__box">
					<p>A peer has sent you a message to join the room:</p>
					<div>{message}</div>
					<button onClick={handleInvitation} data-ref="reject" className="primary-button">
						Reject
					</button>
					<button onClick={handleInvitation} data-ref="accept" className="primary-button">
						Accept
					</button>
				</div>
			)}
			{bridge === STATUS.FULL && (
				<div className="Communication__box">
					<p>Please, try another room!</p>
					<Link className="primary-button" to="/">
						OK
					</Link>
				</div>
			)}
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
