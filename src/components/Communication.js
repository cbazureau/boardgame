import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import './Communication.css';
import STATUS from '../utils/status';

const Communication = ({ send, handleInvitation, message, status }) =>
	status !== STATUS.ESTABLISHED &&
	status !== STATUS.CREATE &&
	status !== STATUS.HOST_HANGUP &&
	status !== STATUS.GUEST_HANGUP ? (
		<div className="Communication">
			{status === STATUS.JOIN && (
				<div className="Communication__box">
					<p>Send an invitation to join the room.</p>
					<button onClick={send} className="primary-button">
						Send
					</button>
				</div>
			)}
			{status === STATUS.APPROVE && (
				<div className="Communication__box">
					<p>A peer has sent you a message to join the room:</p>
					<div>{message}</div>
					<button onClick={handleInvitation('reject')} data-ref="reject" className="primary-button">
						Reject
					</button>
					<button onClick={handleInvitation('accept')} data-ref="accept" className="primary-button">
						Accept
					</button>
				</div>
			)}
			{status === STATUS.FULL && (
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
	status: PropTypes.string.isRequired,
	send: PropTypes.func.isRequired,
	handleInvitation: PropTypes.func.isRequired
};

export default Communication;
