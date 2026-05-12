import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockBoards } from '../src/data/mock';
import { colors } from '../src/theme/colors';
import { RatingStep } from '../src/components/rate/RatingStep';
import { VibeCheckStep } from '../src/components/rate/VibeCheckStep';
import { BuyAgainStep } from '../src/components/rate/BuyAgainStep';
import { ConfirmationStep } from '../src/components/rate/ConfirmationStep';
import { RideStep } from '../src/components/rate/RideStep';
import { ConditionsStep } from '../src/components/rate/ConditionsStep';
import { NittyGrittyStep } from '../src/components/rate/NittyGrittyStep';
import { FreeTextStep } from '../src/components/rate/FreeTextStep';
import { createInitialState } from '../src/components/rate/types';
import type { RateFlowState, RateFlowStep } from '../src/components/rate/types';

const STEP_ORDER: RateFlowStep[] = [
  'rating',
  'vibe-check',
  'buy-again',
  'confirmation',
  'ride',
  'conditions',
  'nitty-gritty',
  'free-text',
  'done',
];

export default function RateFlowScreen() {
  const router = useRouter();
  const { boardId } = useLocalSearchParams<{ boardId: string; opinionId?: string }>();

  const board = mockBoards.find((b) => b.id === boardId) ?? mockBoards[0];

  const [state, setState] = useState<RateFlowState>(() => createInitialState(board.id));

  const onUpdate = (updates: Partial<RateFlowState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const onNext = () => {
    const currentIndex = STEP_ORDER.indexOf(state.step);
    const nextStep = STEP_ORDER[currentIndex + 1];
    if (nextStep === 'done') {
      router.back();
    } else if (nextStep) {
      setState((prev) => ({ ...prev, step: nextStep }));
    }
  };

  const onFinish = () => {
    router.back();
  };

  const onDeepDive = () => {
    setState((prev) => ({ ...prev, step: 'ride' }));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {state.step === 'rating' && (
          <RatingStep
            state={state}
            onUpdate={onUpdate}
            onNext={onNext}
            board={board}
          />
        )}
        {state.step === 'vibe-check' && (
          <VibeCheckStep
            state={state}
            onUpdate={onUpdate}
            onNext={onNext}
          />
        )}
        {state.step === 'buy-again' && (
          <BuyAgainStep
            state={state}
            onUpdate={onUpdate}
            onNext={onNext}
            board={board}
          />
        )}
        {state.step === 'confirmation' && (
          <ConfirmationStep
            state={state}
            onDeepDive={onDeepDive}
            onFinish={onFinish}
          />
        )}
        {state.step === 'ride' && (
          <RideStep
            state={state}
            onUpdate={onUpdate}
            onNext={onNext}
            onSkip={onNext}
          />
        )}
        {state.step === 'conditions' && (
          <ConditionsStep
            state={state}
            onUpdate={onUpdate}
            onNext={onNext}
            onSkip={onNext}
          />
        )}
        {state.step === 'nitty-gritty' && (
          <NittyGrittyStep
            state={state}
            onUpdate={onUpdate}
            onNext={onNext}
            onSkip={onNext}
          />
        )}
        {state.step === 'free-text' && (
          <FreeTextStep
            state={state}
            onUpdate={onUpdate}
            onNext={onNext}
            onSkip={onNext}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
  },
});
