import NormalList from "@/AppComponents/normalList";
import TimedList from "@/AppComponents/timedList";
import { UserContext } from "@/AppContexts/UserContext";
import { useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


function MakeList() {
    const { id } = useLocalSearchParams();
    const { localUserInfo } = useContext(UserContext); 

    return (
        <SafeAreaView style={stylesLight.container}>
            {localUserInfo[0].lists[id].type === "Normal" ? 
            <NormalList id={id}/> : <TimedList id={id} />}
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