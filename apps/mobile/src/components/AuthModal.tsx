import { useState } from 'react';
import { Modal, View, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { GText } from './GText';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fonts } from '../theme/typography';

export function AuthModal() {
  const { isAuthModalVisible, hideAuthModal, sendCode, verifyCode } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => { setStep('email'); setEmail(''); setCode(''); setError(null); setBusy(false); };
  const close = () => { reset(); hideAuthModal(); };

  const onSend = async () => {
    setBusy(true); setError(null);
    try {
      await sendCode(email.trim());
      setStep('code');
    } catch {
      setError("Couldn't send the code. Check the email or try again in a bit.");
    } finally {
      setBusy(false);
    }
  };

  const onVerify = async () => {
    setBusy(true); setError(null);
    try {
      const needsUsername = await verifyCode(email.trim(), code.trim());
      close();
      if (needsUsername) router.push('/username-picker');
    } catch {
      setError('That code did not check out. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal visible={isAuthModalVisible} transparent animationType="slide" onRequestClose={close}>
      <Pressable style={styles.overlay} onPress={close}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />

          <GText variant="displayM" style={styles.title}>JOIN THE LINEUP</GText>

          {step === 'email' ? (
            <>
              <GText variant="bodyM" color={colors.textMid} style={styles.subtitle}>
                Drop your email. We'll send a code — no passwords, no faff.
              </GText>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={colors.textLight}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                inputMode="email"
              />
              <Pressable style={[styles.cta, (!email || busy) && styles.ctaDisabled]} onPress={onSend} disabled={!email || busy}>
                {busy ? <ActivityIndicator color={colors.white} /> : <GText variant="label" color={colors.white}>SEND CODE</GText>}
              </Pressable>
            </>
          ) : (
            <>
              <GText variant="bodyM" color={colors.textMid} style={styles.subtitle}>
                Enter the 6-digit code we sent to {email}.
              </GText>
              <TextInput
                style={[styles.input, styles.codeInput]}
                value={code}
                onChangeText={setCode}
                placeholder="123456"
                placeholderTextColor={colors.textLight}
                keyboardType="number-pad"
                inputMode="numeric"
                maxLength={6}
              />
              <Pressable style={[styles.cta, (code.length < 6 || busy) && styles.ctaDisabled]} onPress={onVerify} disabled={code.length < 6 || busy}>
                {busy ? <ActivityIndicator color={colors.white} /> : <GText variant="label" color={colors.white}>VERIFY</GText>}
              </Pressable>
              <Pressable onPress={onSend} disabled={busy}>
                <GText variant="caption" color={colors.red} style={styles.resend}>RESEND CODE</GText>
              </Pressable>
            </>
          )}

          {error && <GText variant="caption" color={colors.red} style={styles.error}>{error}</GText>}

          <GText variant="caption" color={colors.textLight} style={styles.footer}>
            By continuing, you agree to our Terms and Privacy Policy.
          </GText>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(26,23,20,0.85)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.bg, borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: spacing.xl, gap: spacing.md },
  handle: { width: 40, height: 4, backgroundColor: colors.borderSoft, borderRadius: 2, alignSelf: 'center', marginBottom: spacing.sm },
  title: { textAlign: 'center', marginBottom: spacing.xs },
  subtitle: { textAlign: 'center', marginBottom: spacing.sm },
  input: {
    borderWidth: 2, borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    fontFamily: fonts.bodyMedium, fontSize: 16, color: colors.text,
  },
  codeInput: { textAlign: 'center', letterSpacing: 8, fontSize: 24 },
  cta: { backgroundColor: colors.red, paddingVertical: spacing.md, alignItems: 'center' },
  ctaDisabled: { opacity: 0.3 },
  resend: { textAlign: 'center', marginTop: spacing.xs },
  error: { textAlign: 'center' },
  footer: { textAlign: 'center', marginTop: spacing.xs },
});
