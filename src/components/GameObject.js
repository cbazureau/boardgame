import React, { useRef } from 'react';
import useDraggable from '../utils/useDraggable';

import './GameObject.css';

const GameObject = ({ def, obj, onChange }) => {
	const objRef = useRef();
	const position = useDraggable({
		target: def.canMove ? objRef.current : undefined,
		currentPosition: obj.pos,
		onPositionChange: (pos) => onChange(obj.id, pos)
	});
	const top = position.top - def.size.height / 2;
	const left = position.left - def.size.width / 2;
	const styles = {
		cursor: def.canMove ? 'grab' : 'auto',
		top: `${top}px`,
		left: `${left}px`,
		width: `${def.size.width}px`,
		height: `${def.size.height}px`,
		background: `url("${def.sprite ? def.sprite.src : def.src}") 0 0 no-repeat`,
		backgroundPosition: def.sprite ? `-${def.inSpritePosition.left}px -${def.inSpritePosition.top}px` : undefined,
		backgroundSize: def.sprite ? `${Math.round(def.sprite.size.width / def.size.width * 100)}%` : '100%'
	};
	return <div ref={objRef} className="GameObject" style={styles} />;
};

export default GameObject;
