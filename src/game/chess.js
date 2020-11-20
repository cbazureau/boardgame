const game = {
  name: 'Chess',
  size: {
    width: 700,
    height: 500,
  },
  magneticGrid: [
    {
      type: 'auto',
      forAvailableObjectsType: ['pawn'],
      top: 75,
      left: 75,
      nbX: 8,
      nbY: 8,
      intervalX: 50,
      intervalY: 50,
    },
  ],
  playerRequired: {
    min: 2,
    max: 2,
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
      id: 1,
      type: 'main_board',
      pos: {
        top: 250,
        left: 250,
      },
    },
    {
      id: 2,
      type: 'white_pawn',
      pos: {
        top: 125,
        left: 125,
      },
    },
    {
      id: 4,
      type: 'white_pawn',
      pos: {
        top: 125,
        left: 175,
      },
    },
    {
      id: 5,
      type: 'white_pawn',
      pos: {
        top: 125,
        left: 225,
      },
    },
    {
      id: 6,
      type: 'white_pawn',
      pos: {
        top: 125,
        left: 75,
      },
    },
    {
      id: 7,
      type: 'white_pawn',
      pos: {
        top: 125,
        left: 275,
      },
    },
    {
      id: 8,
      type: 'white_pawn',
      pos: {
        top: 125,
        left: 325,
      },
    },
    {
      id: 9,
      type: 'white_pawn',
      pos: {
        top: 125,
        left: 375,
      },
    },
    {
      id: 10,
      type: 'white_pawn',
      pos: {
        top: 125,
        left: 425,
      },
    },
    {
      id: 11,
      type: 'black_pawn',
      pos: {
        top: 375,
        left: 125,
      },
    },
    {
      id: 12,
      type: 'black_pawn',
      pos: {
        top: 375,
        left: 175,
      },
    },
    {
      id: 13,
      type: 'black_pawn',
      pos: {
        top: 375,
        left: 225,
      },
    },
    {
      id: 14,
      type: 'black_pawn',
      pos: {
        top: 375,
        left: 75,
      },
    },
    {
      id: 15,
      type: 'black_pawn',
      pos: {
        top: 375,
        left: 275,
      },
    },
    {
      id: 16,
      type: 'black_pawn',
      pos: {
        top: 375,
        left: 325,
      },
    },
    {
      id: 17,
      type: 'black_pawn',
      pos: {
        top: 375,
        left: 375,
      },
    },
    {
      id: 18,
      type: 'black_pawn',
      pos: {
        top: 375,
        left: 425,
      },
    },
    {
      id: 19,
      type: 'black_tower',
      pos: {
        top: 425,
        left: 425,
      },
    },
    {
      id: 20,
      type: 'black_tower',
      pos: {
        top: 425,
        left: 75,
      },
    },
    {
      id: 21,
      type: 'white_tower',
      pos: {
        top: 75,
        left: 425,
      },
    },
    {
      id: 22,
      type: 'white_tower',
      pos: {
        top: 75,
        left: 75,
      },
    },
    {
      id: 23,
      type: 'black_knight',
      pos: {
        top: 425,
        left: 375,
      },
    },
    {
      id: 24,
      type: 'black_knight',
      pos: {
        top: 425,
        left: 125,
      },
    },
    {
      id: 25,
      type: 'white_knight',
      pos: {
        top: 75,
        left: 375,
      },
    },
    {
      id: 26,
      type: 'white_knight',
      pos: {
        top: 75,
        left: 125,
      },
    },
    {
      id: 27,
      type: 'black_bishop',
      pos: {
        top: 425,
        left: 325,
      },
    },
    {
      id: 28,
      type: 'black_bishop',
      pos: {
        top: 425,
        left: 175,
      },
    },
    {
      id: 29,
      type: 'white_bishop',
      pos: {
        top: 75,
        left: 325,
      },
    },
    {
      id: 30,
      type: 'white_bishop',
      pos: {
        top: 75,
        left: 175,
      },
    },
    {
      id: 31,
      type: 'black_queen',
      pos: {
        top: 425,
        left: 225,
      },
    },
    {
      id: 32,
      type: 'white_queen',
      pos: {
        top: 75,
        left: 225,
      },
    },
    {
      id: 33,
      type: 'black_king',
      pos: {
        top: 425,
        left: 275,
      },
    },
    {
      id: 34,
      type: 'white_king',
      pos: {
        top: 75,
        left: 275,
      },
    },
  ],
};

export default game;
