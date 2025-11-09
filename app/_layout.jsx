import ThemeProvider from "@/AppContexts/ThemeContext";
import UserProvider from "@/AppContexts/UserContext";
import { useFonts } from 'expo-font';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

function RootLayout() {
    // Fonts currently used in this app ***(Subject to change)***
    const [loaded, error] = useFonts({
        'PTSans-Bold': require('../assets/fonts/PTSans-Bold.ttf'),
        'PTSans-BoldItalic': require('../assets/fonts/PTSans-BoldItalic.ttf'),
        'PTSans-Italic': require('../assets/fonts/PTSans-Italic.ttf'),
        'PTSans-Regular': require('../assets/fonts/PTSans-Regular.ttf'),
        'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
        'Roboto-Light': require('../assets/fonts/Roboto-Light.ttf'),
        'Roboto-Medium': require('../assets/fonts/Roboto-Medium.ttf'),
        'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
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
                    <ThemeProvider>
                        <Stack screenOptions={{ headerShown: false, headerTitle: "NUDGE", headerStyle: {backgroundColor: "#fff"}, headerShadowVisible: false}}>
                            <Stack.Screen name="index" />
                            <Stack.Screen name="home" />
                            <Stack.Screen name="account/login" />
                            <Stack.Screen name="account/createAccount" />
                            <Stack.Screen name="account/setup" />
                            <Stack.Screen name="to-do-list/to-do-list" />
                            <Stack.Screen name="calendar/calendar" />
                            <Stack.Screen name="logs/diaryLogs" />
                            <Stack.Screen name="logs/peopleLogs" />
                            <Stack.Screen name="logs/medicationLogs" />    
                            <Stack.Screen name="clock/clock" />     
                            <Stack.Screen name="settings/settings" />  
                            <Stack.Screen name="emergency/emergency" />                     
                        </Stack>
                    </ThemeProvider>
                </UserProvider>            
            </SafeAreaProvider>
        </GestureHandlerRootView>        
    )
}

export default RootLayout;