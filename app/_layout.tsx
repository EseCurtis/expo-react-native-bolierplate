import { APIProvider } from "@/api/api-provider";
import { Stack } from "expo-router/stack";

function RootLayout() {
  return (
    <Providers>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </Providers>
  );
}

function Providers({ children }: { children: React.ReactNode }) {
  return <APIProvider>{children}</APIProvider>;
}

export default RootLayout;
