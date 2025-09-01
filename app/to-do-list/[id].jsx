import NormalList from "@/AppComponents/normalList";
import TimedList from "@/AppComponents/timedList";
import { UserContext } from "@/AppContexts/UserContext";
import { useLocalSearchParams } from "expo-router";
import { useContext, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


function MakeList() {
    //Accessing user context and all the users that already exist
    const { localUserInfo } = useContext(UserContext); 

    //ID received through the router dynamically navigating to this page, and injecting the relevant information
    const { id } = useLocalSearchParams();

    //Converting the user ID to its index in the array inorder to easily access the relevant info.
    const [index, setIndex] = useState(localUserInfo[0].lists.findIndex((log) => log.id === id));    

    //Renders the relevent information based on the type of list
    return (
        <SafeAreaView style={styles.container}>
            {localUserInfo[0].lists[index].type === "Normal" ? 
            <NormalList id={index}/> : <TimedList id={index} />}
        </SafeAreaView>
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