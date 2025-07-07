import { UserContext } from "@/AppContexts/UserContext";
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
        if (emailMessage === "" && passwordMessage === "") {
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
        <SafeAreaView style={styles.container}>
            <View>
                <Text>Welcome!</Text>
                <View>
                    <Text>Username</Text>
                    <TextInput placeholder="Username..." placeholderTextColor="#9e9e9e" onChangeText={(e) => checkUsername(e)}/>
                </View>
                <View>
                    <Text>Email Address</Text>
                    <TextInput placeholder="Email Address..." placeholderTextColor="#9e9e9e" onChangeText={(e) => checkEmail(e)}/>
                    <Text>{emailMessage}</Text>
                </View>
                <View>
                    <Text>Password</Text>
                    <TextInput placeholder="Password..." placeholderTextColor="#9e9e9e" onChangeText={(e) => checkPasssword(e)}/>
                    <Text>{passwordMessage}</Text>
                </View>
                <Pressable onPress={() => createAccount(chosenUsername, chosenPassword, chosenEmail)}>
                    <Text>Create Account</Text>
                </Pressable>
            </View>
        </SafeAreaView>        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    }
});

export default CreateAccount;