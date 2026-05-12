import { Modal, View, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { GText } from './GText';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

const SOCIAL_BUTTONS = [
  'CONTINUE WITH GOOGLE',
  'CONTINUE WITH APPLE',
  'CONTINUE WITH META',
  'CONTINUE WITH REDDIT',
] as const;

export function AuthModal() {
  const { isAuthModalVisible, hideAuthModal, signIn } = useAuth();

  return (
    <Modal
      visible={isAuthModalVisible}
      transparent
      animationType="slide"
      onRequestClose={hideAuthModal}
    >
      <Pressable style={styles.overlay} onPress={hideAuthModal}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />

          <GText variant="displayM" style={styles.title}>
            JOIN THE LINEUP
          </GText>

          <GText variant="bodyS" color={colors.textMid} style={styles.subtitle}>
            Sign in to rate boards, upvote opinions, and follow surfers.
          </GText>

          {SOCIAL_BUTTONS.map((label) => (
            <Pressable key={label} style={styles.socialButton} onPress={signIn}>
              <GText variant="label" style={styles.socialButtonText}>
                {label}
              </GText>
            </Pressable>
          ))}

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <GText variant="bodyXs" color={colors.textLight} style={styles.dividerText}>
              OR
            </GText>
            <View style={styles.dividerLine} />
          </View>

          <Pressable style={styles.walletButton} onPress={signIn}>
            <GText variant="label" color={colors.white}>
              CONNECT WALLET
            </GText>
          </Pressable>

          <GText variant="bodyXs" color={colors.textLight} style={styles.footer}>
            By continuing, you agree to our Terms and Privacy Policy.
          </GText>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26,23,20,0.85)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: spacing.xl,
    gap: spacing.md,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.borderSoft,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  socialButtonText: {
    color: colors.text,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: spacing.sm,
  },
  walletButton: {
    backgroundColor: colors.cardDark,
    borderRadius: 8,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  footer: {
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
