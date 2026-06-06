import { useState } from 'react';
import { View, ScrollView, Pressable, Switch, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { CaretLeft } from 'phosphor-react-native';
import { GText } from '../src/components/GText';
import { Screen } from '../src/components/Screen';
import { CardGroup } from '../src/components/CardGroup';
import { navBack } from '../src/utils/navBack';
import { colors } from '../src/theme/colors';
import { spacing } from '../src/theme/spacing';
import { useAuth } from '../src/context/AuthContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { isAuthenticated, signOut, showAuthModal, user } = useAuth();
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');
  const [notifyUpvotes, setNotifyUpvotes] = useState(true);
  const [notifyFollowers, setNotifyFollowers] = useState(true);
  const [notifyVerdicts, setNotifyVerdicts] = useState(true);

  return (
    <Screen edges={['top']}>
      <View style={styles.nav}>
        <Pressable onPress={() => navBack(router)} style={styles.navButton} hitSlop={8} accessibilityRole="button" accessibilityLabel="Go back">
          <CaretLeft size={20} color={colors.text} weight="bold" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <GText variant="displayL" style={styles.title}>SETTINGS</GText>

        {/* Profile */}
        <View style={styles.section}>
          <GText variant="label" style={styles.sectionLabel}>PROFILE</GText>
          {isAuthenticated ? (
            <CardGroup>
              <View style={styles.cardField}>
                <GText variant="caption" color={colors.textMid}>USERNAME</GText>
                <GText variant="bodyM">{user?.username ?? '—'}</GText>
              </View>
              <View style={styles.cardField}>
                <GText variant="caption" color={colors.textMid}>HEIGHT</GText>
                <GText variant="bodyM">{user?.height ?? '—'}</GText>
              </View>
              <View style={styles.cardField}>
                <GText variant="caption" color={colors.textMid}>WEIGHT</GText>
                <GText variant="bodyM">{user?.weight ?? '—'}</GText>
              </View>
            </CardGroup>
          ) : (
            <Pressable style={styles.button} onPress={showAuthModal}>
              <GText variant="label">SIGN IN</GText>
            </Pressable>
          )}
        </View>

        {/* Units */}
        <View style={styles.section}>
          <GText variant="label" style={styles.sectionLabel}>UNITS</GText>
          <GText variant="bodyM" color={colors.textMid} style={styles.sectionLabel}>Body measurements. Board dimensions always imperial.</GText>
          <View style={styles.toggleRow}>
            <Pressable
              onPress={() => setUnits('imperial')}
              style={[styles.toggleOption, units === 'imperial' && styles.toggleActive]}
            >
              <GText variant="caption" color={units === 'imperial' ? colors.white : colors.textLight}>
                IMPERIAL (FT/IN, LBS)
              </GText>
            </Pressable>
            <Pressable
              onPress={() => setUnits('metric')}
              style={[styles.toggleOption, units === 'metric' && styles.toggleActive]}
            >
              <GText variant="caption" color={units === 'metric' ? colors.white : colors.textLight}>
                METRIC (CM, KG)
              </GText>
            </Pressable>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <GText variant="label" style={styles.sectionLabel}>NOTIFICATIONS</GText>
          <CardGroup>
            <View style={styles.cardSwitchRow}>
              <GText variant="bodyM" style={styles.switchLabel}>Upvotes on your opinions</GText>
              <Switch
                value={notifyUpvotes}
                onValueChange={setNotifyUpvotes}
                trackColor={{ false: colors.borderSoft, true: colors.red }}
                thumbColor={colors.white}
              />
            </View>
            <View style={styles.cardSwitchRow}>
              <GText variant="bodyM" style={styles.switchLabel}>New followers</GText>
              <Switch
                value={notifyFollowers}
                onValueChange={setNotifyFollowers}
                trackColor={{ false: colors.borderSoft, true: colors.red }}
                thumbColor={colors.white}
              />
            </View>
            <View style={styles.cardSwitchRow}>
              <GText variant="bodyM" style={styles.switchLabel}>New verdicts on your boards</GText>
              <Switch
                value={notifyVerdicts}
                onValueChange={setNotifyVerdicts}
                trackColor={{ false: colors.borderSoft, true: colors.red }}
                thumbColor={colors.white}
              />
            </View>
          </CardGroup>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <GText variant="label" style={styles.sectionLabel}>ACCOUNT</GText>
          {isAuthenticated ? (
            <>
              <CardGroup>
                <View style={styles.cardField}>
                  <GText variant="caption" color={colors.textMid}>SIGNED IN VIA</GText>
                  <GText variant="bodyM">Google</GText>
                </View>
                <Pressable style={styles.cardAction} onPress={signOut}>
                  <GText variant="label">SIGN OUT</GText>
                </Pressable>
                <Pressable style={styles.cardAction}>
                  <GText variant="label" color={colors.red}>DELETE ACCOUNT</GText>
                </Pressable>
              </CardGroup>
              <GText variant="bodyM" color={colors.textLight} style={styles.accountNote}>
                This removes all your opinions. The boards won't miss you either.
              </GText>
            </>
          ) : (
            <GText variant="bodyM" color={colors.textMid}>Not signed in.</GText>
          )}
        </View>

        {/* Version */}
        <View style={styles.footer}>
          <GText variant="caption">GLIDR V0.1.0 — STILL IN BETA. LIKE YOUR SURFING.</GText>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  nav: {
    padding: spacing.xl,
    paddingBottom: 0,
  },
  navButton: {
    padding: spacing.xs,
  },
  content: {
    paddingBottom: spacing['3xl'],
  },
  title: {
    padding: spacing.xl,
    paddingBottom: spacing.md,
  },
  section: {
    paddingTop: 0,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  sectionLabel: {
    paddingHorizontal: spacing.xl,
  },
  cardField: {
    gap: 4,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  cardAction: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  cardSwitchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 0,
    marginHorizontal: spacing.xl,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  toggleActive: {
    backgroundColor: colors.red,
    borderColor: colors.red,
  },
  switchLabel: {
    flex: 1,
  },
  button: {
    borderWidth: 2,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginHorizontal: spacing.xl,
  },
  accountNote: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.sm,
  },
  footer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
});
