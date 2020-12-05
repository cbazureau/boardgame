import React from 'react';
import { Link } from 'react-router-dom';
import './Communication.css';
import { RTC_STATUS, USER_STATUS } from '../utils/status';

type Props = {
  sendInfos: () => void;
  send: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleInvitation: (
    returnStatus: string,
  ) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  message: string;
  rtcStatus: string;
  status: string;
};

const Communication = ({
  send,
  sendInfos,
  handleInvitation,
  message,
  rtcStatus,
  status,
}: Props): JSX.Element | null =>
  [RTC_STATUS.JOIN, RTC_STATUS.APPROVE, RTC_STATUS.FULL].includes(rtcStatus) ||
  [USER_STATUS.IN_LOBBY].includes(status) ? (
    <div className="Communication">
      {rtcStatus === RTC_STATUS.JOIN && (
        <div className="Communication__box">
          <p>Send an invitation to join the room.</p>
          <button onClick={send} type="button" className="primary-button">
            Send
          </button>
        </div>
      )}
      {status === USER_STATUS.IN_LOBBY && (
        <div className="Communication__box">
          <p>Welcome to this room</p>
          <button onClick={sendInfos} type="button" className="primary-button">
            Send Infos
          </button>
        </div>
      )}
      {rtcStatus === RTC_STATUS.APPROVE && (
        <div className="Communication__box">
          <p>A peer has sent you a message to join the room:</p>
          <div>{message}</div>
          <button
            onClick={handleInvitation('reject')}
            type="button"
            data-ref="reject"
            className="primary-button"
          >
            Reject
          </button>
          <button
            onClick={handleInvitation('accept')}
            type="button"
            data-ref="accept"
            className="primary-button"
          >
            Accept
          </button>
        </div>
      )}
      {rtcStatus === RTC_STATUS.FULL && (
        <div className="Communication__box">
          <p>Please, try another room!</p>
          <Link className="primary-button" to="/">
            OK
          </Link>
        </div>
      )}
    </div>
  ) : null;

export default Communication;
