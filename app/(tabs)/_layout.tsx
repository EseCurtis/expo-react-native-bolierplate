import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, useGlobalSearchParams } from "expo-router";

export default function TabLayout() {
  const params = useGlobalSearchParams();
  const hideTab = params?.hideTab === "true";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "blue",
        headerShown: false,
        tabBarStyle: {
          borderRadius: 20,
          position: "absolute",
          display: hideTab ? "none" : "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          gap: 3,
          paddingTop: 12,
        },
        tabBarIconStyle: {
          marginTop: "auto",
          marginBottom: 0,
        },
        tabBarItemStyle: {
          marginTop: "auto",
          marginBottom: 0,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="cog" color={color} />
          )
        }}
      />
    </Tabs>
  );
}
