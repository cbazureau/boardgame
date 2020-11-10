import React, { useState } from 'react';
import './Game.css';

const GameObject = ({ def, obj, isSelected, onSelect }) => {
	const [ isHovered, setHovered ] = useState(false);
	const styles = {
		backgroundColor: isSelected ? 'red' : isHovered ? 'green' : 'transparent',
		position: 'absolute',
		top: `${obj.pos.top - def.size.height / 2}px`,
		left: `${obj.pos.left - def.size.width / 2}px`,
		width: `${def.size.width}px`,
		height: `${def.size.height}px`,
		background: `url("${def.sprite ? def.sprite.src : def.src}") 0 0 no-repeat`,
		backgroundPosition: def.sprite ? `-${def.inSpritePosition.left}px -${def.inSpritePosition.top}px` : undefined,
		backgroundSize: def.sprite ? `${Math.round(def.sprite.size.width / def.size.width * 100)}%` : '100%'
	};
	return (
		<div
			className="GameObject"
			style={styles}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			onClick={() => onSelect(isSelected || !def.canMove ? undefined : obj.id)}
		/>
	);
};

export default GameObject;
