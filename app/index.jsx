import { ThemeContext } from '@/AppContexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useContext } from 'react';
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


function WelcomeScreen() {
    //Router to routhe the user to the home page
    const router = useRouter();
    const {currentTheme, gradientColours } = useContext(ThemeContext);

    //Routes the user from the splash screen to the home page
    function getStarted() {
        router.navigate('/home');
    }

    return (
        <SafeAreaView style={currentTheme.includes("Light") ? stylesLight.mainContainer : stylesDark.mainContainer}>  
        <StatusBar barStyle={currentTheme.includes("Light") ? "dark-content" : "light-content"} backgroundColor={currentTheme.includes("Light") ? "#e3e3e3" : "#2b2b2b"} />
            <LinearGradient style={currentTheme.includes("Light") ? stylesLight.contentContainer : stylesDark.contentContainer} colors={gradientColours}>
                <View style={currentTheme.includes("Light") ? stylesLight.logoContainer : stylesDark.logoContainer}>
                    <Text style={currentTheme.includes("Light") ? stylesLight.logo : stylesDark.logo}>NUDGE</Text> 
                </View>
                <View style={currentTheme.includes("Light") ? stylesLight.getStartedContainer : stylesDark.getStartedContainer}>
                    <Pressable onPress={getStarted} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.getStarted : stylesDark.getStarted, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]}>
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