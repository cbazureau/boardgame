
type Pos = {
  top: number;
  left: number;
};

type MagneticGridElement = {
  pos?: Pos;
  type: string;
  forAvailableObjectsType: Array<string>;
  autoInfo?: {
    left: number;
    top: number;
    intervalX: number;
    intervalY: number;
    nbX: number;
    nbY: number;
  };
};

type GameObjectDef = any;
type GameObject = {
  id: number;
  type: string;
  pos: Pos;
};
type GameObjectWithDef = any;

type Game = {
  name: string;
  size: {
    width: number;
    height: number;
  };
  magneticGrid?: Array<MagneticGridElement>;
  playerRequired?: {
    min: number;
    max: number;
  }
  sprites?: Array<any>;
  availableObjects: Array<GameObjectDef>;
  objects: Array<GameObject>;
};

type GameUpdate = {
  objects: Array<GameObject>;
}

type Room = string;


type RTCstore = {
  game: Game;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  rooms: Array<Room>;
};

type Store = {
  rtc: RTCstore;
};
