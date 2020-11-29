import React, { useMemo, useRef } from 'react';
import './Game.css';
import GameObject from './GameObject';
import { moveObject, getObjectsWithDef } from '../utils/game';

type Props = {
  game: Game;
  updateGame: (updateInfos: { game: GameUpdate }) => void;
  resetGame: () => void;
};

const Game = ({ game, updateGame, resetGame }: Props): JSX.Element => {
  const currentLimit = useRef<HTMLDivElement>(null);

  const objects = useMemo((): Array<GameObjectWithDef> => getObjectsWithDef(game), [game]);

  const gameLimits = {
    width: `${game.size.width}px`,
    height: `${game.size.height}px`,
  };

  const onChange = (currentObjId: string, pos: Pos) => {
    const currentObject = objects.find(o => o.obj.id === currentObjId);
    if (!currentObject) return;
    const newGame = moveObject({ game, currentObject, pos });
    updateGame({ game: { objects: newGame.objects } });
  };

  return (
    <div className="Game">
      <button onClick={resetGame} type="button">
        Reset
      </button>
      <div className="Game__limits" style={gameLimits} ref={currentLimit}>
        {objects.map((o: GameObjectWithDef) => (
          <GameObject key={o.obj.id} def={o.def} obj={o.obj} onChange={onChange} />
        ))}
      </div>
    </div>
  );
};

export default Game;
