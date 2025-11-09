import { ThemeContext } from "@/AppContexts/ThemeContext";
import { UserContext } from "@/AppContexts/UserContext";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { Pressable, TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

function Login() {
    //Access to the user context and all the existing users
    const { login, users, setLocalUser, setLocalUserInfo } = useContext(UserContext);
    const {currentTheme, gradientColours } = useContext(ThemeContext);

    //Stores the details that the user provides so it can be checked against existing details
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //Message provided to user if their details are incorrect
    const [message, setMessage] = useState(false);

    //Router to navigate the user back to the home page
    const router = useRouter();

    //Checks whether the data that the user provided matches the data that has been saved before it logs them in
    function handleLogin(email, password) {        
        for (let i = 0; i < users.length; i++) {
            if (users[i].email === email && users[i].password === password && email !== "" && password !== "") {
                login(true);
                setMessage(false);      
                setLocalUser(users[i].idnum); 
                router.navigate('/home');
            }
            else {
                login(false);
                setMessage(true);
            }
        }
    }

    return (
        <SafeAreaView style={currentTheme.includes("Light") ? stylesLight.container : stylesDark.container}>
            <StatusBar barStyle={currentTheme.includes("Light") ? "dark-content" : "light-content"} backgroundColor={currentTheme.includes("Light") ? "#e3e3e3" : "#2b2b2b"} />
            <LinearGradient style={currentTheme.includes("Light") ? stylesLight.contentContainer : stylesDark.contentContainer} colors={gradientColours}>
                <View style={currentTheme.includes("Light") ? stylesLight.headerContainer : stylesDark.headerContainer}>
                    <Text style={currentTheme.includes("Light") ? stylesLight.header : stylesDark.header}>Welcome Back!</Text>
                </View>                
                {message ? <Text style={currentTheme.includes("Light") ? stylesLight.message : stylesDark.message}>You're Email or Password is incorrect.</Text> : <Text style={currentTheme.includes("Light") ? stylesLight.message : stylesDark.message}></Text>}
                <View style={currentTheme.includes("Light") ? stylesLight.formContainer : stylesDark.formContainer}>
                    <View>
                        <Text style={currentTheme.includes("Light") ? stylesLight.label : stylesDark.label}>Email Address</Text>
                        <TextInput style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} placeholder="Email Address..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setEmail(e)}/>
                    </View>
                    <View>
                        <Text style={currentTheme.includes("Light") ? stylesLight.label : stylesDark.label}>Password</Text>
                        <TextInput style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} placeholder="Password..." placeholderTextColor="#9e9e9e" secureTextEntry={true} onChangeText={(e) => setPassword(e)}/>
                    </View> 
                </View>                      
                <View style={currentTheme.includes("Light") ? stylesLight.accountContainer : stylesDark.accountContainer}>
                    <Pressable style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.clickable : stylesDark.clickable, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]} onPress={() => handleLogin(email, password)}>
                        <Text style={currentTheme.includes("Light") ? stylesLight.clickableText : stylesDark.clickableText}>Log In</Text>
                    </Pressable>
                    <Text style={currentTheme.includes("Light") ? stylesLight.createLabel : stylesDark.createLabel}>No Account Yet?</Text>
                    <Pressable onPress={() => router.navigate('/account/createAccount')}>
                        <Text style={currentTheme.includes("Light") ? stylesLight.createLink : stylesDark.createLink}>Create Account</Text>
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
        flex: 1
    },
    headerContainer: {
        flex: "20%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 180,
    },
    header: {
        fontFamily: "PTSans-Regular",
        color: "#242424",
        fontSize: 65,
        textAlign: "center"
    },
    formContainer: {
        flex: "40%",
        marginLeft: 30,
        marginRight: 30,
    },
    label: {
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 18
    },
    input: {
        borderWidth: 0.5,
        borderColor: "#4d4d4d",
        color: "#242424",
        borderRadius: 10,
        height: 40,
        padding: 5,
        width: "100%",
        elevation: 5,
        marginBottom: 25,
        backgroundColor: "#e3e3e3"
    },
    accountContainer: {
        flex: "40%",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 150
    },
    clickable: {
        backgroundColor: "#f2f2f2",
        padding: 15,
        borderRadius: 25,
        elevation: 5,
        marginBottom: 20
    },
    clickableText: {
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 20,
        textAlign: "center"
    },
    createLabel: {
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 18
    },
    createLink: {
        fontFamily: "Roboto-Regular",
        fontSize: 18,
        color: "#1966ff",
        textDecorationLine: "underline",
        textAlign: "center"
    },
    message: {
        flex: "3%",
        fontFamily: "Roboto-Regular",
        fontSize: 17,
        margin: "auto",
        marginBottom: 15,
        color: "#e70000"
    }
});

const stylesDark = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1
    },
    headerContainer: {
        flex: "20%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 180,
    },
    header: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
        fontSize: 65,
        textAlign: "center"
    },
    formContainer: {
        flex: "40%",
        marginLeft: 30,
        marginRight: 30,
    },
    label: {
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 18
    },
    input: {
        borderWidth: 0.5,
        borderColor: "#000000",
        color: "#e3e3e3",
        borderRadius: 10,
        height: 40,
        padding: 5,
        width: "100%",
        elevation: 5,
        marginBottom: 25,
        backgroundColor: "#2b2b2b"
    },
    accountContainer: {
        flex: "40%",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 150
    },
    clickable: {
        backgroundColor: "#3a3a3a",
        padding: 15,
        borderRadius: 25,
        elevation: 5,
        marginBottom: 20
    },
    clickableText: {
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 20,
        textAlign: "center"
    },
    createLabel: {
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 18
    },
    createLink: {
        fontFamily: "Roboto-Regular",
        fontSize: 18,
        color: "#1966ff",
        textDecorationLine: "underline",
        textAlign: "center"
    },
    message: {
        flex: "3%",
        fontFamily: "Roboto-Regular",
        fontSize: 17,
        margin: "auto",
        marginBottom: 15,
        color: "#e70000"
    }
});

export default Login;