import { useState, useEffect } from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { CaretLeft, Medal, Lightning, ThumbsDown, PencilSimple, Stack, Trophy, ArrowFatUp, Fire } from 'phosphor-react-native';
import type { Icon } from 'phosphor-react-native';
import { GText } from '../src/components/GText';
import { colors } from '../src/theme/colors';
import { spacing } from '../src/theme/spacing';
import { computeBadges } from '@glidr/data';
import type { Badge, BadgeId } from '@glidr/data';
import { supabase } from '../src/lib/supabase';
import { useAuth } from '../src/context/AuthContext';

const BADGE_ICONS: Record<BadgeId, Icon> = {
  'kooks-getting-started': Medal,
  'wannabe-corelord': Lightning,
  'flogged-it': ThumbsDown,
  'wordsmith': PencilSimple,
  'board-collector': Stack,
  'quiver-completionist': Trophy,
  'serial-enabler': ArrowFatUp,
  'hot-take-merchant': Fire,
};

export default function BadgesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [allBadges, setAllBadges] = useState<Badge[]>([]);

  useEffect(() => {
    if (!user) return;
    computeBadges(supabase, user.id).then(setAllBadges);
  }, [user]);

  const earned = allBadges.filter((b) => b.earned);
  const inProgress = allBadges.filter((b) => !b.earned);

  return (
    <View style={styles.screen}>
      <View style={styles.nav}>
        <Pressable onPress={() => router.back()} style={styles.navButton}>
          <CaretLeft size={20} color={colors.text} weight="bold" />
        </Pressable>
        <GText variant="label">{earned.length} OF {allBadges.length}</GText>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <GText variant="displayL">BADGES</GText>
          <GText variant="bodyM" color={colors.textMid}>Proof you actually surf. Probably.</GText>
        </View>

        {earned.length > 0 && (
          <View style={styles.section}>
            <GText variant="label">EARNED</GText>
            {earned.map((badge) => {
              const BadgeIcon = BADGE_ICONS[badge.id];
              return (
                <View key={badge.id} style={styles.badgeCard}>
                  <View style={styles.badgeIconContainer}>
                    <BadgeIcon size={28} color={colors.red} weight="fill" />
                  </View>
                  <View style={styles.badgeInfo}>
                    <GText variant="displayS">{badge.name}</GText>
                    <GText variant="bodyM" color={colors.textMid}>{badge.description}</GText>
                    <GText variant="caption" color={colors.green}>EARNED</GText>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {inProgress.length > 0 && (
          <View style={styles.section}>
            <GText variant="label">IN PROGRESS</GText>
            {inProgress.map((badge) => {
              const BadgeIcon = BADGE_ICONS[badge.id];
              const progress = badge.progress ?? 0;
              const target = badge.target ?? 1;
              const percentage = (progress / target) * 100;
              return (
                <View key={badge.id} style={[styles.badgeCard, styles.badgeCardFaded]}>
                  <View style={[styles.badgeIconContainer, styles.badgeIconFaded]}>
                    <BadgeIcon size={28} color={colors.textLight} weight="regular" />
                  </View>
                  <View style={styles.badgeInfo}>
                    <GText variant="displayS" color={colors.textMid}>{badge.name}</GText>
                    <GText variant="bodyM" color={colors.textLight}>{badge.howToEarn}</GText>
                    <View style={styles.progressRow}>
                      <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${percentage}%` }]} />
                      </View>
                      <GText variant="caption">{progress}/{target}</GText>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
    paddingTop: 60,
  },
  navButton: {
    padding: spacing.xs,
  },
  content: {
    paddingBottom: spacing['3xl'],
  },
  header: {
    padding: spacing.xl,
    gap: spacing.xs,
  },
  section: {
    padding: spacing.xl,
    paddingTop: 0,
    gap: spacing.md,
  },
  badgeCard: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.lg,
    alignItems: 'center',
  },
  badgeCardFaded: {
    borderColor: colors.borderSoft,
    opacity: 0.7,
  },
  badgeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(232, 67, 42, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIconFaded: {
    backgroundColor: colors.borderSoft,
  },
  badgeInfo: {
    flex: 1,
    gap: 4,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 4,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: colors.borderSoft,
    borderRadius: 2,
  },
  progressFill: {
    height: 4,
    backgroundColor: colors.red,
    borderRadius: 2,
  },
});
