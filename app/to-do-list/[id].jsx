import NormalList from "@/AppComponents/normalList";
import TimedList from "@/AppComponents/timedList";
import { ThemeContext } from "@/AppContexts/ThemeContext";
import { UserContext } from "@/AppContexts/UserContext";
import { useLocalSearchParams } from "expo-router";
import React, { useContext, useState } from "react";
import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


function MakeList() {
    //Accessing user context and all the users that already exist
    const { localUserInfo } = useContext(UserContext); 
    const {currentTheme, gradientColours } = useContext(ThemeContext);

    //ID received through the router dynamically navigating to this page, and injecting the relevant information
    const { id } = useLocalSearchParams();

    //Converting the user ID to its index in the array inorder to easily access the relevant info.
    const [index, setIndex] = useState(localUserInfo[0].lists.findIndex((log) => log.id === id));    

    //Renders the relevent information based on the type of list
    return (
        <React.Fragment>
                <SafeAreaView style={[styles.container, {backgroundColor: currentTheme.includes("Light") ? "#e3e3e3" : "#2b2b2b"}]}>
                    <StatusBar barStyle={currentTheme.includes("Light") ? "dark-content" : "light-content"} backgroundColor={currentTheme.includes("Light") ? "#e3e3e3" : "#2b2b2b"} />
            {localUserInfo[0].lists[index].type === "Normal" ? 
            <NormalList id={index}/> : <TimedList id={index} />}
        </SafeAreaView>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
    },
})

export default MakeList;