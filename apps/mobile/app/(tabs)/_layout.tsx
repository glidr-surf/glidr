import { Tabs } from 'expo-router';
import { SquaresFour, PencilSimpleLine, User } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../src/theme/colors';
import { fonts } from '../../src/theme/typography';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.text, // ink
          borderTopWidth: 0,
          height: 56 + insets.bottom,
          paddingBottom: insets.bottom + 8,
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarItemStyle: { minHeight: 48 },
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
