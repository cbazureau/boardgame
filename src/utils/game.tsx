import _isEqual from 'lodash/isEqual';
import _cloneDeep from 'lodash/cloneDeep';
import { v4 as uuidv4 } from 'uuid';

const MAGNETIC_TYPES = {
  MAGNETIC: 'magnetic',
  ONLY_ONE: 'onlyOne',
};
const MAGNETIC_MODE = {
  GRID: 'grid',
};

/**
 * movePipe
 * @param fns
 */
const movePipe = (...fns: Array<(args: MoveArgs) => MoveArgs>) => (x: MoveArgs): MoveArgs =>
  fns.reduce((v, f) => f(v), x);

/**
 * prepare
 * @param {*} game
 */
export const prepare = (currentGame: RawGame): Game => {
  // Populate objId
  const game: Game = {
    ..._cloneDeep(currentGame),
    objects: currentGame.objects.map((o: RawGameObject): GameObject => ({ ...o, id: uuidv4() })),
  };

  if (!game.magneticGrid) return game;
  const magneticGrid = game.magneticGrid.reduce(
    (acc: Array<MagneticGridElement>, item: MagneticGridElement) => {
      if (item.mode === MAGNETIC_MODE.GRID && item.gridInfo) {
        const gridPoints = [];
        const { left, top, intervalX, intervalY, nbX, nbY } = item.gridInfo || {};
        for (let i = 0; i < nbX; i += 1) {
          for (let j = 0; j < nbY; j += 1) {
            gridPoints.push({
              type: item.type,
              forAvailableObjectsType: item.forAvailableObjectsType,
              distance: item.distance,
              pos: {
                left: left + i * intervalX,
                top: top + j * intervalY,
              },
            });
          }
        }
        return [...acc, ...gridPoints];
      }
      return [...acc, item];
    },
    [],
  );
  return { ...game, magneticGrid };
};

/**
 * magneticPos
 * @param game
 * @param currentObject
 * @param pos
 */
export const magneticPos = ({ game: currentGame, currentObject, pos }: MoveArgs): MoveArgs => {
  const game = _cloneDeep(currentGame);
  const { magneticGrid } = game;
  const { type } = currentObject.def;
  if (!magneticGrid || !type) return { game: currentGame, currentObject, pos };
  const magneticGridFiltered = magneticGrid.filter(
    (e: MagneticGridElement) =>
      e.forAvailableObjectsType.includes(type) && e.type.includes(MAGNETIC_TYPES.MAGNETIC),
  );
  if (!magneticGridFiltered) return { game: currentGame, currentObject, pos };
  let fixedPos = magneticGridFiltered.reduce(
    (acc: Pos, item: MagneticGridElement) => {
      const { left, top } = item.pos || {};
      const { left: leftAcc, top: topAcc } = acc || {};
      if (!left || !top) return acc;
      if (
        (pos.left - left) ** 2 + (pos.top - top) ** 2 <
          (pos.left - leftAcc) ** 2 + (pos.top - topAcc) ** 2 &&
        (pos.left - left) ** 2 + (pos.top - top) ** 2 < item.distance ** 2
      )
        return { left, top };
      return acc;
    },
    { left: 0, top: 0 },
  );
  if (fixedPos.left === 0 && fixedPos.top === 0) fixedPos = pos;

  const newCurrentObject = _cloneDeep(currentObject);
  game.objects[currentObject.index].pos = fixedPos;
  newCurrentObject.obj.pos = fixedPos;
  console.log({ fixedPos }, game.objects);
  return { game, currentObject: newCurrentObject, pos: fixedPos };
};

/**
 * onlyOne
 * @param game
 * @param currentObject
 * @param pos
 */
export const onlyOne = ({ game: currentGame, currentObject, pos }: MoveArgs): MoveArgs => {
  const game = _cloneDeep(currentGame);
  if (!game.objects || !game.magneticGrid) return { game: currentGame, currentObject, pos };
  const gridPoint = game.magneticGrid.find(m => _isEqual(m.pos, pos));
  if (gridPoint && gridPoint.type.includes(MAGNETIC_TYPES.ONLY_ONE)) {
    return {
      game: {
        ...game,
        objects: game.objects.filter(o => !_isEqual(o.pos, pos) || o.id === currentObject.obj.id),
      },
      currentObject,
      pos,
    };
  }

  return { game: currentGame, currentObject, pos };
};

/**
 * moveObject
 * @param game
 * @param currentObject
 * @param pos
 */
export const moveObject = ({ game, currentObject, pos }: MoveArgs): Game => {
  if (currentObject && currentObject.index) {
    const { game: newGame } = movePipe(magneticPos, onlyOne)({ game, currentObject, pos });
    return newGame;
  }
  return game;
};

/**
 * getObjectsWithDef
 * @param game
 */
export const getObjectsWithDef = (game: Game): Array<GameObjectWithDef> => {
  return game.objects
    .map(
      (obj: GameObject, index: number): GameObjectWithDef => {
        let sprite;
        const def = game.availableObjects.find(
          (d: GameObjectDef) => d.id === obj.type,
        ) as GameObjectDef;
        if (def.spriteId) {
          sprite = (game.sprites || []).find((s: Sprite) => s.id === def.spriteId);
        }
        return {
          def: { ...def, sprite },
          obj,
          index,
        };
      },
    )
    .filter((o: GameObjectWithDef) => !!o);
};
