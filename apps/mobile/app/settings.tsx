import { useState } from 'react';
import { View, ScrollView, Pressable, Switch, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { CaretLeft } from 'phosphor-react-native';
import { GText } from '../src/components/GText';
import { colors } from '../src/theme/colors';
import { spacing } from '../src/theme/spacing';
import { mockCurrentUser } from '../src/data/mock';
import { useAuth } from '../src/context/AuthContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { isAuthenticated, signOut, showAuthModal } = useAuth();
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');
  const [notifyUpvotes, setNotifyUpvotes] = useState(true);
  const [notifyFollowers, setNotifyFollowers] = useState(true);
  const [notifyVerdicts, setNotifyVerdicts] = useState(true);

  return (
    <View style={styles.screen}>
      <View style={styles.nav}>
        <Pressable onPress={() => router.back()} style={styles.navButton}>
          <CaretLeft size={20} color={colors.text} weight="bold" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <GText variant="displayL" style={styles.title}>SETTINGS</GText>

        {/* Profile */}
        <View style={styles.section}>
          <GText variant="label">PROFILE</GText>
          {isAuthenticated ? (
            <>
              <View style={styles.field}>
                <GText variant="bodyS" color={colors.textMid}>USERNAME</GText>
                <GText variant="bodyM">{mockCurrentUser.username}</GText>
              </View>
              <View style={styles.field}>
                <GText variant="bodyS" color={colors.textMid}>HEIGHT</GText>
                <GText variant="bodyM">{mockCurrentUser.height ?? '—'}</GText>
              </View>
              <View style={styles.field}>
                <GText variant="bodyS" color={colors.textMid}>WEIGHT</GText>
                <GText variant="bodyM">{mockCurrentUser.weight ?? '—'}</GText>
              </View>
            </>
          ) : (
            <Pressable style={styles.button} onPress={showAuthModal}>
              <GText variant="label">SIGN IN</GText>
            </Pressable>
          )}
        </View>

        {/* Units */}
        <View style={styles.section}>
          <GText variant="label">UNITS</GText>
          <GText variant="bodyXs" color={colors.textMid}>Body measurements. Board dimensions always imperial.</GText>
          <View style={styles.toggleRow}>
            <Pressable
              onPress={() => setUnits('imperial')}
              style={[styles.toggleOption, units === 'imperial' && styles.toggleActive]}
            >
              <GText variant="tag" color={units === 'imperial' ? colors.white : colors.textLight}>
                IMPERIAL (FT/IN, LBS)
              </GText>
            </Pressable>
            <Pressable
              onPress={() => setUnits('metric')}
              style={[styles.toggleOption, units === 'metric' && styles.toggleActive]}
            >
              <GText variant="tag" color={units === 'metric' ? colors.white : colors.textLight}>
                METRIC (CM, KG)
              </GText>
            </Pressable>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <GText variant="label">NOTIFICATIONS</GText>
          <View style={styles.switchRow}>
            <GText variant="bodyM" style={styles.switchLabel}>Upvotes on your opinions</GText>
            <Switch
              value={notifyUpvotes}
              onValueChange={setNotifyUpvotes}
              trackColor={{ false: colors.borderSoft, true: colors.red }}
              thumbColor={colors.white}
            />
          </View>
          <View style={styles.switchRow}>
            <GText variant="bodyM" style={styles.switchLabel}>New followers</GText>
            <Switch
              value={notifyFollowers}
              onValueChange={setNotifyFollowers}
              trackColor={{ false: colors.borderSoft, true: colors.red }}
              thumbColor={colors.white}
            />
          </View>
          <View style={styles.switchRow}>
            <GText variant="bodyM" style={styles.switchLabel}>New verdicts on your boards</GText>
            <Switch
              value={notifyVerdicts}
              onValueChange={setNotifyVerdicts}
              trackColor={{ false: colors.borderSoft, true: colors.red }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <GText variant="label">ACCOUNT</GText>
          {isAuthenticated ? (
            <>
              <View style={styles.field}>
                <GText variant="bodyS" color={colors.textMid}>SIGNED IN VIA</GText>
                <GText variant="bodyM">Google</GText>
              </View>
              <Pressable style={styles.button} onPress={signOut}>
                <GText variant="label">SIGN OUT</GText>
              </Pressable>
              <Pressable style={styles.dangerButton}>
                <GText variant="label" color={colors.red}>DELETE ACCOUNT</GText>
              </Pressable>
              <GText variant="bodyXs" color={colors.textLight}>
                This removes all your opinions. The boards won't miss you either.
              </GText>
            </>
          ) : (
            <GText variant="bodyS" color={colors.textMid}>Not signed in.</GText>
          )}
        </View>

        {/* Version */}
        <View style={styles.footer}>
          <GText variant="micro">GLIDR V0.1.0 — STILL IN BETA. LIKE YOUR SURFING.</GText>
        </View>
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
    padding: spacing.xl,
    paddingTop: 60,
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
    padding: spacing.xl,
    paddingTop: 0,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  field: {
    gap: 4,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 0,
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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  switchLabel: {
    flex: 1,
  },
  button: {
    borderWidth: 2,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  dangerButton: {
    borderWidth: 2,
    borderColor: colors.red,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  footer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
});
