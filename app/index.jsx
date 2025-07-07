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
        <SafeAreaView style={styles.mainContainer}>      
            <View style={styles.contentContainer}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logo}>NUDGE</Text> 
                </View>
                <View style={styles.getStarted}>
                    <Pressable onPress={getStarted}>
                        <Text>Get Started</Text>
                    </Pressable>
                </View>                       
            </View>      
        </SafeAreaView>
    );
}

//Styles for this page
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#fff",
    },
    contentContainer: {
        flex: 1
    },
    logoContainer: {
        margin: "auto",
    },
    logo: {

    },
    getStarted: {
        margin: "auto",
    }
});

export default WelcomeScreen;