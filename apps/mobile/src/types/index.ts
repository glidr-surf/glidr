export type BoardType = 'FISH' | 'LOG' | 'MID' | 'SHORT' | 'EGG' | 'ALT' | 'GUN';

export type VibeTag =
  | 'KOOK CANNON'
  | 'HIPSTER SLED'
  | 'CORE LORD STICK'
  | "SOUL SURFER'S ENLIGHTENMENT"
  | 'THE MIDLIFE GLIDE';

export type WaveSize = 'ANKLE BITERS' | 'WAIST-CHEST' | 'HEAD HIGH' | 'OVERHEAD' | 'DOUBLE OVERHEAD' | 'THE EDDIE';
export type WaveQuality = 'TUESDAY SLOP' | 'AVERAGE DAY' | 'FUN ONES' | 'PROPER WAVES' | 'GREEN ROOMS';
export type QuiverRole = 'DAILY DRIVER' | 'GROVELLER' | "WHEN IT'S PUMPING" | 'TRAVEL STICK' | 'FROTH MACHINE' | 'GARAGE ART';
export type FinSetup = 'SINGLE' | 'TWIN' | 'TRI' | 'QUAD' | '2+1' | 'FINLESS';

export interface Board {
  id: string;
  name: string;
  shaper: string;
  shaperId: string;
  type: BoardType;
  image?: string;
  rating: number;
  opinionCount: number;
  buyAgainPercent: number;
  topVibeTag?: VibeTag;
  verdict?: string;
}

export interface Opinion {
  id: string;
  boardId: string;
  userId: string;
  username: string;
  userHeight?: string;
  userWeight?: string;
  rating: number;
  vibeTag?: VibeTag;
  buyAgain: boolean;
  text?: string;
  speed?: number;
  manoeuvrability?: number;
  paddlePower?: number;
  waveSizes?: WaveSize[];
  waveQualities?: WaveQuality[];
  quiverRole?: QuiverRole;
  finSetup?: FinSetup;
  upvotes: number;
  downvotes: number;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  joinDate: string;
  height?: string;
  weight?: string;
  boardCount: number;
  magicBoardCount: number;
  badgeCount: number;
  followersCount: number;
  followingCount: number;
}

export interface Shaper {
  id: string;
  name: string;
  location?: string;
  bio?: string;
  boardCount: number;
  avgRating: number;
  opinionCount: number;
  topVibeTag?: VibeTag;
}

export type BadgeId =
  | 'kooks-getting-started'
  | 'wannabe-corelord'
  | 'flogged-it'
  | 'wordsmith'
  | 'board-collector'
  | 'quiver-completionist'
  | 'serial-enabler'
  | 'hot-take-merchant';

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  howToEarn: string;
  icon: string;
  earned: boolean;
  progress?: number;
  target?: number;
}
