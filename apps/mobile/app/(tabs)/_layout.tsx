import { Tabs } from 'expo-router';
import { FloatingTabBar } from '../../src/components/FloatingTabBar';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <FloatingTabBar {...(props as any)} />}>
      <Tabs.Screen name="index" options={{ title: 'Browse' }} />
      <Tabs.Screen name="rate" options={{ title: 'Rate' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
