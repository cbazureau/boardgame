import React, { useMemo, useRef } from 'react';
import './Game.css';
import _cloneDeep from 'lodash/cloneDeep';
import GameObject from './GameObject';
import { magneticPos, onlyOne } from '../utils/game';

type Props = {
  game: Game;
  updateGame: (updateInfo: { game: GameUpdate }) => void;
  resetGame: () => void;
};

const Game = ({ game, updateGame, resetGame }: Props) => {
  const currentLimit: React.MutableRefObject<any> = useRef();

  const objects = useMemo(() => {
    return game.objects.map((obj: any, index: number) => {
      let sprite;
      const def = game.availableObjects.find((o: GameObject) => o.id === obj.type);
      if (def.spriteId) {
        sprite = (game.sprites || []).find((s: any) => s.id === def.spriteId);
      }
      return {
        def: { ...def, sprite },
        obj,
        index,
      };
    });
  }, [game]);

  const gameLimits = {
    width: `${game.size.width}px`,
    height: `${game.size.height}px`,
  };

  const onChange = (currentObjId: number, pos: Pos) => {
    if (currentObjId) {
      const newGame = _cloneDeep(game);
      const currentObject = objects.find(o => o.obj.id === currentObjId);
      if (currentObject && currentObject.index) {
        const fixedPos = magneticPos(pos, game.magneticGrid, currentObject.def.type);
        newGame.objects[currentObject.index].pos = fixedPos;
        newGame.objects = onlyOne(newGame.objects[currentObject.index], newGame);
        console.log({ currentObjId, pos, fixedPos });
        updateGame({ game: { objects: newGame.objects } });
      }
    }
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
