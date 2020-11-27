import React from 'react';
import './RoomControls.css';
import STATUS from '../utils/status';

type Props = {
  toggleVideo: () => void;
  toggleAudio: () => void;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  handleHangup: () => void;
  status: string;
};

const RoomControls = ({
  toggleVideo,
  toggleAudio,
  isAudioEnabled,
  isVideoEnabled,
  handleHangup,
  status,
}: Props) => (
  <div className="RoomControls">
    <button onClick={toggleAudio} className="RoomControls__control" type="button">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className="svg">
        {!isAudioEnabled && (
          <path
            className="on"
            d="M38 22h-3.4c0 1.49-.31 2.87-.87 4.1l2.46 2.46C37.33 26.61 38 24.38 38 22zm-8.03.33c0-.11.03-.22.03-.33V10c0-3.32-2.69-6-6-6s-6 2.68-6 6v.37l11.97 11.96zM8.55 6L6 8.55l12.02 12.02v1.44c0 3.31 2.67 6 5.98 6 .45 0 .88-.06 1.3-.15l3.32 3.32c-1.43.66-3 1.03-4.62 1.03-5.52 0-10.6-4.2-10.6-10.2H10c0 6.83 5.44 12.47 12 13.44V42h4v-6.56c1.81-.27 3.53-.9 5.08-1.81L39.45 42 42 39.46 8.55 6z"
            fill="white"
          />
        )}
        {isAudioEnabled && (
          <path
            className="off"
            d="M24 28c3.31 0 5.98-2.69 5.98-6L30 10c0-3.32-2.68-6-6-6-3.31 0-6 2.68-6 6v12c0 3.31 2.69 6 6 6zm10.6-6c0 6-5.07 10.2-10.6 10.2-5.52 0-10.6-4.2-10.6-10.2H10c0 6.83 5.44 12.47 12 13.44V42h4v-6.56c6.56-.97 12-6.61 12-13.44h-3.4z"
            fill="white"
          />
        )}
      </svg>
    </button>
    <button onClick={toggleVideo} className="RoomControls__control" type="button">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className="svg">
        {!isVideoEnabled && (
          <path
            className="on"
            d="M40 8H15.64l8 8H28v4.36l1.13 1.13L36 16v12.36l7.97 7.97L44 36V12c0-2.21-1.79-4-4-4zM4.55 2L2 4.55l4.01 4.01C4.81 9.24 4 10.52 4 12v24c0 2.21 1.79 4 4 4h29.45l4 4L44 41.46 4.55 2zM12 16h1.45L28 30.55V32H12V16z"
            fill="white"
          />
        )}
        {isVideoEnabled && (
          <path
            className="off"
            d="M40 8H8c-2.21 0-4 1.79-4 4v24c0 2.21 1.79 4 4 4h32c2.21 0 4-1.79 4-4V12c0-2.21-1.79-4-4-4zm-4 24l-8-6.4V32H12V16h16v6.4l8-6.4v16z"
            fill="white"
          />
        )}
      </svg>
    </button>
    {status === STATUS.ESTABLISHED && (
      <button onClick={handleHangup} className="RoomControls__control" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className="svg">
          <path
            d="M24 18c-3.21 0-6.3.5-9.2 1.44v6.21c0 .79-.46 1.47-1.12 1.8-1.95.98-3.74 2.23-5.33 3.7-.36.35-.85.57-1.4.57-.55 0-1.05-.22-1.41-.59L.59 26.18c-.37-.37-.59-.87-.59-1.42 0-.55.22-1.05.59-1.42C6.68 17.55 14.93 14 24 14s17.32 3.55 23.41 9.34c.37.36.59.87.59 1.42 0 .55-.22 1.05-.59 1.41l-4.95 4.95c-.36.36-.86.59-1.41.59-.54 0-1.04-.22-1.4-.57-1.59-1.47-3.38-2.72-5.33-3.7-.66-.33-1.12-1.01-1.12-1.8v-6.21C30.3 18.5 27.21 18 24 18z"
            fill="white"
          />
        </svg>
      </button>
    )}
  </div>
);

export default RoomControls;
