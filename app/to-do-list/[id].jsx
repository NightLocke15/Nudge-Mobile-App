import NormalList from "@/AppComponents/normalList";
import TimedList from "@/AppComponents/timedList";
import { UserContext } from "@/AppContexts/UserContext";
import { useLocalSearchParams } from "expo-router";
import { useContext, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


function MakeList() {
    const { localUserInfo } = useContext(UserContext); 
    const { id } = useLocalSearchParams();
    const [index, setIndex] = useState(localUserInfo[0].lists.findIndex((log) => log.id === id));    

    return (
        <SafeAreaView style={stylesLight.container}>
            {localUserInfo[0].lists[index].type === "Normal" ? 
            <NormalList id={index}/> : <TimedList id={index} />}
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
})

export default MakeList;