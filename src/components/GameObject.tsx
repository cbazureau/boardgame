import React, { useRef } from 'react';
import useDraggable from '../utils/useDraggable';

import './GameObject.css';

type Props = {
  obj: GameObject;
  def: GameObjectDef;
  onChange: (currentObjectId: number, pos: Pos) => void;
};

const GameObject = ({ def, obj, onChange }: Props): JSX.Element => {
  const objRef = useRef<HTMLDivElement>(null);
  const { dragPosition, isDragging } = useDraggable({
    target: def.canMove ? objRef.current : undefined,
    currentPosition: obj.pos,
    onPositionChange: (pos: Pos) => onChange(obj.id, pos),
  });
  const top = dragPosition.top - def.size.height / 2;
  const left = dragPosition.left - def.size.width / 2;
  let cursor = 'auto';
  if (def.canMove) cursor = isDragging ? 'grab' : 'pointer';
  const styles = {
    backgroundColor: isDragging ? 'red' : 'transparent',
    cursor,
    top: `${top}px`,
    left: `${left}px`,
    width: `${def.size.width}px`,
    height: `${def.size.height}px`,
    backgroundImage: `url("${def.sprite ? def.sprite.src : def.src}")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: def.inSpritePosition
      ? `-${def.inSpritePosition.left}px -${def.inSpritePosition.top}px`
      : '0 0',
    backgroundSize: def.sprite
      ? `${Math.round((def.sprite.size.width / def.size.width) * 100)}%`
      : '100%',
  };
  return <div ref={objRef} className="GameObject" style={styles} />;
};

export default GameObject;
