import { Tabs } from 'expo-router';
import { House, MagnifyingGlass, User } from 'phosphor-react-native';
import { SurfboardIcon } from '../../src/components/SurfboardIcon';
import { colors } from '../../src/theme/colors';
import { fonts } from '../../src/theme/typography';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopWidth: 2,
          borderTopColor: colors.border,
          paddingBottom: 20,
          paddingTop: 10,
          height: 64,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.mono,
          fontSize: 8,
          letterSpacing: 1,
          textTransform: 'uppercase',
        },
        tabBarActiveTintColor: colors.red,
        tabBarInactiveTintColor: colors.textLight,
      }}
    >
      <Tabs.Screen name="index" options={{
        title: 'Home',
        tabBarIcon: ({ color, focused }) => <House size={22} color={color} weight={focused ? 'fill' : 'regular'} />,
      }} />
      <Tabs.Screen name="search" options={{
        title: 'Search',
        tabBarIcon: ({ color, focused }) => <MagnifyingGlass size={22} color={color} weight={focused ? 'fill' : 'regular'} />,
      }} />
      <Tabs.Screen name="rate" options={{
        title: 'Rate',
        tabBarIcon: ({ color }) => <SurfboardIcon size={22} color={color} filled />,
      }} />
      <Tabs.Screen name="profile" options={{
        title: 'Profile',
        tabBarIcon: ({ color, focused }) => <User size={22} color={color} weight={focused ? 'fill' : 'regular'} />,
      }} />
    </Tabs>
  );
}
