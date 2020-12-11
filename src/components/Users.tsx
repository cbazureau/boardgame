import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import UserIcon from './Icons/UserIcon';

import './Users.css';

type Props = {
  users: Array<User>;
  currentUser?: User;
  className?: string;
};

/**
 * Users
 */
const Users = ({ users, currentUser, className }: Props): JSX.Element => (
  <div className={classnames('Users', className)}>
    {users.map(user => (
      <div
        className={classnames('Users__user', {
          'is-me': currentUser && currentUser.id === user.id,
        })}
        key={user.id}
      >
        <div className="Users__icon" title={user.id}>
          <UserIcon />
        </div>
        <span>{user.serverStatus}</span>
        <span>{user.username || '....'}</span>
      </div>
    ))}
  </div>
);

Users.defaultProps = {
  className: undefined,
  currentUser: undefined,
};

const mapStateToProps = ({
  rtc: { currentUser, users },
}: Store): { users: Array<User>; currentUser?: User } => ({
  currentUser,
  users,
});
export default connect(mapStateToProps)(Users);
