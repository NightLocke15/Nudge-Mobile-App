import { UserContext } from "@/AppContexts/UserContext";
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
        <SafeAreaView style={styles.container}>
            {authenticated ? 
            <View>
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
            </View> : 
            <View>
                <Text>Welcome to Nudge</Text>
                <Pressable onPress={() => router.navigate('/account/login')}>
                    <Text>Log In</Text>
                </Pressable>                
                <Pressable  onPress={() => router.navigate('/account/createAccount')}>
                    <Text>Create Account</Text>
                </Pressable>
            </View>}
        </SafeAreaView>
    )
}

//Styles for this page
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    }
});

export default Home;