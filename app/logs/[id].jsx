import Diary from "@/AppComponents/diary";
import People from "@/AppComponents/people";
import { UserContext } from "@/AppContexts/UserContext";
import { useLocalSearchParams } from "expo-router";
import { useContext, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function MakeLog() {
    //ID received through the router dynamically navigating to this page, and injecting the relevant information
    const { id } = useLocalSearchParams();

    //Accessing user context and all the users that already exist
    const { localUserInfo } = useContext(UserContext); 

    //Converting the user ID to its index in the array inorder to easily access the relevant info.
    const [index, setIndex] = useState(localUserInfo[0].logs.findIndex((log) => log.id === id));   

    //Return the log dependent on the current log's type
    return (
        <SafeAreaView style = {stylesLight.container}>
            {localUserInfo[0].logs[index].type === "Diary" ? 
            <Diary id={index} /> :
            <People id={index} />}
        </SafeAreaView>
    )
}

const stylesLight = StyleSheet.create({
    container: {
        flex: 1
    },
});

export default MakeLog;