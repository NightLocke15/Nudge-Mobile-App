import UserProvider from "@/AppContexts/UserContext";
import { useFonts } from 'expo-font';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

function RootLayout() {
    const [loaded, error] = useFonts({
        'Amiko-Bold': require('../assets/fonts/Amiko-Bold.ttf'),
        'Amiko-SemiBold': require('../assets/fonts/Amiko-SemiBold.ttf'),
        'Amiko-Regular': require('../assets/fonts/Amiko-Regular.ttf'),
        'Sunflower-Bold': require('../assets/fonts/Sunflower-Bold.ttf'),
        'Sunflower-Light': require('../assets/fonts/Sunflower-Light.ttf'),
        'Sunflower-Medium': require('../assets/fonts/Sunflower-Medium.ttf'),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error])

    if (!loaded && !error) {
        return null;
    }

    return (
        <GestureHandlerRootView>
            <SafeAreaProvider>
                <UserProvider>
                    <Stack screenOptions={{ headerTitle: "NUDGE", headerStyle: {backgroundColor: "#fff"}, headerShadowVisible: false}}>
                        <Stack.Screen name="index" options={{ headerShown: false }}/>
                        <Stack.Screen name="home" />
                        <Stack.Screen name="account/login" />
                        <Stack.Screen name="to-do-list/to-do-list" />
                    </Stack>
                </UserProvider>            
            </SafeAreaProvider>
        </GestureHandlerRootView>        
    )
}

export default RootLayout;