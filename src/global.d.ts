
type Pos = {
  top: number;
  left: number;
};

enum MagneticGridType {
  magnetic = "magnetic",
  onlyOne = "onlyOne"
};

type MagneticGridElement = {
  pos?: Pos;
  mode?: string;
  type: Array<string>;
  forAvailableObjectsType: Array<string>;
  gridInfo?: {
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
