import { UserContext } from "@/Contexts/UserContext";
import { Link } from "expo-router";
import { useContext } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function Home() {
    const { authenticated } = useContext(UserContext);

    return (
        <SafeAreaView style={styles.container}>
            {authenticated ? 
            <View>
                <Text>NUDGE</Text>
                <Pressable>
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
            </View> : 
            <View>
                <Text>Welcome to Nudge</Text>
                <Link href={"/account/login"}>
                    <Pressable>
                        <Text>Log In</Text>
                    </Pressable>
                </Link>                
                <Link href={"/account/createAccount"}>
                    <Pressable>
                        <Text>Create Account</Text>
                    </Pressable>
                </Link>
            </View>}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    }
});

export default Home;