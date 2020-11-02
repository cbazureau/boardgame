import React from 'react';
import './Game.css';

const GameObject = ({ def, obj }) => {
  const styles = {
    position: 'absolute',
    top: `${obj.pos.top}px`,
    left: `${obj.pos.left}px`,
    width: `${def.size.width}px`,
    height: `${def.size.height}px`,
    background: `url("${def.src}") 0 0 no-repeat`,
    'background-position': def.isSpriteSheet ? `-${def.inSpritePosition.left}px -${def.inSpritePosition.top}px` : undefined,
    'background-size': def.isSpriteSheet ? `${Math.round(def.spriteTotalSize.width/def.size.width*100)}%`: '100%',
  }
  return <div className="GameObject" style={styles} />
};

export default GameObject;
