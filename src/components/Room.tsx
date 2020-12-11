/* eslint-disable jsx-a11y/media-has-caption */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import store from '../store';
import useBeforeUnload from '../utils/useBeforeUnload';
import './Room.css';
import Game from './Game';
import { USER_STATUS } from '../utils/status';
import RTC from './RTC/RTC';
import Button from './Button';
import Users from './Users';

type Props = {
  proposedGame: Game | null;
  match: any;
  history: any;
  game: Game | void;
  users: Array<User>;
  updateGame: (updateInfos: { game?: GameUpdate | Game; users?: Array<User> }) => void;
};

/**
 * Room
 * Create or access to a room
 */
const Room = ({
  match,
  game,
  updateGame,
  proposedGame,
  history,
  users,
}: Props): JSX.Element | null => {
  const socketDomain =
    window.location.host === 'localhost:3000' ? 'localhost:5000' : 'sandboard-server.herokuapp.com';
  const protocol = window.location.host.indexOf('localhost') > -1 ? 'http' : 'https';

  const [status, setStatus] = useState(USER_STATUS.GETTING_ROOM);
  const [username, setUsername] = useState('Bob');
  const socket = useRef(io.connect(`${protocol}://${socketDomain}`));
  const roomId = match.params.room;

  const onHangUp = useCallback(() => {
    console.log('[Room] onHangUp');
    socket.current.emit('leave');
  }, []);

  useBeforeUnload(onHangUp);

  useEffect(() => {
    if (status === USER_STATUS.GETTING_ROOM) {
      const onEnterGame = () => {
        console.log('[Room] onEnterGame');
        setStatus(USER_STATUS.IN_GAME);
      };

      const onEnterLobby = ({ currentUser }: { currentUser: User }) => {
        console.log('[Room] onEnterLobby', { currentUser });
        setStatus(USER_STATUS.IN_LOBBY);
      };
      socket.current.on('enter-lobby', onEnterLobby);
      socket.current.on('enter-game', onEnterGame);
      socket.current.on('update', updateGame);

      // Emit a welcome to enter in the Lobby
      socket.current.emit('welcome-lobby', { roomId, proposedGame });
    }
  }, [roomId, status, updateGame, proposedGame]);

  /**
   * handleHangup
   */
  const tryEnterGame = () => {
    console.log('[Room] tryEnterGame', username);
    if (proposedGame || game) {
      socket.current.emit('welcome-game', { username });
    }
  };

  /**
   * updateSocketGame
   * @param {*} param0
   */
  const updateSocketGame = ({ game: newGame }: { game: GameUpdate }) => {
    socket.current.emit('play', { game: newGame });
  };

  /**
   * resetGame
   */
  const resetGame = () => {
    socket.current.emit('reset');
  };

  console.log('[Room] status', status);

  return (
    <div className="Room">
      {!proposedGame && !game && (
        <div className="Room__unknown">
          <p>Room Unknown</p>
          <Button onClick={() => history.push('/')}>Back</Button>
        </div>
      )}
      {status === USER_STATUS.IN_GAME && (
        <div className="Room__game">
          {!!game && <Game game={game} updateGame={updateSocketGame} resetGame={resetGame} />}
        </div>
      )}
      {status === USER_STATUS.IN_GAME && (
        <div className="Room__RTC">
          <RTC socket={socket} onHangUp={onHangUp} />
        </div>
      )}
      {status === USER_STATUS.IN_LOBBY && (
        <div className="Room__lobby">
          <p>Welcome to this room</p>
          <Users users={users} />
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="Room__lobby__username"
          />
          <Button onClick={tryEnterGame}>Enter Game</Button>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = ({ rtc: { game, proposedGame, users } }: Store) => ({
  game,
  proposedGame,
  users,
});
const mapDispatchToProps = () => ({
  updateGame: ({ game, users }: { game?: GameUpdate | Game; users?: Array<User> }) =>
    store.dispatch({ type: 'UPDATE_GAME', game, users }),
});
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Room));
