import { UserContext } from "@/AppContexts/UserContext";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Pressable, TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

function CreateAccount() {
    //Accessing user context and all the users that already exist
    const { users, createUserProfile } = useContext(UserContext);

    //Stores chosen detaiuls so it can be added to the list of users when the user creates an account
    const [chosenUsername, setChosenUsername] = useState("");
    const [chosenPassword, setChosenPassword] = useState("");
    const [chosenEmail, setChosenEmail] = useState("");

    //Messages given to user when details they have given in invalid
    const [emailMessage, setEmailMessage] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");

    //Router used to take the user back to the home page after logging in
    const router = useRouter();

    //Function called when user creates account. Checks whether all the messages are clear and the data is valid before creating the account
    function createAccount(username, password, email) {
        if (emailMessage === "" && passwordMessage === "" && chosenEmail !== "" && chosenUsername !== "" && chosenPassword !== "") {
            const idNum = createID(); //create an ID
            if (users.some((user) => user.idnum === idNum)) { //check if ID is unique
                createAccount(username, password, email)
            }
            else {
                createUserProfile(username, idNum, password, email);
                router.navigate('/home');                
            }            
        }
    }

    //Checks whether username can be used, or if it has been used before
    function checkUsername(e) {
        setChosenUsername(e);
    }

    //Checks whether email provided has been used to make an account before
    function checkEmail(e) {
        for (let i = 0; i < users.length; i++) {
            if (users[i].email === e) {
                setEmailMessage("This Email Already Has An Account.");
            }
            else {
                setEmailMessage("");
                setChosenEmail(e);
            }
        }
    }

    //Makes sure password contains all the required characters
    function checkPasssword(e) {
        if (e.length >= 8 && /\d/.test(e) && /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/.test(e)) {
            setPasswordMessage("")
            setChosenPassword(e);
        }
        else {
            setPasswordMessage("Password Does Not Match Parameters.")
        }
    }

    //Creates unique ID for each user so that account's data can be saved under this number
    function createID() {
        let result = '';
        for (let i = 0; i < 10; i++) {
            result += Math.floor(Math.random() * 10);
        }
        return result;
    }

    return (
        <SafeAreaView style={stylesLight.container}>
            <LinearGradient style={stylesLight.contentContainer} colors={["#ffffff", "#aaaaaa"]}>                
                <View style={stylesLight.headerContainer}>
                    <Text style={stylesLight.header}>WELCOME!</Text>
                </View>                
                <View style={stylesLight.formContainer}>
                    <View>
                        <Text style={stylesLight.label}>Username</Text>
                        <TextInput style={stylesLight.input} placeholder="Username..." placeholderTextColor="#9e9e9e" onChangeText={(e) => checkUsername(e)}/>
                    </View>
                    <View>
                        <Text style={stylesLight.label}>Email Address</Text>
                        <TextInput style={stylesLight.input} placeholder="Email Address..." placeholderTextColor="#9e9e9e" onChangeText={(e) => checkEmail(e)}/>
                        <Text style={stylesLight.message}>{emailMessage}</Text>
                    </View>
                    <View>
                        <Text style={stylesLight.label}>Password</Text>
                        <TextInput style={stylesLight.input} placeholder="Password..." placeholderTextColor="#9e9e9e" onChangeText={(e) => checkPasssword(e)}/>
                        <Text style={stylesLight.passwordMessage}>Password should contain at least 8 characters, 1 number and 1 special character.</Text>
                        <Text style={stylesLight.message}>{passwordMessage}</Text>
                    </View>
                </View>     
                <View style={stylesLight.accountContainer}>
                    <Pressable style={stylesLight.clickable} onPress={() => createAccount(chosenUsername, chosenPassword, chosenEmail)}>
                        <Text style={stylesLight.clickableText}>Create Account</Text>
                    </Pressable>
                    <Text style={stylesLight.loginLabel}>Already have an Account?</Text>
                    <Pressable onPress={() => router.navigate('/account/login')}>
                        <Text style={stylesLight.loginLink}>Log In</Text>
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
    headerContainer: {
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 100,
        marginBottom: 30
    },
    header: {
        fontFamily: "Economica-Bold",
        fontSize: 90
    },
    formContainer: {
        flex: "20%",
        marginLeft: 30,
        marginRight: 30,
    },
    label: {
        fontFamily: "Sunflower-Light",
        fontSize: 18,
        marginTop: 20
    },
    input: {
        border: 0.5,
        borderColor: "#4d4d4d",
        borderRadius: 10,
        height: 40,
        padding: 5,
        width: "100%",
        elevation: 5,
        backgroundColor: "#fff"
    },
    message: {
        flex: "3%",
        fontFamily: "Sunflower-Medium",
        fontSize: 15,
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 8,
        color: "#e70000"
    },
    passwordMessage: {
        fontFamily: "Sunflower-Medium",
        fontSize: 12,
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 10
    },
    accountContainer: {
        flex: "20%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 40
    },
    clickable: {
        backgroundColor: "#f0f0f0",
        padding: 15,
        borderRadius: 25,
        elevation: 5,
        marginBottom: 15
    },
    clickableText: {
        fontFamily: "Sunflower-Light",
        fontSize: 18,
        textAlign: "center"
    },
    loginLabel: {
        fontFamily: "Sunflower-Light",
        fontSize: 18
    },
    loginLink: {
        fontFamily: "Sunflower-Light",
        fontSize: 18,
        color: "#1966ff",
        textDecorationLine: "underline",
        textAlign: "center"
    }
});

export default CreateAccount;