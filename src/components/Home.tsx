import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import store from '../store';
import game from '../game/chess';
import { prepare } from '../utils/game';
import Button from './Button';
import './Home.css';

const chessGame = prepare(game);

type Props = {
  proposedGame: Game | null;
  setProposedGame: (proposedGame: Game | null) => void;
};

const DEFAULT_ROOM = uuidv4();

const Home = ({ setProposedGame, proposedGame }: Props): JSX.Element => {
  const [selectedGame, selectGame] = useState<string>('');

  useEffect(() => {
    if (selectedGame === 'chess') setProposedGame(chessGame);
    else setProposedGame(null);
  }, [selectedGame, setProposedGame]);

  return (
    <div className="Home">
      <h1 className="Home__title">SandBoard</h1>
      <select
        value={selectedGame}
        className="Home__select"
        onChange={event => selectGame(event.target.value)}
      >
        <option value="">-- Choose a game --</option>
        <option value="chess">Chess</option>
      </select>
      {proposedGame && (
        <Link className="Home__button" to={`/r/${DEFAULT_ROOM}`}>
          <Button>Start a new room</Button>
        </Link>
      )}
    </div>
  );
};

const mapStateToProps = ({ rtc: { proposedGame } }: Store) => ({
  proposedGame,
});

const mapDispatchToProps = () => ({
  setProposedGame: (proposedGame: Game | null) =>
    store.dispatch({ type: 'SET_PROPOSED_GAME', proposedGame }),
});
export default connect(mapStateToProps, mapDispatchToProps)(Home);
