import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';

import { theme } from '@/constants/theme';
import { useAppState } from '@/providers/app-state-provider';

type TabIconName = keyof typeof Ionicons.glyphMap;

function TabIcon({ color, name }: { color: string; name: TabIconName }) {
  return <Ionicons color={color} name={name} size={18} />;
}

export default function TabLayout() {
  const { hasCompletedRoleSelection } = useAppState();

  if (!hasCompletedRoleSelection) {
    return <Redirect href="/role-selection" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSub,
        tabBarStyle: {
          position: 'absolute',
          height: 74,
          left: 14,
          right: 14,
          bottom: 14,
          paddingTop: 8,
          paddingBottom: 10,
          borderRadius: 28,
          borderWidth: 1.5,
          borderColor: theme.colors.line,
          backgroundColor: theme.colors.bgCard,
          shadowColor: '#8b5a2b',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.12,
          shadowRadius: 18,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontFamily: theme.fonts.primary,
          fontSize: 10,
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ color }) => <TabIcon color={color} name="home-outline" />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: '对话',
          tabBarIcon: ({ color }) => <TabIcon color={color} name="chatbubble-outline" />,
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: '记忆',
          tabBarIcon: ({ color }) => <TabIcon color={color} name="star-outline" />,
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: '我的',
          tabBarIcon: ({ color }) => <TabIcon color={color} name="person-outline" />,
        }}
      />
    </Tabs>
  );
}
