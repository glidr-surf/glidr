export type BoardType = 'FISH' | 'LOG' | 'MID' | 'SHORT' | 'ALT';

export interface Board {
  rating: number;
  type: BoardType;
  name: string;
  shaper: string;
  review: string;
  user: string;
  image: string;
}

export interface Stat {
  value: string;
  label: string;
  sublabel?: string;
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
    type: 'MID',
    name: 'FLAT TRACKER 6\'8"',
    shaper: 'Christenson',
    review: '"Genuinely upset at how good this is. Was meant to be the wife\'s board."',
    user: 'SoggyWetsuit42',
    image: 'https://cdn.shopify.com/s/files/1/2062/5873/files/18_C_FlatTracker_210_631.jpg?4292194101869748872',
  },
  {
    rating: 4.9,
    type: 'LOG',
    name: 'ELEVATOR 9\'6"',
    shaper: 'Bing Surfboards',
    review: '"Caught more waves before 8am than my mate catches all year on his step-up."',
    user: 'KookOfThePier',
    image: 'https://i0.wp.com/www.surfboardfactoryhawaii.com/wp-content/uploads/2025/05/Bing-Elevator.webp?fit=780%2C1024&ssl=1',
  },
  {
    rating: 4.8,
    type: 'MID',
    name: 'HYPTO KRYPTO 6\'6"',
    shaper: 'Hayden Shapes',
    review: '"Told myself I\'d never be a Hypto bloke. I am now a Hypto bloke."',
    user: 'TwoWetsuitWinter',
    image: 'https://www.haydenshapes.com/cdn/shop/files/1_ef3e9bca-31f4-4e98-ae5c-b5c119d4ee84_640x.jpg?v=1755747275',
  },
  {
    rating: 3.5,
    type: 'SHORT',
    name: 'OG FLYER 5\'11"',
    shaper: 'Channel Islands',
    review: '"Absolutely rapid on a chest-high wall. Anything bigger and I\'m just holding on for dear life."',
    user: 'FinBoxPhilosopher',
    image: 'https://cisurfboards.com/cdn/shop/products/OG-Flyer-Deck-for-Web.png?v=1619470436',
  },
];

export const stats: Stat[] = [
  { value: '93', label: 'BOARD OPINIONS', color: 'red' },
  { value: '9', label: 'SHAPERS REVIEWED', color: 'yellow' },
  { value: '8', label: 'MAGIC BOARDS', color: 'blue' },
];
