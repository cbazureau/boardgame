/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import UserIcon from './Icons/UserIcon';

import './Users.css';
import { start } from '../utils/rtcStream';

type Props = {
  users: Array<User>;
  currentUser?: User;
  className?: string;
  socket: any;
};

type VideoRefs = {
  [key: string]: HTMLVideoElement;
};

/**
 * Users
 */
const Users = ({ users, currentUser, className, socket }: Props): JSX.Element => {
  const videoRefs = useRef<VideoRefs>({});
  useEffect(() => {
    if (currentUser) start({ videoRefs: videoRefs.current, currentUser, socket });
  }, [currentUser, socket]);
  return (
    <div className={classnames('Users', className)}>
      {users.map(user => {
        const isMe = !!(currentUser && currentUser.id === user.id);
        return (
          <div
            className={classnames('Users__user', {
              'is-me': isMe,
            })}
            key={user.id}
          >
            <div className="Users__icon" title={user.id}>
              <UserIcon />
              <video
                className="User__video"
                ref={r => {
                  if (r) videoRefs.current[user.id] = r;
                }}
                autoPlay
                muted={isMe}
              />
            </div>
            <span>{user.serverStatus}</span>
            <span>{user.username || '....'}</span>
          </div>
        );
      })}
    </div>
  );
};

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
