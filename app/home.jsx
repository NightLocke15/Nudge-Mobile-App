import { UserContext } from "@/AppContexts/UserContext";
import { Lucide } from "@react-native-vector-icons/lucide";
import { Octicons } from "@react-native-vector-icons/octicons";
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
            (<LinearGradient style={stylesLight.contentContainer} colors={["#e3e3e3", "#aaaaaa"]}>
                <View style={stylesLight.homeHeaderContainer}>
                    <Text style={stylesLight.homeHeader}>NUDGE</Text>
                </View>
                <Pressable style={stylesLight.settings}>
                    <Octicons style={stylesLight.icon} name="gear" size={25} color={'#585858'}/>
                </Pressable>
                <View style={stylesLight.menuContainer}>
                    <Pressable style={stylesLight.button} onPress={() => router.navigate('/to-do-list/to-do-list')}>
                        <Octicons style={stylesLight.icon} name="list-unordered" size={50} color={'#585858'}/>
                        <Text style={stylesLight.buttonText}>To-Do</Text>
                    </Pressable>
                    <Pressable style={stylesLight.button} onPress={() => router.navigate('/calendar/calendar')}>
                        <Octicons style={stylesLight.icon} name="calendar" size={50} color={'#585858'}/>
                        <Text style={stylesLight.buttonText}>Calendar</Text>
                    </Pressable>
                    <Pressable style={stylesLight.button} onPress={() => router.navigate('/logs/diaryLogs')}>
                        <Octicons style={stylesLight.icon} name="repo" size={50} color={'#585858'}/>
                        <Text style={stylesLight.buttonText}>Diary</Text>
                    </Pressable>
                    <Pressable style={stylesLight.button} onPress={() => router.navigate('/logs/peopleLogs')}>
                        <Octicons style={stylesLight.icon} name="people" size={50} color={'#585858'}/>
                        <Text style={stylesLight.buttonText}>People</Text>
                    </Pressable>
                    <Pressable style={stylesLight.button} onPress={() => router.navigate('/logs/medicationLogs')}>
                        <Lucide style={stylesLight.icon} name="pill" size={50} color={'#585858'}/>
                        <Text style={stylesLight.buttonText}>Medication</Text>
                    </Pressable>
                    <Pressable style={stylesLight.button}>
                        <Octicons style={stylesLight.icon} name="clock" size={50} color={'#585858'}/>
                        <Text style={stylesLight.buttonText}>Clock</Text>
                    </Pressable>
                </View>  
                <Pressable style={stylesLight.emergencyButton}>
                    <View style={stylesLight.redBorder}>
                        <Lucide style={stylesLight.emergencyIcon} name="activity" size={50} color={'#c00f0fff'}/>
                        <Text style={stylesLight.emergencyButtonText}>EMERGENCY</Text>
                    </View>                    
                </Pressable>              
            </LinearGradient>) : 
            (<LinearGradient style={stylesLight.contentContainer} colors={["#e3e3e3", "#aaaaaa"]}>
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
        marginTop: 200,
        marginRight:"auto",
        marginLeft: "auto",
        marginBottom: 10,
        flex: 2,
    },
    header: {
        fontFamily: "PTSans-Regular",
        fontSize: 35,
        textAlign: "center",
        lineHeight: 30
    },
    header2: {
        fontFamily: "PTSans-Regular",
        fontSize: 80,
        textAlign: "center",
    },
    loginContainer: {
        marginRight:"auto",
        marginLeft: "auto",
        flex: 1,
        marginBottom: 200,
    },
    clickableAccount: {
        backgroundColor: "#f2f2f2",
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 25,
        elevation: 5,
        marginBottom: 10
    },
    clickableAccountText: {
        fontFamily: "Roboto-Regular",
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
        fontFamily: "PTSans-Regular",
        fontSize: 40
    },
    menuContainer: {
        flexDirection: "row",
        flexWrap: 'wrap',
        justifyContent: "space-between",
        marginLeft: 30,
        marginRight: 30
    },
    button: {
        backgroundColor: "#f2f2f2",
        marginTop: 30,
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        width: "45%"
    },
    buttonText: {
        fontFamily: "PTSans-Regular",
        fontSize: 16,
        textAlign: "center",
        marginTop: 10
    },
    icon: {
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    emergencyIcon: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10
    },
    emergencyButton: {
        backgroundColor: "#f2f2f2",
        marginTop: 30,
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        marginLeft: 30,
        marginRight: 30,
    },
    emergencyButtonText: {
        fontFamily: "PTSans-Regular",
        fontSize: 16,
        textAlign: "center",
        marginTop: 10,
        marginBottom: 10
    },
    redBorder: {
        borderColor: "#c00f0fff",
        borderWidth: 8,
        borderRadius: 10,
    },
    settings: {
        position: "absolute",
        right: 40,
        top: 35,
    },
});

export default Home;