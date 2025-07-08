import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


function WelcomeScreen() {
    //Router to routhe the user to the home page
    const router = useRouter();

    //Routes the user from the splash screen to the home page
    function getStarted() {
        router.navigate('/home');
    }

    return (
        <SafeAreaView style={stylesLight.mainContainer}>  
            <LinearGradient style={stylesLight.contentContainer} colors={["#ffffff", "#aaaaaa"]}>
                <View style={stylesLight.logoContainer}>
                    <Text style={stylesLight.logo}>NUDGE</Text> 
                </View>
                <View style={stylesLight.getStartedContainer}>
                    <Pressable onPress={getStarted} style={stylesLight.getStarted}>
                        <Text style={stylesLight.getStartedText}>Get Started</Text>
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
        fontFamily: "Economica-Bold",
        fontSize: 100,
        color: "#000"
    },
    getStartedContainer: {
        marginBottom: "auto",
        marginRight:"auto",
        marginLeft: "auto",
        marginTop: 20
    },
    getStarted: {
        backgroundColor: "#f0f0f0",
        padding: 15,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    getStartedText: {
        color: "#000",
        fontFamily: "Sunflower-Light",
        fontSize: 25
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
        fontFamily: "Economica-Bold",
        fontSize: 100,
        color: "#fff"
    },
    getStartedContainer: {
        marginBottom: "auto",
        marginRight:"auto",
        marginLeft: "auto",
        marginTop: 20
    },
    getStarted: {
        backgroundColor: "#3b3b3b",
        padding: 15,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    getStartedText: {
        color: "#fff",
        fontFamily: "Sunflower-Medium",
        fontSize: 25,
    }
});

export default WelcomeScreen;