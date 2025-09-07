import { ThemeContext } from '@/AppContexts/ThemeContext';
import { UserContext } from '@/AppContexts/UserContext';
import Octicons from '@react-native-vector-icons/octicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Pressable, StyleSheet, Text, View } from "react-native";
import 'react-native-get-random-values';
import { SafeAreaView } from "react-native-safe-area-context";

function Emergency() {
    //Accessing user context and all the users that already exist
    const { localUser, localUserInfo, users, setUsers } = useContext(UserContext);
    const {currentTheme, gradientColours } = useContext(ThemeContext);

    const router = useRouter();
    
    return (
        <SafeAreaView style={currentTheme.includes("Light") ? stylesLight.container : stylesDark.container}>
            <LinearGradient style={currentTheme.includes("Light") ? stylesLight.contentContainer : stylesDark.contentContainer} colors={gradientColours}>
                <View style={currentTheme.includes("Light") ? stylesLight.headerContainer : stylesDark.headerContainer}>
                    <Pressable onPress={() => router.navigate("/home")} style={currentTheme.includes("Light") ? stylesLight.back : stylesDark.back}>
                        <Octicons name="home" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                    </Pressable>
                    <Text style={currentTheme.includes("Light") ? stylesLight.header : stylesDark.header}>Emergency</Text>
                </View>
                <View style={currentTheme.includes("Light") ? stylesLight.emergencyButtonHolder : stylesDark.emergencyButtonHolder}>
                    <Pressable style={currentTheme.includes("Light") ? stylesLight.emergencyButton : stylesDark.emergencyButton} onLongPress={() => console.log("Call Emergency Contact.")}>
                        <View style={currentTheme.includes("Light") ? stylesLight.redBorder : stylesDark.redBorder}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.textOne : stylesDark.textOne}>Hold to call</Text>
                            <Text style={currentTheme.includes("Light") ? stylesLight.textTwo : stylesDark.textTwo}>EMERGENCY CONTACT</Text>
                        </View>                    
                    </Pressable>
                    <Pressable style={currentTheme.includes("Light") ? stylesLight.emergencyButton : stylesDark.emergencyButton} onLongPress={() => console.log("Call Emergency Services.")}>
                        <View style={currentTheme.includes("Light") ? stylesLight.redBorder : stylesDark.redBorder}>                        
                            <Text style={currentTheme.includes("Light") ? stylesLight.textOne : stylesDark.textOne}>Hold to call</Text>
                            <Text style={currentTheme.includes("Light") ? stylesLight.textTwo : stylesDark.textTwo}>EMERGENCY SERVICES</Text>
                        </View>                    
                    </Pressable>
                </View>                
            </LinearGradient>
        </SafeAreaView>
    )
}

const stylesLight = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
    },
    back: {
        position: "absolute",
        left: "5%",
        top: "30%"        
    },
    headerContainer: {
        marginBottom: 20,
        marginTop: 20,
    },
    header: {
        fontFamily: "PTSans-Regular",
        color: "#242424",
        fontSize: 40,
        marginLeft: "auto",
        marginRight: "auto"
    },
    emergencyButton: {
        backgroundColor: "#f2f2f2",
        marginTop: 30,
        padding: 10,
        borderRadius: 10,
        elevation: 5,
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 50
    },
    textOne: {
        fontFamily: "PTSans-Regular",
        color: "#242424",
        fontSize: 16,
        textAlign: "center",
        marginTop: 10,
    },
    textTwo: {
        fontFamily: "PTSans-Regular",
        color: "#242424",
        fontSize: 25,
        textAlign: "center",
        marginBottom: 10
    },
    redBorder: {
        borderColor: "#c00f0fff",
        borderWidth: 8,
        borderRadius: 10,
    },
    emergencyButtonHolder: {
        marginTop: "30%",
    }
});

const stylesDark = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
    },
    back: {
        position: "absolute",
        left: "5%",
        top: "30%"        
    },
    headerContainer: {
        marginBottom: 20,
        marginTop: 20,
    },
    header: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
        fontSize: 40,
        marginLeft: "auto",
        marginRight: "auto"
    },
    emergencyButton: {
        backgroundColor: "#3a3a3a",
        marginTop: 30,
        padding: 10,
        borderRadius: 10,
        elevation: 5,
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 50
    },
    textOne: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
        fontSize: 16,
        textAlign: "center",
        marginTop: 10,
    },
    textTwo: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
        fontSize: 25,
        textAlign: "center",
        marginBottom: 10
    },
    redBorder: {
        borderColor: "#c00f0fff",
        borderWidth: 8,
        borderRadius: 10,
    },
    emergencyButtonHolder: {
        marginTop: "30%",
    }
});

export default Emergency;