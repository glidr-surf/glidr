// --- Value types (union string literals) ---

export type BoardType = 'FISH' | 'LOG' | 'MID' | 'SHORT' | 'EGG' | 'ALT' | 'GUN';

export type VibeTag =
  | 'KOOK CANNON'
  | 'HIPSTER SLED'
  | 'CORE LORD STICK'
  | "SOUL SURFER'S ENLIGHTENMENT"
  | 'THE MIDLIFE GLIDE';

export type WaveSize =
  | 'ANKLE BITERS'
  | 'WAIST-CHEST'
  | 'HEAD HIGH'
  | 'OVERHEAD'
  | 'DOUBLE OVERHEAD'
  | 'THE EDDIE';

export type WaveQuality =
  | 'TUESDAY SLOP'
  | 'AVERAGE DAY'
  | 'FUN ONES'
  | 'PROPER WAVES'
  | 'GREEN ROOMS';

export type QuiverRole =
  | 'DAILY DRIVER'
  | 'GROVELLER'
  | "WHEN IT'S PUMPING"
  | 'TRAVEL STICK'
  | 'FROTH MACHINE'
  | 'GARAGE ART';

export type FinSetup = 'SINGLE' | 'TWIN' | 'TRI' | 'QUAD' | '2+1' | 'FINLESS';

export type SubmissionStatus = 'approved' | 'pending' | 'rejected';

// --- DB row types (mirror Postgres columns, snake_case) ---

export interface DbShaper {
  id: string;
  name: string;
  location: string | null;
  bio: string | null;
  status: SubmissionStatus;
  submitted_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbBoard {
  id: string;
  name: string;
  shaper_id: string;
  type: string;
  image_url: string | null;
  length: string | null;
  width: string | null;
  thickness: string | null;
  volume: string | null;
  status: SubmissionStatus;
  submitted_by: string | null;
  verdict: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbProfile {
  id: string;
  username: string;
  height: string | null;
  weight: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbOpinion {
  id: string;
  board_id: string;
  user_id: string;
  text: string | null;
  wallet_signature: string | null;
  created_at: string;
}

export interface DbOpinionScore {
  opinion_id: string;
  criterion: string;
  value: number;
}

export interface DbOpinionTag {
  opinion_id: string;
  tag_type: string;
  value: string;
}

export interface DbOpinionVote {
  id: string;
  opinion_id: string;
  user_id: string;
  vote: number;
  created_at: string;
}

export interface DbFollow {
  follower_id: string;
  following_id: string;
  created_at: string;
}

// --- View types ---

export interface DbBoardStats {
  board_id: string;
  avg_rating: number | null;
  opinion_count: number;
  buy_again_percent: number | null;
  top_vibe_tag: string | null;
}

export interface DbShaperStats {
  shaper_id: string;
  board_count: number;
  avg_rating: number | null;
  opinion_count: number;
  top_vibe_tag: string | null;
}

export interface DbProfileStats {
  user_id: string;
  opinion_count: number;
  magic_board_count: number;
  followers_count: number;
  following_count: number;
}

export interface DbOpinionVoteCounts {
  opinion_id: string;
  upvotes: number;
  downvotes: number;
}

// --- Domain types (what consumers see, camelCase, flat) ---

export interface Board {
  id: string;
  name: string;
  shaper: string;
  shaperId: string;
  type: BoardType;
  imageUrl?: string;
  length?: string;
  width?: string;
  thickness?: string;
  volume?: string;
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
  text?: string;
  scores: Record<string, number>;
  tags: Record<string, string[]>;
  upvotes: number;
  downvotes: number;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  height?: string;
  weight?: string;
  createdAt: string;
  opinionCount: number;
  magicBoardCount: number;
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

// --- Input types (for submitting data) ---

export interface SubmitOpinionInput {
  boardId: string;
  text?: string;
  scores: Record<string, number>;
  tags: Record<string, string[]>;
  walletSignature?: string;
}

export interface SubmitBoardInput {
  name: string;
  shaperId: string;
  type: BoardType;
  length?: string;
  width?: string;
  thickness?: string;
  volume?: string;
}

export interface SubmitShaperInput {
  name: string;
  location?: string;
  bio?: string;
}
