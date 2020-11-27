import React from 'react';
import { Link } from 'react-router-dom';
import './Communication.css';
import STATUS from '../utils/status';

import game from '../game/chess';
import { prepare } from '../utils/game';

const chessGame = prepare(game);

type Props = {
  sendInfos: (selectedGame: Game) => void;
  send: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleInvitation: (
    returnStatus: string,
  ) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  message: string;
  status: string;
};

const Communication = ({ send, sendInfos, handleInvitation, message, status }: Props) =>
  [STATUS.JOIN, STATUS.APPROVE, STATUS.FULL, STATUS.IN_LOBBY].includes(status) ? (
    <div className="Communication">
      {status === STATUS.JOIN && (
        <div className="Communication__box">
          <p>Send an invitation to join the room.</p>
          <button onClick={send} type="button" className="primary-button">
            Send
          </button>
        </div>
      )}
      {status === STATUS.IN_LOBBY && (
        <div className="Communication__box">
          <p>Welcome to this room</p>
          <button onClick={() => sendInfos(chessGame)} type="button" className="primary-button">
            Send Infos
          </button>
        </div>
      )}
      {status === STATUS.APPROVE && (
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

export default Communication;
