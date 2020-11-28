import _isEqual from 'lodash/isEqual';
import _cloneDeep from 'lodash/cloneDeep';

const MAGNETIC_TYPES = {
  MAGNETIC: 'magnetic',
  ONLY_ONE: 'onlyOne',
};
const MAGNETIC_MODE = {
  GRID: 'grid',
};

/**
 * prepare
 * @param {*} game
 */
export const prepare = (game: Game): Game => {
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
 * @param {*} pos
 * @param {*} magneticGrid
 * @param {*} type
 */
export const magneticPos = (
  currentGame: Game,
  currentObject: GameObjectWithDef,
  pos: Pos,
): Game => {
  const game = _cloneDeep(currentGame);
  const { magneticGrid } = game;
  const { type } = currentObject.def;
  if (!magneticGrid || !type) return game;
  const magneticGridFiltered = magneticGrid.filter(
    (e: MagneticGridElement) =>
      e.forAvailableObjectsType.includes(type) && e.type.includes(MAGNETIC_TYPES.MAGNETIC),
  );
  if (!magneticGridFiltered) return game;
  const fixedPos = magneticGridFiltered.reduce(
    (acc: Pos, item: MagneticGridElement) => {
      const { left, top } = item.pos || {};
      const { left: leftAcc, top: topAcc } = acc || {};
      if (!left || !top) return acc;
      if (
        (pos.left - left) ** 2 + (pos.top - top) ** 2 <
        (pos.left - leftAcc) ** 2 + (pos.top - topAcc) ** 2
      )
        return { left, top };
      return acc;
    },
    { left: 0, top: 0 },
  );

  game.objects[currentObject.index].pos = fixedPos;
  return game;
};

/**
 * onlyOne
 * @param index
 * @param game
 */
export const onlyOne = (game: Game, currentObject: GameObject): Game => {
  if (!game.objects || !game.magneticGrid) return game;
  if (game.magneticGrid) {
    const gridPoint = game.magneticGrid.find(m => _isEqual(m.pos, currentObject.pos));
    if (gridPoint && gridPoint.type.includes(MAGNETIC_TYPES.ONLY_ONE)) {
      return {
        ...game,
        objects: game.objects.filter(
          o => !_isEqual(o.pos, currentObject.pos) || o.id === currentObject.id,
        ),
      };
    }
  }

  return game;
};

/**
 * moveObject
 * @param game
 * @param currentObject
 * @param pos
 */
export const moveObject = (game: Game, currentObject: GameObjectWithDef, pos: Pos): Game => {
  if (currentObject && currentObject.index) {
    let newGame = _cloneDeep(game);
    // Magnetic
    newGame = magneticPos(newGame, currentObject, pos);
    // onlyOne
    newGame = onlyOne(newGame, newGame.objects[currentObject.index]);
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
