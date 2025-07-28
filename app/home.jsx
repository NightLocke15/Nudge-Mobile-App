import { UserContext } from "@/AppContexts/UserContext";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

function Home() {
    //Accesses user context in order to determine if the user has logged in or not
    const { authenticated, logout, localUserInfo } = useContext(UserContext);

    //Router that allows the user to navigate to the different pages in the app
    const router = useRouter();

    //Logs the user out of their profile (Current position on Home Page not final)
    function logoutHome() {
        logout();
        router.navigate('/');
    }

    return (
        <SafeAreaView style={stylesLight.container}>
            {JSON.parse(authenticated) ? 
            (<LinearGradient style={stylesLight.contentContainer} colors={["#ffffff", "#aaaaaa"]}>
                <View style={stylesLight.homeHeaderContainer}>
                    <Text style={stylesLight.homeHeader}>NUDGE</Text>
                </View>
                <View style={stylesLight.menuContainer}>
                    <Pressable style={stylesLight.button} onPress={() => router.navigate('/to-do-list/to-do-list')}>
                        <Text style={stylesLight.buttonText}>To-Do</Text>
                    </Pressable>
                    <Pressable style={stylesLight.button}>
                        <Text style={stylesLight.buttonText}>Calendar</Text>
                    </Pressable>
                    <Pressable style={stylesLight.button} onPress={() => router.navigate('/logs/diaryLogs')}>
                        <Text style={stylesLight.buttonText}>Diary</Text>
                    </Pressable>
                    <Pressable style={stylesLight.button} onPress={() => router.navigate('/logs/peopleLogs')}>
                        <Text style={stylesLight.buttonText}>People</Text>
                    </Pressable>
                    <Pressable style={stylesLight.button} onPress={() => router.navigate('/logs/medicationLogs')}>
                        <Text style={stylesLight.buttonText}>Medication</Text>
                    </Pressable>
                    <Pressable style={stylesLight.button}>
                        <Text style={stylesLight.buttonText}>Emergency</Text>
                    </Pressable>
                    <Pressable onPress={logoutHome}>
                        <Text>LogOut</Text>
                    </Pressable>
                </View>                
            </LinearGradient>) : 
            (<LinearGradient style={stylesLight.contentContainer} colors={["#ffffff", "#aaaaaa"]}>
                <View style={stylesLight.headerContainer}>
                    <Text style={stylesLight.header}>Welcome to</Text>
                    <Text style={stylesLight.header2}>NUDGE</Text>
                </View>
                <View style={stylesLight.loginContainer}>
                    <Pressable  style={stylesLight.clickableAccount} onPress={() => router.navigate('/account/login')}>
                        <Text style={stylesLight.clickableAccountText}>Log In</Text>
                    </Pressable> 
                    <Pressable  style={stylesLight.clickableAccount} onPress={() => router.navigate('/account/createAccount')}>
                        <Text style={stylesLight.clickableAccountText}>Create Account</Text>
                    </Pressable>
                </View>                
            </LinearGradient>)}
        </SafeAreaView>
    )
}

//Styles for this page
const stylesLight = StyleSheet.create({
    //Home before login
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1
    },
    headerContainer: {
        marginTop: 150,
        marginRight:"auto",
        marginLeft: "auto",
        marginBottom: 10,
        flex: 2,
    },
    header: {
        fontFamily: "Economica-Bold",
        fontSize: 40,
        textAlign: "center",
    },
    header2: {
        fontFamily: "Economica-Bold",
        fontSize: 100,
        textAlign: "center",
    },
    loginContainer: {
        marginRight:"auto",
        marginLeft: "auto",
        flex: 1,
        marginBottom: 50,
    },
    clickableAccount: {
        backgroundColor: "#f0f0f0",
        padding: 15,
        borderRadius: 25,
        elevation: 5,
        marginBottom: 10
    },
    clickableAccountText: {
        fontFamily: "Sunflower-Light",
        fontSize: 20,
        textAlign: "center"
    },
    
    //Home after login
    homeHeaderContainer: {
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 20
    },
    homeHeader: {
        fontFamily: "Economica-Bold",
        fontSize: 40
    },
    menuContainer: {
        marginLeft: 30,
        marginRight: 30
    },
    button: {
        backgroundColor: "#f0f0f0",
        marginTop: 30,
        padding: 20,
        borderRadius: 10,
        elevation: 5
    },
    buttonText: {
        fontFamily: "Economica-Bold",
        fontSize: 30,
        textAlign: "center"
    }
});

export default Home;