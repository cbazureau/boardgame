import _cloneDeep from 'lodash/cloneDeep';
import { v4 as uuidv4 } from 'uuid';

const MAGNETIC_TYPES = {
  MAGNETIC: 'magnetic',
  ONLY_ONE: 'onlyOne',
  BANK: 'bank',
};
const MAGNETIC_MODE = {
  GRID: 'grid',
};

/**
 * samePos
 * @param posA
 * @param posB
 */
const samePos = (posA?: Pos, posB?: Pos): boolean => {
  if (!posA || !posB) return false;
  return posA.left === posB.left && posA.top === posB.top;
};

/**
 * movePipe
 * @param fns
 */
const movePipe = (...fns: Array<(args: MoveArgs) => MoveArgs>) => (x: MoveArgs): MoveArgs =>
  fns.reduce((v, f) => f(v), x);

/**
 * magneticGridSetup
 * @param currentGame
 */
const magneticGridSetup = (currentGame: RawGame): RawGame => {
  const game = _cloneDeep(currentGame);
  if (!game.setup) return game;
  const magneticGrid = game.setup.reduce(
    (acc: Array<MagneticGridElement>, item: Setup) => {
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
    [...(game.magneticGrid || [])],
  );
  return { ...game, magneticGrid };
};

/**
 * bankSetup
 * @param currentGame
 */
const bankSetup = (currentGame: RawGame): RawGame => {
  const game = _cloneDeep(currentGame);
  if (!game.magneticGrid) return game;
  game.magneticGrid = game.magneticGrid.map(
    (mg: MagneticGridElement): MagneticGridElement => {
      if (!mg.type.includes(MAGNETIC_TYPES.BANK) || !mg.pos) return mg;
      const bankObj = game.objects.find(o => samePos(o.pos, mg.pos));
      if (!bankObj) return mg;
      return { ...mg, bankObjType: bankObj.type };
    },
  );
  return game;
};

/**
 * populateIdSetup
 * @param currentGame
 */
const populateIdSetup = (currentGame: RawGame): Game => {
  const finalGame: Game = {
    ..._cloneDeep(currentGame),
    objects: currentGame.objects.map((o: RawGameObject): GameObject => ({ ...o, id: uuidv4() })),
  };
  return finalGame;
};

/**
 * prepare
 * @param {*} game
 */
export const prepare = (currentGame: RawGame): Game => {
  // magneticGridSetup
  let game = magneticGridSetup(currentGame);

  // bankSetup
  game = bankSetup(game);

  // Populate objId
  return populateIdSetup(game);
};

/**
 * magneticPosMove
 * @param game
 * @param currentObject
 * @param pos
 */
const magneticPosMove = ({ game: currentGame, currentObject, pos }: MoveArgs): MoveArgs => {
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
  return { game, currentObject: newCurrentObject, pos: fixedPos };
};

/**
 * onlyOneMove
 * @param game
 * @param currentObject
 * @param pos
 */
const onlyOneMove = ({ game: currentGame, currentObject, pos }: MoveArgs): MoveArgs => {
  const game = _cloneDeep(currentGame);
  if (!game.objects || !game.magneticGrid) return { game: currentGame, currentObject, pos };
  const gridPoint = game.magneticGrid.find(m => samePos(m.pos, pos));
  if (gridPoint && gridPoint.type.includes(MAGNETIC_TYPES.ONLY_ONE)) {
    return {
      game: {
        ...game,
        objects: game.objects.filter(o => !samePos(o.pos, pos) || o.id === currentObject.obj.id),
      },
      currentObject,
      pos,
    };
  }

  return { game: currentGame, currentObject, pos };
};

/**
 * bankMove
 * @param game
 * @param currentObject
 * @param pos
 */
const bankMove = ({ game: currentGame, currentObject, pos }: MoveArgs): MoveArgs => {
  const game = _cloneDeep(currentGame);
  if (!game.magneticGrid) return { game, currentObject, pos };

  game.magneticGrid
    .filter(
      (mg: MagneticGridElement) =>
        mg.type.includes(MAGNETIC_TYPES.BANK) && mg.pos && mg.bankObjType,
    )
    .forEach((mg: MagneticGridElement) => {
      const bankObjIndex = game.objects.findIndex(o => samePos(o.pos, mg.pos));
      if (
        mg.bankObjType &&
        bankObjIndex !== -1 &&
        game.objects[bankObjIndex].type !== mg.bankObjType
      ) {
        game.objects[bankObjIndex] = {
          ...game.objects[bankObjIndex],
          id: uuidv4(),
          type: mg.bankObjType,
        };
      } else if (mg.bankObjType && mg.pos && bankObjIndex === -1) {
        game.objects.push({
          pos: mg.pos,
          id: uuidv4(),
          type: mg.bankObjType,
        });
      }
    });

  return { game, currentObject, pos };
};

/**
 * moveObject
 * @param game
 * @param currentObject
 * @param pos
 */
export const moveObject = ({ game, currentObject, pos }: MoveArgs): Game => {
  if (currentObject && currentObject.index) {
    const { game: newGame } = movePipe(
      magneticPosMove,
      onlyOneMove,
      bankMove,
    )({ game, currentObject, pos });
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
