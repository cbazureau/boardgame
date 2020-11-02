
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
			src: '/img/chess/spritesheet.png',
			isSpriteSheet: true,
			inSpritePosition: {
				top: 0,
				left: 250
      },
      spriteTotalSize: {
        width: 300,
        height: 100,
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
				top: 97,
				left: 98
			}
		},
		{
			id: 4,
			type: 'white_pawn',
			pos: {
				top: 97,
				left: 148
			}
		},
		{
			id: 5,
			type: 'white_pawn',
			pos: {
				top: 97,
				left: 199
			}
		},
		{
			id: 6,
			type: 'white_pawn',
			pos: {
				top: 97,
				left: 48
			}
		},
		{
			id: 7,
			type: 'white_pawn',
			pos: {
				top: 97,
				left: 250
			}
		},
		{
			id: 8,
			type: 'white_pawn',
			pos: {
				top: 97,
				left: 301
			}
		},
		{
			id: 9,
			type: 'white_pawn',
			pos: {
				top: 97,
				left: 352
			}
		},
		{
			id: 10,
			type: 'white_pawn',
			pos: {
				top: 97,
				left: 403
			}
		}
	]
};

export default game;
