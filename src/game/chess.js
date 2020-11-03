
const game = {
	name: 'Chess',
	size: {
		width: 500,
		height: 500
	},
	playerRequired: {
		min: 2,
		max: 2
  },
  sprites: [{
    id: '1',
    src: '/img/chess/spritesheet.png',
    size: {
      width: 300,
      height: 100,
    },
  }],
	availableObjects: [
		{
			id: 'main_board',
			type: 'board',
			canMove: false,
			src: '/img/chess/board.jpg',
			size: {
				width: 500,
				height: 500
			}
		},
		{
			id: 'white_pawn',
			type: 'pawn',
      canMove: true,
      spriteId: '1',
			inSpritePosition: {
				top: 0,
				left: 250
      },
			size: {
				width: 50,
				height: 50
			}
		},
		{
			id: 'black_pawn',
			type: 'pawn',
      canMove: true,
      spriteId: '1',
			inSpritePosition: {
				top: 50,
				left: 250
      },
			size: {
				width: 50,
				height: 50
			}
		},
		{
			id: 'white_tower',
			type: 'pawn',
      canMove: true,
      spriteId: '1',
			inSpritePosition: {
				top: 0,
				left: 200
      },
			size: {
				width: 50,
				height: 50
			}
		},
		{
			id: 'black_tower',
			type: 'pawn',
      canMove: true,
      spriteId: '1',
			inSpritePosition: {
				top: 50,
				left: 200
      },
			size: {
				width: 50,
				height: 50
			}
		},
		{
			id: 'white_knight',
			type: 'pawn',
      canMove: true,
      spriteId: '1',
			inSpritePosition: {
				top: 0,
				left: 150
      },
			size: {
				width: 50,
				height: 50
			}
		},
		{
			id: 'black_knight',
			type: 'pawn',
      canMove: true,
      spriteId: '1',
			inSpritePosition: {
				top: 50,
				left: 150
      },
			size: {
				width: 50,
				height: 50
			}
		},
		{
			id: 'white_bishop',
			type: 'pawn',
      canMove: true,
      spriteId: '1',
			inSpritePosition: {
				top: 0,
				left: 100
      },
			size: {
				width: 50,
				height: 50
			}
		},
		{
			id: 'black_bishop',
			type: 'pawn',
      canMove: true,
      spriteId: '1',
			inSpritePosition: {
				top: 50,
				left: 100
      },
			size: {
				width: 50,
				height: 50
			}
		},
		{
			id: 'white_queen',
			type: 'pawn',
      canMove: true,
      spriteId: '1',
			inSpritePosition: {
				top: 0,
				left: 50
      },
			size: {
				width: 50,
				height: 50
			}
		},
		{
			id: 'black_queen',
			type: 'pawn',
      canMove: true,
      spriteId: '1',
			inSpritePosition: {
				top: 50,
				left: 50
      },
			size: {
				width: 50,
				height: 50
			}
		},
		{
			id: 'white_king',
			type: 'pawn',
      canMove: true,
      spriteId: '1',
			inSpritePosition: {
				top: 0,
				left: 0
      },
			size: {
				width: 50,
				height: 50
			}
		},
		{
			id: 'black_king',
			type: 'pawn',
      canMove: true,
      spriteId: '1',
			inSpritePosition: {
				top: 50,
				left: 0
      },
			size: {
				width: 50,
				height: 50
			}
		}
	],
	objects: [
		{
			id: 1,
			type: 'main_board',
			pos: {
				top: 0,
				left: 0
			}
		},
		{
			id: 2,
			type: 'white_pawn',
			pos: {
				top: 100,
				left: 100
			}
		},
		{
			id: 4,
			type: 'white_pawn',
			pos: {
				top: 100,
				left: 150
			}
		},
		{
			id: 5,
			type: 'white_pawn',
			pos: {
				top: 100,
				left: 200
			}
		},
		{
			id: 6,
			type: 'white_pawn',
			pos: {
				top: 100,
				left: 50
			}
		},
		{
			id: 7,
			type: 'white_pawn',
			pos: {
				top: 100,
				left: 250
			}
		},
		{
			id: 8,
			type: 'white_pawn',
			pos: {
				top: 100,
				left: 300
			}
		},
		{
			id: 9,
			type: 'white_pawn',
			pos: {
				top: 100,
				left: 350
			}
		},
		{
			id: 10,
			type: 'white_pawn',
			pos: {
				top: 100,
				left: 400
			}
    },
		{
			id: 11,
			type: 'black_pawn',
			pos: {
				top: 350,
				left: 100
			}
		},
		{
			id: 12,
			type: 'black_pawn',
			pos: {
				top: 350,
				left: 150
			}
		},
		{
			id: 13,
			type: 'black_pawn',
			pos: {
				top: 350,
				left: 200
			}
		},
		{
			id: 14,
			type: 'black_pawn',
			pos: {
				top: 350,
				left: 50
			}
		},
		{
			id: 15,
			type: 'black_pawn',
			pos: {
				top: 350,
				left: 250
			}
		},
		{
			id: 16,
			type: 'black_pawn',
			pos: {
				top: 350,
				left: 300
			}
		},
		{
			id: 17,
			type: 'black_pawn',
			pos: {
				top: 350,
				left: 350
			}
		},
		{
			id: 18,
			type: 'black_pawn',
			pos: {
				top: 350,
				left: 400
			}
		},
		{
			id: 19,
			type: 'black_tower',
			pos: {
				top: 400,
				left: 400
			}
		},
		{
			id: 20,
			type: 'black_tower',
			pos: {
				top: 400,
				left: 50
			}
		},
		{
			id: 21,
			type: 'white_tower',
			pos: {
				top: 50,
				left: 400
			}
		},
		{
			id: 22,
			type: 'white_tower',
			pos: {
				top: 50,
				left: 50
			}
		},
		{
			id: 23,
			type: 'black_knight',
			pos: {
				top: 400,
				left: 350
			}
		},
		{
			id: 24,
			type: 'black_knight',
			pos: {
				top: 400,
				left: 100
			}
		},
		{
			id: 25,
			type: 'white_knight',
			pos: {
				top: 50,
				left: 350
			}
		},
		{
			id: 26,
			type: 'white_knight',
			pos: {
				top: 50,
				left: 100
			}
		},
		{
			id: 27,
			type: 'black_bishop',
			pos: {
				top: 400,
				left: 300
			}
		},
		{
			id: 28,
			type: 'black_bishop',
			pos: {
				top: 400,
				left: 150
			}
		},
		{
			id: 29,
			type: 'white_bishop',
			pos: {
				top: 50,
				left: 300
			}
		},
		{
			id: 30,
			type: 'white_bishop',
			pos: {
				top: 50,
				left: 150
			}
    },
    {
			id: 31,
			type: 'black_queen',
			pos: {
				top: 400,
				left: 200
			}
		},
		{
			id: 32,
			type: 'white_queen',
			pos: {
				top: 50,
				left: 200
			}
		},
    {
			id: 33,
			type: 'black_king',
			pos: {
				top: 400,
				left: 250
			}
		},
		{
			id: 34,
			type: 'white_king',
			pos: {
				top: 50,
				left: 250
			}
		},
	]
};

export default game;
