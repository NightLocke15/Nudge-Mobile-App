import { UserContext } from "@/AppContexts/UserContext";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Pressable, TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

function Login() {
    //Access to the user context and all the existing users
    const { login, users, setLocalUser } = useContext(UserContext);

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
        <SafeAreaView style={stylesLight.container}>
            <LinearGradient style={stylesLight.contentContainer} colors={["#ffffff", "#aaaaaa"]}>
                <View style={stylesLight.headerContainer}>
                    <Text style={stylesLight.header}>WELCOME BACK!</Text>
                </View>                
                {message ? <Text style={stylesLight.message}>You're Email or Password is incorrect.</Text> : <Text style={stylesLight.message}></Text>}
                <View style={stylesLight.formContainer}>
                    <View>
                        <Text style={stylesLight.label}>Email Address</Text>
                        <TextInput style={stylesLight.input} placeholder="Email Address..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setEmail(e)}/>
                    </View>
                    <View>
                        <Text style={stylesLight.label}>Password</Text>
                        <TextInput style={stylesLight.input} placeholder="Password..." placeholderTextColor="#9e9e9e" secureTextEntry={true} onChangeText={(e) => setPassword(e)}/>
                    </View> 
                </View>                      
                <View style={stylesLight.accountContainer}>
                    <Pressable style={stylesLight.clickable} onPress={() => handleLogin(email, password)}>
                        <Text style={stylesLight.clickableText}>Log In</Text>
                    </Pressable>
                    <Text style={stylesLight.createLabel}>No Account Yet?</Text>
                    <Pressable onPress={() => router.navigate('/account/createAccount')}>
                        <Text style={stylesLight.createLink}>Create Account</Text>
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
        fontFamily: "Economica-Bold",
        fontSize: 65
    },
    formContainer: {
        flex: "40%",
        marginLeft: 30,
        marginRight: 30,
    },
    label: {
        fontFamily: "Sunflower-Light",
        fontSize: 18
    },
    input: {
        borderWidth: 0.5,
        borderColor: "#4d4d4d",
        borderRadius: 10,
        height: 40,
        padding: 5,
        width: "100%",
        elevation: 5,
        marginBottom: 25,
        backgroundColor: "#fff"
    },
    accountContainer: {
        flex: "40%",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 150
    },
    clickable: {
        backgroundColor: "#f0f0f0",
        padding: 15,
        borderRadius: 25,
        elevation: 5,
        marginBottom: 20
    },
    clickableText: {
        fontFamily: "Sunflower-Light",
        fontSize: 20,
        textAlign: "center"
    },
    createLabel: {
        fontFamily: "Sunflower-Light",
        fontSize: 18
    },
    createLink: {
        fontFamily: "Sunflower-Light",
        fontSize: 18,
        color: "#1966ff",
        textDecorationLine: "underline",
        textAlign: "center"
    },
    message: {
        flex: "3%",
        fontFamily: "Sunflower-Medium",
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
        fontFamily: "Economica-Bold",
        fontSize: 65,
        color: "#fff"
    },
    formContainer: {
        flex: "40%",
        marginLeft: 30,
        marginRight: 30,
    },
    label: {
        fontFamily: "Sunflower-Light",
        fontSize: 18,
        color: "#fff"
    },
    input: {
        borderWidth: 0.5,
        borderColor: "#000000",
        borderRadius: 10,
        height: 40,
        padding: 5,
        width: "100%",
        elevation: 5,
        marginBottom: 25,
        backgroundColor: "#323232"
    },
    accountContainer: {
        flex: "40%",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 150
    },
    clickable: {
        backgroundColor: "#3b3b3b",
        padding: 15,
        borderRadius: 25,
        elevation: 5,
        marginBottom: 20
    },
    clickableText: {
        fontFamily: "Sunflower-Light",
        fontSize: 20,
        textAlign: "center",
        color: "#fff"
    },
    createLabel: {
        color: "#fff",
        fontFamily: "Sunflower-Light",
        fontSize: 18
    },
    createLink: {
        fontFamily: "Sunflower-Light",
        fontSize: 18,
        color: "#1966ff",
        textDecorationLine: "underline"
    },
    message: {
        flex: "3%",
        fontFamily: "Sunflower-Medium",
        fontSize: 17,
        margin: "auto",
        marginBottom: 15,
        color: "#e70000"
    }
});

export default Login;