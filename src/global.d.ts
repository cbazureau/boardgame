type Game = any;
type Room = string;

type Pos = {
  top: number;
  left: number;
};

type RTCstore = {
  game: Game;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  rooms: Array<Room>;
};

type Store = {
  rtc: RTCstore;
};

type GameObjectDef = any;
type GameObject = any;
type GameObjectWithDef = any;
