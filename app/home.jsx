import { ThemeContext } from "@/AppContexts/ThemeContext";
import { UserContext } from "@/AppContexts/UserContext";
import { Lucide } from "@react-native-vector-icons/lucide";
import { Octicons } from "@react-native-vector-icons/octicons";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useContext } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

function Home() {
    //Accesses user context in order to determine if the user has logged in or not
    const { authenticated, logout, localUserInfo } = useContext(UserContext);

    const {currentTheme, gradientColours } = useContext(ThemeContext);

    //Router that allows the user to navigate to the different pages in the app
    const router = useRouter();

    return (
        <SafeAreaView style={currentTheme.includes("Light") ? stylesLight.container : stylesDark.container}>
            <StatusBar barStyle={currentTheme.includes("Light") ? "dark-content" : "light-content"} backgroundColor={currentTheme.includes("Light") ? "#e3e3e3" : "#2b2b2b"} />
            {JSON.parse(authenticated) ? 
            (<LinearGradient style={currentTheme.includes("Light") ? stylesLight.contentContainer : stylesDark.contentContainer} colors={gradientColours}>
                <View style={currentTheme.includes("Light") ? stylesLight.homeHeaderContainer : stylesDark.homeHeaderContainer}>
                    <Text style={currentTheme.includes("Light") ? stylesLight.homeHeader : stylesDark.homeHeader}>NUDGE</Text>
                </View>
                <Pressable style={currentTheme.includes("Light") ? stylesLight.settings : stylesDark.settings} onPress={() => router.navigate('/settings/settings')}>
                    <Octicons style={currentTheme.includes("Light") ? stylesLight.icon : stylesDark.icon} name="gear" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                </Pressable>
                <View style={currentTheme.includes("Light") ? stylesLight.menuContainer : stylesDark.menuContainer}>
                    <Pressable style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.button : stylesDark.button, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]} onPress={() => router.navigate('/to-do-list/to-do-list')}>
                        <Octicons style={currentTheme.includes("Light") ? stylesLight.icon : stylesDark.icon} name="list-unordered" size={50} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                        <Text style={currentTheme.includes("Light") ? stylesLight.buttonText : stylesDark.buttonText}>To-Do</Text>
                    </Pressable>
                    <Pressable style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.button : stylesDark.button, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]} onPress={() => router.navigate('/calendar/calendar')}>
                        <Octicons style={currentTheme.includes("Light") ? stylesLight.icon : stylesDark.icon} name="calendar" size={50} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                        <Text style={currentTheme.includes("Light") ? stylesLight.buttonText : stylesDark.buttonText}>Calendar</Text>
                    </Pressable>
                    <Pressable style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.button : stylesDark.button, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]} onPress={() => router.navigate('/logs/diaryLogs')}>
                        <Octicons style={currentTheme.includes("Light") ? stylesLight.icon : stylesDark.icon} name="repo" size={50} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                        <Text style={currentTheme.includes("Light") ? stylesLight.buttonText : stylesDark.buttonText}>Diary</Text>
                    </Pressable>
                    <Pressable style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.button : stylesDark.button, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]} onPress={() => router.navigate('/logs/peopleLogs')}>
                        <Octicons style={currentTheme.includes("Light") ? stylesLight.icon : stylesDark.icon} name="people" size={50} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                        <Text style={currentTheme.includes("Light") ? stylesLight.buttonText : stylesDark.buttonText}>People</Text>
                    </Pressable>
                    <Pressable style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.button : stylesDark.button, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]} onPress={() => router.navigate('/logs/medicationLogs')}>
                        <Lucide style={currentTheme.includes("Light") ? stylesLight.icon : stylesDark.icon} name="pill" size={50} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                        <Text style={currentTheme.includes("Light") ? stylesLight.buttonText : stylesDark.buttonText}>Medication</Text>
                    </Pressable>
                    <Pressable style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.button : stylesDark.button, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]} onPress={() => router.navigate('/clock/clock')}>
                        <Octicons style={currentTheme.includes("Light") ? stylesLight.icon : stylesDark.icon} name="clock" size={50} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                        <Text style={currentTheme.includes("Light") ? stylesLight.buttonText : stylesDark.buttonText}>Clock</Text>
                    </Pressable>
                </View>  
                <Pressable style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.emergencyButton : stylesDark.emergencyButton, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]} onPress={() => router.navigate('/emergency/emergency')}>
                    <View style={currentTheme.includes("Light") ? stylesLight.redBorder : stylesDark.redBorder}>
                        <Lucide style={currentTheme.includes("Light") ? stylesLight.emergencyIcon : stylesDark.emergencyIcon} name="activity" size={50} color={'#c00f0fff'}/>
                        <Text style={currentTheme.includes("Light") ? stylesLight.emergencyButtonText : stylesDark.emergencyButtonText}>EMERGENCY</Text>
                    </View>                    
                </Pressable>              
            </LinearGradient>) : 
            (<LinearGradient style={currentTheme.includes("Light") ? stylesLight.contentContainer : stylesDark.contentContainer} colors={gradientColours}>
                <View style={currentTheme.includes("Light") ? stylesLight.headerContainer : stylesDark.headerContainer}>
                    <Text style={currentTheme.includes("Light") ? stylesLight.header : stylesDark.header}>Welcome to</Text>
                    <Text style={currentTheme.includes("Light") ? stylesLight.header2 : stylesDark.header2}>NUDGE</Text>
                </View>
                <View style={currentTheme.includes("Light") ? stylesLight.loginContainer : stylesDark.loginContainer}>
                    <Pressable  style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.clickableAccount : stylesDark.clickableAccount, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]} onPress={() => router.navigate('/account/login')}>
                        <Text style={currentTheme.includes("Light") ? stylesLight.clickableAccountText : stylesDark.clickableAccountText}>Log In</Text>
                    </Pressable> 
                    <Pressable  style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.clickableAccount : stylesDark.clickableAccount, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]} onPress={() => router.navigate('/account/createAccount')}>
                        <Text style={currentTheme.includes("Light") ? stylesLight.clickableAccountText : stylesDark.clickableAccountText}>Create Account</Text>
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
        color: "#242424",
        fontSize: 35,
        textAlign: "center",
        lineHeight: 30
    },
    header2: {
        fontFamily: "PTSans-Regular",
        color: "#242424",
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
        color: "#242424",
        fontSize: 20,
        textAlign: "center"
    },
    
    //Home after login
    homeHeaderContainer: {
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 20,
    },
    homeHeader: {
        fontFamily: "PTSans-Regular",
        color: "#242424",
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
        color: "#242424",
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
        color: "#242424",
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

const stylesDark = StyleSheet.create({
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
        color: "#e3e3e3",
        fontSize: 35,
        textAlign: "center",
        lineHeight: 30
    },
    header2: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
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
        backgroundColor: "#3a3a3a",
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
        color: "#e3e3e3",
        fontSize: 20,
        textAlign: "center"
    },
    
    //Home after login
    homeHeaderContainer: {
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 20,
    },
    homeHeader: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
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
        backgroundColor: "#3a3a3a",
        marginTop: 30,
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        width: "45%"
    },
    buttonText: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
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
        backgroundColor: "#3a3a3a",
        marginTop: 30,
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        marginLeft: 30,
        marginRight: 30,
    },
    emergencyButtonText: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
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