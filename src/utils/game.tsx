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
  const magneticGrid = game.magneticGrid.reduce((acc: Array<any>, item: any) => {
    if (item.mode === MAGNETIC_MODE.GRID) {
      let gridPoints = [];
      const { left, top, intervalX, intervalY, nbX, nbY } = item.gridInfo || {};
      for (let i = 0; i < nbX; i++) {
        for (let j = 0; j < nbY; j++) {
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
  }, []);

  console.log(magneticGrid);
  return { ...game, magneticGrid };
};

/**
 * magneticPos
 * @param {*} pos
 * @param {*} magneticGrid
 * @param {*} type
 */
export const magneticPos = (pos: Pos, magneticGrid?: Array<MagneticGridElement>, type?: string) => {
  if (!magneticGrid || !type) return pos;
  const magneticGridFiltered = magneticGrid.filter(
    (e: MagneticGridElement) =>
      e.forAvailableObjectsType.includes(type) && e.type.includes(MAGNETIC_TYPES.MAGNETIC),
  );
  if (!magneticGridFiltered) return pos;
  const finalPos = magneticGridFiltered.reduce(
    (acc: Pos, item: MagneticGridElement) => {
      const { left, top } = item.pos || {};
      const { left: leftAcc, top: topAcc } = acc || {};
      if (!left || !top) return acc;
      if (
        Math.pow(pos.left - left, 2) + Math.pow(pos.top - top, 2) <
        Math.pow(pos.left - leftAcc, 2) + Math.pow(pos.top - topAcc, 2)
      )
        return { left, top };
      return acc;
    },
    { left: 0, top: 0 },
  );
  return finalPos;
};
