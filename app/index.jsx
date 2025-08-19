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
            <LinearGradient style={stylesLight.contentContainer} colors={["#e3e3e3", "#aaaaaa"]}>
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

export default WelcomeScreen;