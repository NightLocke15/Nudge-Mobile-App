import { ThemeContext } from '@/AppContexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useContext } from 'react';
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated from 'react-native-reanimated';
import { SafeAreaView } from "react-native-safe-area-context";


function WelcomeScreen() {
    //Router to routhe the user to the home page
    const router = useRouter();
    const {currentTheme, gradientColours } = useContext(ThemeContext);

    const backgroundColourRef = new Animated.Value(0);

    //Routes the user from the splash screen to the home page
    function getStarted() {
        router.navigate('/home');
    }

    const animPress = () => {
            Animated.timing(backgroundColourRef, {
                toValue: 1,
                duration: 60,
                useNativeDriver: true,
            }).start();
        };
    
        const animRelease = () => {
            Animated.timing(backgroundColourRef, {
                toValue: 0,
                duration : 60,
                useNativeDriver: true,
            }).start();
        };
    
        const backgroundColorAnim = backgroundColourRef.interpolate({
            inputRange: [0,1],
            outputRange: currentTheme.includes("Light") ? ['#f2f2f2', '#bebebeff'] : ['#3a3a3a', '#202020ff'],
        })

    return (
        <SafeAreaView style={currentTheme.includes("Light") ? stylesLight.mainContainer : stylesDark.mainContainer}>  
            <LinearGradient style={currentTheme.includes("Light") ? stylesLight.contentContainer : stylesDark.contentContainer} colors={gradientColours}>
                <View style={currentTheme.includes("Light") ? stylesLight.logoContainer : stylesDark.logoContainer}>
                    <Text style={currentTheme.includes("Light") ? stylesLight.logo : stylesDark.logo}>NUDGE</Text> 
                </View>
                <View style={currentTheme.includes("Light") ? stylesLight.getStartedContainer : stylesDark.getStartedContainer}>
                    <Pressable onPress={getStarted} style={currentTheme.includes("Light") ? stylesLight.getStarted : stylesDark.getStarted}>
                        <Text style={currentTheme.includes("Light") ? stylesLight.getStartedText : stylesDark.getStartedText}>Get Started</Text>
                    </Pressable>
                </View>                       
            </LinearGradient>                   
        </SafeAreaView>
    );
}

//Styles for this page
const stylesLight = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    contentContainer: {
        flex: 1
    },
    logoContainer: {
        marginTop: "auto",
        marginRight:"auto",
        marginLeft: "auto"
    },
    logo: {
        fontFamily: "PTSans-Regular",
        fontSize: 80,
        color: "#242424"
    },
    getStartedContainer: {
        marginBottom: "auto",
        marginRight:"auto",
        marginLeft: "auto",
        marginTop: 45
    },
    getStarted: {
        backgroundColor: "#f2f2f2",
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 25,
        elevation: 5,
    },
    getStartedText: {
        color: "#242424",
        fontFamily: "Roboto-Regular",
        fontSize: 22
    }
});

const stylesDark = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    contentContainer: {
        flex: 1
    },
    logoContainer: {
        marginTop: "auto",
        marginRight:"auto",
        marginLeft: "auto"
    },
    logo: {
        fontFamily: "PTSans-Regular",
        fontSize: 80,
        color: "#e3e3e3"
    },
    getStartedContainer: {
        marginBottom: "auto",
        marginRight:"auto",
        marginLeft: "auto",
        marginTop: 45
    },
    getStarted: {
        backgroundColor: "#3a3a3a",
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 25,
        elevation: 5,
    },
    getStartedText: {
        color: "#e3e3e3",
        fontFamily: "Roboto-Regular",
        fontSize: 22
    }
});

export default WelcomeScreen;