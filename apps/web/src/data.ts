export type BoardType = 'FISH' | 'LOG' | 'MID' | 'SHORT' | 'ALT';

export interface Board {
  rating: number;
  type: BoardType;
  name: string;
  shaper: string;
  review: string;
  user: string;
  buyAgain: boolean;
}

export interface Stat {
  value: string;
  label: string;
  color: 'red' | 'yellow' | 'blue';
}

export const boardTypeColor: Record<BoardType, string> = {
  FISH: 'text-red',
  SHORT: 'text-red',
  LOG: 'text-yellow',
  MID: 'text-blue',
  ALT: 'text-green',
};

export const boards: Board[] = [
  {
    rating: 4.2,
    type: 'FISH',
    name: 'FLAT TRACKER 5\'6"',
    shaper: 'Christenson',
    review: '"It does fish things. Surprisingly well under head high."',
    user: 'Jamie R.',
    buyAgain: true,
  },
  {
    rating: 4.9,
    type: 'LOG',
    name: 'ELEVATOR 9\'6"',
    shaper: 'Bing Surfboards',
    review: '"My shortboard mates don\'t talk to me anymore."',
    user: 'Hannah K.',
    buyAgain: true,
  },
  {
    rating: 4.8,
    type: 'MID',
    name: 'HYPTO KRYPTO 6\'6"',
    shaper: 'Hayden Shapes',
    review: '"At this point it\'s a personality trait."',
    user: 'Marcus T.',
    buyAgain: true,
  },
  {
    rating: 3.5,
    type: 'SHORT',
    name: 'OG FLYER 5\'11"',
    shaper: 'Channel Islands',
    review: '"Felt like Kelly Slater for 11 seconds. Then it got overhead."',
    user: 'Alex D.',
    buyAgain: false,
  },
];

export const stats: Stat[] = [
  { value: '2,847', label: 'BOARDS', color: 'red' },
  { value: '412', label: 'SHAPERS', color: 'yellow' },
  { value: '0', label: 'MAGIC', color: 'blue' },
];
