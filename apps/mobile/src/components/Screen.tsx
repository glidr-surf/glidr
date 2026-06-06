import { View, StyleSheet, ScrollView, ViewProps } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

interface ScreenProps extends ViewProps {
  children: React.ReactNode;
  scrollable?: boolean;
  edges?: readonly Edge[];
}

export function Screen({ children, scrollable = false, edges = ['top'], style, testID, ...props }: ScreenProps) {
  const content = scrollable ? (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.inner, style]} {...props}>
      {children}
    </View>
  );

  return (
    <SafeAreaView testID={testID} style={styles.container} edges={edges}>
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  inner: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },
});
