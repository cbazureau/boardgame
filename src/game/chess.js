
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
		}
	]
};

export default game;
