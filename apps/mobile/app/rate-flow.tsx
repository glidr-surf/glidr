import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { getBoard, submitOpinion } from '@glidr/data';
import type { Board } from '@glidr/data';
import { supabase } from '../src/lib/supabase';
import { useAuth } from '../src/context/AuthContext';
import { navBack } from '../src/utils/navBack';
import { markDirty, boardKey, PROFILE_KEY } from '../src/lib/refreshBus';
import { colors } from '../src/theme/colors';
import { RatingStep } from '../src/components/rate/RatingStep';
import { VibeCheckStep } from '../src/components/rate/VibeCheckStep';
import { BuyAgainStep } from '../src/components/rate/BuyAgainStep';
import { ConfirmationStep } from '../src/components/rate/ConfirmationStep';
import { RideStep } from '../src/components/rate/RideStep';
import { ConditionsStep } from '../src/components/rate/ConditionsStep';
import { NittyGrittyStep } from '../src/components/rate/NittyGrittyStep';
import { DimensionsStep } from '../src/components/rate/DimensionsStep';
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
  'dimensions',
  'free-text',
  'done',
];

// Optional deep-dive branch (after confirmation) — used to label/number its steps.
const DEEP_DIVE: RateFlowStep[] = ['ride', 'conditions', 'nitty-gritty', 'dimensions', 'free-text'];

export default function RateFlowScreen() {
  const router = useRouter();
  const { boardId } = useLocalSearchParams<{ boardId: string; opinionId?: string }>();
  const { user } = useAuth();
  const [board, setBoard] = useState<Board | null>(null);
  const [deepDiveDone, setDeepDiveDone] = useState(false);

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
      navBack(router);
    } else if (nextStep) {
      setState((prev) => ({ ...prev, step: nextStep }));
    }
  };

  const onBack = () => {
    const i = STEP_ORDER.indexOf(state.step);
    if (i <= 0) { navBack(router); return; }
    setState((prev) => ({ ...prev, step: STEP_ORDER[i - 1] }));
  };

  const deepLabel = (() => {
    const i = DEEP_DIVE.indexOf(state.step);
    return i >= 0 ? `DEEP DIVE · ${i + 1} OF ${DEEP_DIVE.length}` : undefined;
  })();

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
          ...(state.quiverRoles.length > 0 ? { quiver_role: state.quiverRoles } : {}),
          ...(state.finSetup.length > 0 ? { fin_setup: state.finSetup } : {}),
          ...(state.boardLength ? { board_length: [state.boardLength] } : {}),
          ...(state.boardWidth ? { board_width: [state.boardWidth] } : {}),
          ...(state.boardThickness ? { board_thickness: [state.boardThickness] } : {}),
          ...(state.boardVolume != null ? { board_volume: [`${state.boardVolume}L`] } : {}),
        },
        });
        markDirty(boardKey(state.boardId), PROFILE_KEY);
      }
      navBack(router);
    } catch {
      submittingRef.current = false;
      Alert.alert("Couldn't post that opinion", 'Try again in a sec.');
    }
  };

  const onDeepDive = () => {
    setState((prev) => ({ ...prev, step: 'ride' }));
  };

  // end of the deep dive -> back to the confirmation/success screen (which submits)
  const finishDeepDive = () => {
    setDeepDiveDone(true);
    setState((prev) => ({ ...prev, step: 'confirmation' }));
  };

  if (!board) return null;

  return (
    <SafeAreaProvider>
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
            onBack={onBack}
          />
        )}
        {state.step === 'buy-again' && (
          <BuyAgainStep
            state={state}
            onUpdate={onUpdate}
            onNext={onNext}
            onBack={onBack}
            board={board}
          />
        )}
        {state.step === 'confirmation' && (
          <ConfirmationStep
            state={state}
            onDeepDive={onDeepDive}
            onFinish={onFinish}
            deepDiveDone={deepDiveDone}
          />
        )}
        {state.step === 'ride' && (
          <RideStep
            state={state}
            onUpdate={onUpdate}
            onNext={onNext}
            onSkip={onNext}
            onBack={onBack}
            stepLabel={deepLabel}
          />
        )}
        {state.step === 'conditions' && (
          <ConditionsStep
            state={state}
            onUpdate={onUpdate}
            onNext={onNext}
            onSkip={onNext}
            onBack={onBack}
            stepLabel={deepLabel}
          />
        )}
        {state.step === 'nitty-gritty' && (
          <NittyGrittyStep
            state={state}
            onUpdate={onUpdate}
            onNext={onNext}
            onSkip={onNext}
            onBack={onBack}
            stepLabel={deepLabel}
          />
        )}
        {state.step === 'dimensions' && (
          <DimensionsStep
            state={state}
            onUpdate={onUpdate}
            onNext={onNext}
            onSkip={onNext}
            onBack={onBack}
            stepLabel={deepLabel}
          />
        )}
        {state.step === 'free-text' && (
          <FreeTextStep
            state={state}
            onUpdate={onUpdate}
            onNext={finishDeepDive}
            onSkip={finishDeepDive}
            onBack={onBack}
            stepLabel={deepLabel}
          />
        )}
      </View>
      </SafeAreaView>
    </SafeAreaProvider>
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
