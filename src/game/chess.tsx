const game: RawGame = {
  name: 'Chess',
  size: {
    width: 700,
    height: 500,
  },
  magneticGrid: [
    {
      mode: 'grid',
      type: ['magnetic', 'onlyOne'],
      forAvailableObjectsType: ['pawn'],
      gridInfo: {
        top: 75,
        left: 75,
        nbX: 8,
        nbY: 8,
        intervalX: 50,
        intervalY: 50,
      },
    },
  ],
  players: {
    nbSlot: 2,
  },
  sprites: [
    {
      id: '1',
      src: '/img/chess/spritesheet.png',
      size: {
        width: 300,
        height: 100,
      },
    },
  ],
  availableObjects: [
    {
      id: 'main_board',
      type: 'board',
      canMove: false,
      src: '/img/chess/board.jpg',
      size: {
        width: 500,
        height: 500,
      },
    },
    {
      id: 'white_pawn',
      type: 'pawn',
      canMove: true,
      spriteId: '1',
      inSpritePosition: {
        top: 0,
        left: 250,
      },
      size: {
        width: 50,
        height: 50,
      },
    },
    {
      id: 'black_pawn',
      type: 'pawn',
      canMove: true,
      spriteId: '1',
      inSpritePosition: {
        top: 50,
        left: 250,
      },
      size: {
        width: 50,
        height: 50,
      },
    },
    {
      id: 'white_tower',
      type: 'pawn',
      canMove: true,
      spriteId: '1',
      inSpritePosition: {
        top: 0,
        left: 200,
      },
      size: {
        width: 50,
        height: 50,
      },
    },
    {
      id: 'black_tower',
      type: 'pawn',
      canMove: true,
      spriteId: '1',
      inSpritePosition: {
        top: 50,
        left: 200,
      },
      size: {
        width: 50,
        height: 50,
      },
    },
    {
      id: 'white_knight',
      type: 'pawn',
      canMove: true,
      spriteId: '1',
      inSpritePosition: {
        top: 0,
        left: 150,
      },
      size: {
        width: 50,
        height: 50,
      },
    },
    {
      id: 'black_knight',
      type: 'pawn',
      canMove: true,
      spriteId: '1',
      inSpritePosition: {
        top: 50,
        left: 150,
      },
      size: {
        width: 50,
        height: 50,
      },
    },
    {
      id: 'white_bishop',
      type: 'pawn',
      canMove: true,
      spriteId: '1',
      inSpritePosition: {
        top: 0,
        left: 100,
      },
      size: {
        width: 50,
        height: 50,
      },
    },
    {
      id: 'black_bishop',
      type: 'pawn',
      canMove: true,
      spriteId: '1',
      inSpritePosition: {
        top: 50,
        left: 100,
      },
      size: {
        width: 50,
        height: 50,
      },
    },
    {
      id: 'white_queen',
      type: 'pawn',
      canMove: true,
      spriteId: '1',
      inSpritePosition: {
        top: 0,
        left: 50,
      },
      size: {
        width: 50,
        height: 50,
      },
    },
    {
      id: 'black_queen',
      type: 'pawn',
      canMove: true,
      spriteId: '1',
      inSpritePosition: {
        top: 50,
        left: 50,
      },
      size: {
        width: 50,
        height: 50,
      },
    },
    {
      id: 'white_king',
      type: 'pawn',
      canMove: true,
      spriteId: '1',
      inSpritePosition: {
        top: 0,
        left: 0,
      },
      size: {
        width: 50,
        height: 50,
      },
    },
    {
      id: 'black_king',
      type: 'pawn',
      canMove: true,
      spriteId: '1',
      inSpritePosition: {
        top: 50,
        left: 0,
      },
      size: {
        width: 50,
        height: 50,
      },
    },
  ],
  objects: [
    {
      type: 'main_board',
      pos: {
        top: 250,
        left: 250,
      },
    },
    {
      type: 'white_pawn',
      pos: {
        top: 125,
        left: 125,
      },
    },
    {
      type: 'white_pawn',
      pos: {
        top: 125,
        left: 175,
      },
    },
    {
      type: 'white_pawn',
      pos: {
        top: 125,
        left: 225,
      },
    },
    {
      type: 'white_pawn',
      pos: {
        top: 125,
        left: 75,
      },
    },
    {
      type: 'white_pawn',
      pos: {
        top: 125,
        left: 275,
      },
    },
    {
      type: 'white_pawn',
      pos: {
        top: 125,
        left: 325,
      },
    },
    {
      type: 'white_pawn',
      pos: {
        top: 125,
        left: 375,
      },
    },
    {
      type: 'white_pawn',
      pos: {
        top: 125,
        left: 425,
      },
    },
    {
      type: 'black_pawn',
      pos: {
        top: 375,
        left: 125,
      },
    },
    {
      type: 'black_pawn',
      pos: {
        top: 375,
        left: 175,
      },
    },
    {
      type: 'black_pawn',
      pos: {
        top: 375,
        left: 225,
      },
    },
    {
      type: 'black_pawn',
      pos: {
        top: 375,
        left: 75,
      },
    },
    {
      type: 'black_pawn',
      pos: {
        top: 375,
        left: 275,
      },
    },
    {
      type: 'black_pawn',
      pos: {
        top: 375,
        left: 325,
      },
    },
    {
      type: 'black_pawn',
      pos: {
        top: 375,
        left: 375,
      },
    },
    {
      type: 'black_pawn',
      pos: {
        top: 375,
        left: 425,
      },
    },
    {
      type: 'black_tower',
      pos: {
        top: 425,
        left: 425,
      },
    },
    {
      type: 'black_tower',
      pos: {
        top: 425,
        left: 75,
      },
    },
    {
      type: 'white_tower',
      pos: {
        top: 75,
        left: 425,
      },
    },
    {
      type: 'white_tower',
      pos: {
        top: 75,
        left: 75,
      },
    },
    {
      type: 'black_knight',
      pos: {
        top: 425,
        left: 375,
      },
    },
    {
      type: 'black_knight',
      pos: {
        top: 425,
        left: 125,
      },
    },
    {
      type: 'white_knight',
      pos: {
        top: 75,
        left: 375,
      },
    },
    {
      type: 'white_knight',
      pos: {
        top: 75,
        left: 125,
      },
    },
    {
      type: 'black_bishop',
      pos: {
        top: 425,
        left: 325,
      },
    },
    {
      type: 'black_bishop',
      pos: {
        top: 425,
        left: 175,
      },
    },
    {
      type: 'white_bishop',
      pos: {
        top: 75,
        left: 325,
      },
    },
    {
      type: 'white_bishop',
      pos: {
        top: 75,
        left: 175,
      },
    },
    {
      type: 'black_king',
      pos: {
        top: 425,
        left: 225,
      },
    },
    {
      type: 'white_king',
      pos: {
        top: 75,
        left: 225,
      },
    },
    {
      type: 'black_queen',
      pos: {
        top: 425,
        left: 275,
      },
    },
    {
      type: 'white_queen',
      pos: {
        top: 75,
        left: 275,
      },
    },
  ],
};

export default game;
