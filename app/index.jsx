import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function WelcomeScreen() {

    function getStarted() {
        console.log("Pressed");
    }

    return (
        <SafeAreaView style={styles.container}>      
            <View>
               <Text>NUDGE</Text>
               <Link href={"/home"}>
                    <Pressable onPress={getStarted}>
                            <Text>Get Started</Text>
                    </Pressable>
               </Link>               
            </View>      
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    }
});

export default WelcomeScreen;