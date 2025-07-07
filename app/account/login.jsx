import { UserContext } from "@/AppContexts/UserContext";
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
            if (users[i].email === email && users[i].password === password) {
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
        <SafeAreaView style={styles.container}>
            <View>
                <Text>Welcome Back!</Text>
                {message ? <Text>You're Email or Password is incorrect.</Text> : <Text></Text>}
                <View>
                    <Text>Email Address</Text>
                    <TextInput placeholder="Email Address..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setEmail(e)}/>
                </View>
                <View>
                    <Text>Password</Text>
                    <TextInput placeholder="Password..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setPassword(e)}/>
                </View>                
                <Pressable onPress={() => handleLogin(email, password)}>
                    <Text>Log In</Text>
                </Pressable>
                <Text>No Account Yet?</Text>
                <Pressable onPress={() => router.navigate('/account/createAccount')}>
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

export default Login;