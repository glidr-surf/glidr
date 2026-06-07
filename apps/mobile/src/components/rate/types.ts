import type { VibeTag, WaveSize, WaveQuality, QuiverRole, FinSetup } from '../../types';

export type RateFlowStep =
  | 'rating'
  | 'vibe-check'
  | 'buy-again'
  | 'confirmation'
  | 'ride'
  | 'conditions'
  | 'nitty-gritty'
  | 'dimensions'
  | 'free-text'
  | 'done';

export interface RateFlowState {
  boardId: string;
  step: RateFlowStep;
  rating: number;
  vibeTag?: VibeTag;
  buyAgain?: boolean;
  speed?: number;
  manoeuvrability?: number;
  paddlePower?: number;
  waveSizes: WaveSize[];
  waveQualities: WaveQuality[];
  quiverRole?: QuiverRole;
  finSetup: FinSetup[];
  boardLength?: string;
  boardWidth?: string;
  boardThickness?: string;
  boardVolume?: number;
  text?: string;
}

export function createInitialState(boardId: string): RateFlowState {
  return {
    boardId,
    step: 'rating',
    rating: 0,
    waveSizes: [],
    waveQualities: [],
    finSetup: [],
  };
}

export interface StepProps {
  state: RateFlowState;
  onUpdate: (updates: Partial<RateFlowState>) => void;
  onNext: () => void;
  onSkip?: () => void;
  onBack?: () => void;
  stepLabel?: string;
}
