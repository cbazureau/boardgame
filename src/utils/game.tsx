/**
 * prepare
 * @param {*} game
 */
export const prepare = (game: Game): Game => {
  if (!game.magneticGrid) return game;
  const magneticGrid = game.magneticGrid.reduce((acc: Array<any>, item: any) => {
    if (item.type === 'auto') {
      let gridPoints = [];
      for (let i = 0; i < item.nbX; i++) {
        for (let j = 0; j < item.nbY; j++) {
          gridPoints.push({
            type: 'default',
            forAvailableObjectsType: item.forAvailableObjectsType,
            x: item.left + i * item.intervalX,
            y: item.top + j * item.intervalY,
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
 * @param {*} type
 */
export const magneticPos = (pos: Pos, type: string) => {
  return pos;
};
