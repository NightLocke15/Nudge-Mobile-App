import { UserContext } from "@/AppContexts/UserContext";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

function Home() {
    //Accesses user context in order to determine if the user has logged in or not
    const { authenticated, logout } = useContext(UserContext);

    //Router that allows the user to navigate to the different pages in the app
    const router = useRouter();

    return (
        <SafeAreaView style={stylesLight.container}>
            {authenticated ? 
            (<LinearGradient style={stylesLight.contentContainer} colors={["#ffffff", "#aaaaaa"]}>
                <Text>NUDGE</Text>
                <Pressable onPress={() => router.navigate('/to-do-list/to-do-list')}>
                    <Text>To-Do</Text>
                </Pressable>
                <Pressable>
                    <Text>Calendar</Text>
                </Pressable>
                <Pressable>
                    <Text>Diary</Text>
                </Pressable>
                <Pressable>
                    <Text>People</Text>
                </Pressable>
                <Pressable>
                    <Text>Medication</Text>
                </Pressable>
                <Pressable>
                    <Text>Emergency</Text>
                </Pressable>
                <Pressable onPress={logout}>
                    <Text>LogOut</Text>
                </Pressable>
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
                </View>
                <View style={stylesLight.createContainer}>
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
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1
    },
    headerContainer: {
        marginTop: 300,
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
    },
    createContainer: {
        marginRight:"auto",
        marginLeft: "auto",
        marginBottom: 180,
        flex: 2,
    },
    clickableAccount: {
        backgroundColor: "#f0f0f0",
        padding: 15,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    clickableAccountText: {
        fontFamily: "Sunflower-Light",
        fontSize: 20,
    }
});

const stylesDark = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#323232"
    },
    contentContainer: {
        flex: 1
    },
    headerContainer: {
        marginTop: 300,
        marginRight:"auto",
        marginLeft: "auto",
        marginBottom: 10,
        flex: 2,
    },
    header: {
        fontFamily: "Economica-Bold",
        fontSize: 40,
        textAlign: "center",
        color: "#fff"
    },
    header2: {
        fontFamily: "Economica-Bold",
        fontSize: 100,
        textAlign: "center",
        color: "#fff"
    },
    loginContainer: {
        marginRight:"auto",
        marginLeft: "auto",
        flex: 1,
    },
    createContainer: {
        marginRight:"auto",
        marginLeft: "auto",
        marginBottom: 180,
        flex: 2,
    },
    clickableAccount: {
        backgroundColor: "#3b3b3b",
        padding: 15,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    clickableAccountText: {
        fontFamily: "Sunflower-Light",
        fontSize: 20,
        color: "#fff"
    }
});

export default Home;