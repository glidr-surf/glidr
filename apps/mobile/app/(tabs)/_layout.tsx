import { Tabs } from 'expo-router';
import { SquaresFour, PencilSimpleLine, User } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../src/theme/colors';
import { fonts } from '../../src/theme/typography';
import { spacing } from '../../src/theme/spacing';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          left: spacing.lg,
          right: spacing.lg,
          bottom: insets.bottom + spacing.sm,
          height: 64,
          borderRadius: 32,
          backgroundColor: colors.text, // ink
          borderTopWidth: 0,
          paddingTop: 10,
          paddingBottom: 10,
          shadowColor: '#000',
          shadowOpacity: 0.3,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 8,
        },
        tabBarItemStyle: { minHeight: 44 },
        tabBarLabelStyle: {
          fontFamily: fonts.bodySemiBold,
          fontSize: 10,
          letterSpacing: 1,
          textTransform: 'uppercase',
        },
        tabBarActiveTintColor: colors.yellow,
        tabBarInactiveTintColor: colors.textLight,
      }}
    >
      <Tabs.Screen name="index" options={{
        title: 'Browse',
        tabBarIcon: ({ color, focused }) => <SquaresFour size={24} color={color} weight={focused ? 'fill' : 'bold'} />,
      }} />
      <Tabs.Screen name="rate" options={{
        title: 'Rate',
        tabBarIcon: ({ color, focused }) => <PencilSimpleLine size={24} color={color} weight={focused ? 'fill' : 'bold'} />,
      }} />
      <Tabs.Screen name="profile" options={{
        title: 'Profile',
        tabBarIcon: ({ color, focused }) => <User size={24} color={color} weight={focused ? 'fill' : 'bold'} />,
      }} />
    </Tabs>
  );
}
