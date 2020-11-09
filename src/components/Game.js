import React, { useEffect, useMemo, useState } from 'react';
import './Game.css';
import GameObject from './GameObject';

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

const Game = ({ game }) => {
	const [ imageLoaded, setImageLoaded ] = useState(false);

	// PreLoadImg
	useEffect(
		() => {
			if (imageLoaded) return;
			const loadImages = async () => {
				const imgs = game.objects.reduce((acc, obj) => {
					const objDef = game.availableObjects.find((o) => o.id === obj.type);
					const src = objDef.spriteId ? game.sprites.find((s) => s.id === objDef.spriteId).src : objDef.src;
					return acc.includes(src) ? acc : [ ...acc, src ];
				}, []);
				const a = await imageLoader(imgs);
				setImageLoaded(a);
			};
			loadImages();
		},
		[ imageLoaded, game ]
	);

	const objects = useMemo(
		() => {
			if (!imageLoaded) return [];
			return game.objects.map((obj) => {
				let sprite = undefined;
				const def = game.availableObjects.find((o) => o.id === obj.type);
				if (def.spriteId) {
					sprite = game.sprites.find((s) => s.id === def.spriteId);
				}
				return {
					def: { ...def, sprite },
					obj
				};
			});
		},
		[ imageLoaded, game ]
	);

	const gameLimits = {
		width: `${game.size.width}px`,
		height: `${game.size.height}px`
	};

	return (
		<div className="Game">
			<div className="Game__limits" style={gameLimits}>
				{objects.map((o) => <GameObject key={o.obj.id} def={o.def} obj={o.obj} />)}
			</div>
		</div>
	);
};

export default Game;
