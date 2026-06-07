import { View, Pressable, StyleSheet } from 'react-native';
import { SquaresFour, PencilSimpleLine, User, type IconProps } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ComponentType } from 'react';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

const ICONS: Record<string, ComponentType<IconProps>> = {
  index: SquaresFour,
  rate: PencilSimpleLine,
  profile: User,
};

type TabRoute = { key: string; name: string };
interface FloatingTabBarProps {
  state: { index: number; routes: TabRoute[] };
  navigation: {
    emit: (event: { type: 'tabPress'; target: string; canPreventDefault: boolean }) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
}

/** Instagram-style floating pill: compact, centred, icons-only with an active highlight. */
export function FloatingTabBar({ state, navigation }: FloatingTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { bottom: insets.bottom + spacing.sm }]} pointerEvents="box-none">
      <View style={styles.pill}>
        {state.routes.map((route, i) => {
          const Icon = ICONS[route.name];
          if (!Icon) return null;
          const focused = state.index === i;
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
          };
          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.item}
              accessibilityRole="button"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={route.name}
            >
              <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                <Icon size={25} color={focused ? colors.yellow : 'rgba(242,230,206,0.6)'} weight={focused ? 'fill' : 'bold'} />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const PILL_HEIGHT = 60;

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center', // centre the content-sized pill horizontally
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: PILL_HEIGHT,
    paddingHorizontal: spacing.sm,
    borderRadius: PILL_HEIGHT / 2,
    backgroundColor: colors.text,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  item: {
    height: PILL_HEIGHT,
    paddingHorizontal: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrap: {
    width: 52,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapActive: {
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
});
