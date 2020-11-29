type Pos = {
  top: number;
  left: number;
};

type User = {
  id: string;
  isHost?: boolean;
  status: string;
};

type Size = {
  width: number;
  height: number;
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

type Sprite = {
  id: string;
  src: string;
  size: Size;
};

type GameObjectDef = {
  id: string;
  type: string;
  canMove?: boolean;
  spriteId?: string;
  inSpritePosition?: Pos;
  src?: string;
  sprite?: Sprite;
  size: Size;
};

type GameObject = {
  id: string;
  type: string;
  pos: Pos;
};

type RawGameObject = {
  type: string;
  pos: Pos;
};

type GameObjectWithDef = {
  obj: GameObject;
  def: GameObjectDef;
  index: number;
};

type Game = {
  name: string;
  size: {
    width: number;
    height: number;
  };
  magneticGrid?: Array<MagneticGridElement>;
  players?: {
    nbSlot: number;
  };
  sprites?: Array<Sprite>;
  availableObjects: Array<GameObjectDef>;
  objects: Array<GameObject>;
};

type RawGame = {
  name: string;
  size: {
    width: number;
    height: number;
  };
  magneticGrid?: Array<MagneticGridElement>;
  players?: {
    nbSlot: number;
  };
  sprites?: Array<Sprite>;
  availableObjects: Array<GameObjectDef>;
  objects: Array<RawGameObject>;
};

type GameUpdate = {
  objects: Array<GameObject>;
};

type Room = string;

type RTCstore = {
  game?: Game;
  users: Array<User>;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  rooms: Array<Room>;
};

type Store = {
  rtc: RTCstore;
};

type MoveArgs = {
  game: Game;
  currentObject: GameObjectWithDef;
  pos: Pos;
};
