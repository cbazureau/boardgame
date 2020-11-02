import React, { useEffect, useMemo, useState } from 'react';
import './Game.css';
import game from '../game/chess'
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

const Game = () => {
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

  const objects = useMemo(() => {
    if(!imageLoaded) return [];
    return game.objects.map(
      obj => ({
        def: game.availableObjects.find((o) => o.id === obj.type),
        obj,
      })
    );

  }, [imageLoaded]);

  const gameLimits = {
    width: `${game.size.width}px`, height: `${game.size.height}px`
  }

	return (
		<div className="Game">
      <div className="Game__limits" style={gameLimits}>
        {objects.map(o => <GameObject key={o.obj.id} def={o.def} obj={o.obj} />)}
      </div>
		</div>
	);
};

export default Game;
