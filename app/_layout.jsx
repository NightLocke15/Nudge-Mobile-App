import UserProvider from "@/Contexts/UserContext";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

function RootLayout() {
    return (
        <SafeAreaProvider>
            <UserProvider>
                <Stack screenOptions={{ headerTitle: "NUDGE", headerStyle: {backgroundColor: "#fff"}, headerShadowVisible: false}}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="home" />
                    <Stack.Screen name="login" />
                </Stack>
            </UserProvider>            
        </SafeAreaProvider>
    )
}

export default RootLayout;