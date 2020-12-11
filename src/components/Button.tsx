import React, { MouseEvent } from 'react';

import './Button.css';

type Props = {
  onClick?: (e: MouseEvent) => void;
  children: JSX.Element | string;
};

/**
 * Button
 */
const Button = ({ onClick, children }: Props): JSX.Element => (
  <button type="button" className="Button" onClick={onClick}>
    {children}
  </button>
);

Button.defaultProps = {
  onClick: undefined,
};
export default Button;
