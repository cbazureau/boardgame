/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import UserIcon from './Icons/UserIcon';

import './Users.css';
import { start } from '../utils/rtcStream';

type Props = {
  users: Array<User>;
  currentUser?: User;
  className?: string;
  socket?: any;
  isInLobby?: boolean;
};

type VideoRefs = {
  [key: string]: HTMLVideoElement;
};

/**
 * Users
 */
const Users = ({ users, currentUser, className, socket, isInLobby }: Props): JSX.Element => {
  const videoRefs = useRef<VideoRefs>({});
  const startDone = useRef<boolean>(false);
  const [isRTCActive, setRTCActive] = useState<boolean>(false);
  useEffect(() => {
    if (currentUser && !isInLobby && !startDone.current && isRTCActive) {
      start({ videoRefs: videoRefs.current, currentUser, socket });
      startDone.current = true;
    }
  }, [currentUser, socket, isInLobby, isRTCActive]);
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
            <div
              className="Users__icon"
              title={user.id}
              onClick={() => setRTCActive(true)}
              role="button"
            >
              <UserIcon />
              {!isInLobby && (
                <video
                  className="User__video"
                  ref={r => {
                    if (r) videoRefs.current[user.id] = r;
                  }}
                  autoPlay
                  muted={isMe}
                />
              )}
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
  isInLobby: false,
  socket: undefined,
};

const mapStateToProps = ({
  rtc: { currentUser, users },
}: Store): { users: Array<User>; currentUser?: User } => ({
  currentUser,
  users,
});
export default connect(mapStateToProps)(Users);
