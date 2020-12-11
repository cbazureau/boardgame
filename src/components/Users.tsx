import React, { MouseEvent } from 'react';
import UserIcon from './Icons/UserIcon';

import './Users.css';

type Props = {
  users: Array<User>;
};

/**
 * Users
 */
const Users = ({ users }: Props): JSX.Element => (
  <div className="Users">
    {users.map(user => (
      <div className="Users__user">
        <UserIcon />
        <span>{user.serverStatus}</span>
        <span>{user.username || '...'}</span>
        <span>{user.id}</span>
      </div>
    ))}
  </div>
);

export default Users;
