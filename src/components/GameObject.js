import React, { useState } from "react";
import "./Game.css";

const GameObject = ({ def, obj }) => {
  const [isHovered, setHovered] = useState(false);
  const styles = {
    'background-color': isHovered ? "red" : "transparent",
    position: "absolute",
    top: `${obj.pos.top}px`,
    left: `${obj.pos.left}px`,
    width: `${def.size.width}px`,
    height: `${def.size.height}px`,
    background: `url("${def.sprite ? def.sprite.src : def.src}") 0 0 no-repeat`,
    "background-position": def.sprite
      ? `-${def.inSpritePosition.left}px -${def.inSpritePosition.top}px`
      : undefined,
    "background-size": def.sprite
      ? `${Math.round((def.sprite.size.width / def.size.width) * 100)}%`
      : "100%",
  };
  return (
    <div
      className="GameObject"
      style={styles}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    />
  );
};

export default GameObject;
