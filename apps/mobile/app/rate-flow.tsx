import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getBoard, submitOpinion } from '@glidr/data';
import type { Board } from '@glidr/data';
import { supabase } from '../src/lib/supabase';
import { useAuth } from '../src/context/AuthContext';
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
  const { user } = useAuth();
  const [board, setBoard] = useState<Board | null>(null);

  useEffect(() => {
    if (!boardId) return;
    getBoard(supabase, boardId).then((b) => { if (b) setBoard(b); });
  }, [boardId]);

  const [state, setState] = useState<RateFlowState>(() => createInitialState(boardId ?? ''));

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

  const submittingRef = useRef(false);
  const onFinish = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    try {
      if (user) {
        await submitOpinion(supabase, user.id, {
        boardId: state.boardId,
        text: state.text,
        scores: {
          overall_rating: state.rating,
          buy_again: state.buyAgain ? 1 : 0,
          ...(state.speed != null ? { speed: state.speed } : {}),
          ...(state.manoeuvrability != null ? { manoeuvrability: state.manoeuvrability } : {}),
          ...(state.paddlePower != null ? { paddle_power: state.paddlePower } : {}),
        },
        tags: {
          ...(state.vibeTag ? { vibe_tag: [state.vibeTag] } : {}),
          ...(state.waveSizes.length > 0 ? { wave_size: state.waveSizes } : {}),
          ...(state.waveQualities.length > 0 ? { wave_quality: state.waveQualities } : {}),
          ...(state.quiverRole ? { quiver_role: [state.quiverRole] } : {}),
          ...(state.finSetup.length > 0 ? { fin_setup: state.finSetup } : {}),
          ...(state.boardLength ? { board_length: [state.boardLength] } : {}),
        },
        });
      }
      router.back();
    } catch {
      submittingRef.current = false;
      Alert.alert("Couldn't post that opinion", 'Try again in a sec.');
    }
  };

  const onDeepDive = () => {
    setState((prev) => ({ ...prev, step: 'ride' }));
  };

  if (!board) return null;

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
