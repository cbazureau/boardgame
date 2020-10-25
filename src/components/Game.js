import React, { useEffect, useRef, useState } from 'react';
import './Game.css';

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
				left: 500
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

const imageLoader = async (urls) => {
	return await Promise.all(
		urls.map(
			(url) =>
				new Promise((resolve, reject) => {
					const img = new Image();
					img.onload = function() {
						resolve({ src: url, img });
					};
					img.src = url;
				})
		)
	);
};

const Game = () => {
	const canvas = useRef();
	const [ imageLoaded, setImageLoaded ] = useState(false);

	// PreLoadImg
	useEffect(
		() => {
			if (imageLoaded) return;
			const loadImages = async () => {
				const imgs = game.objects.reduce((acc, obj) => {
					const objDef = game.availableObjects.find((o) => o.id === obj.type);
					return acc.includes(objDef.src) ? acc : [ ...acc, objDef.src ];
        }, []);
        const a = await imageLoader(imgs);
				setImageLoaded(a);
      };
      loadImages();
		},
		[ imageLoaded ]
	);

	useEffect(
		() => {
			if (canvas.current && imageLoaded) {
				const ctx = canvas.current.getContext('2d');
				ctx.imageSmoothingEnabled = false;
				game.objects.forEach((obj) => {
          const objDef = game.availableObjects.find((o) => o.id === obj.type);
          const imgToDraw = imageLoaded.find(i => i.src === objDef.src).img;
          if(!objDef.isSpriteSheet)
            ctx.drawImage(
              imgToDraw,
              0,
              0,
              objDef.size.width*2,
              objDef.size.height*2,
              obj.pos.left,
              obj.pos.top,
              objDef.size.width,
              objDef.size.height,
            );
          else
            ctx.drawImage(
              imgToDraw,
              objDef.inSpritePosition.left,
              objDef.inSpritePosition.top,
              objDef.size.width*2,
              objDef.size.height*2,
              obj.pos.left,
              obj.pos.top,
              objDef.size.width,
              objDef.size.height,
            );
				});
			}
		},
		[ canvas, imageLoaded ]
	);
	return (
		<div className="Game">
			<canvas className="Game__board" ref={canvas} width={game.size.width} height={game.size.height} />
		</div>
	);
};

export default Game;
